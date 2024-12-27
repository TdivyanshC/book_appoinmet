'use server'
import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, BUCKET_ID, DATABASE_ID, databases, ENDPOINT, messaging, PATIENT_COLLECTION_ID } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { Appointment } from "@/types/appwrite.types";

export const createAppointment = async (appointment: CreateAppointmentParams ) => {
    try {

        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        )

        return parseStringify(newAppointment);
    } catch (error) {
        console.log(error);
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        )

        return parseStringify(appointment);
    } catch (error) {
        console.log(error);
    }

}

export const getRecentApoointmentList = async () => {
    try {
        const appointment = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')]
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointment.documents as Appointment[]).reduce((acc, appoinment) => {
            if(appoinment.status === 'scheduled') {
                acc.scheduledCount += 1;
            } else if (appoinment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appoinment.status === 'cancelled') {
                acc.cancelledCount += 1;
            }
            return acc;
        }, initialCounts);

        const data = {
            totalCounts: appointment.total,
            ...counts,
            documents: appointment.documents
        }
        return parseStringify(data);
    } catch (error) {
        console.log(error);
        
    }
}

export const updateAppointment = async ( {appointmentId, userId, appointment, type} : UpdateAppointmentParams) => {

    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updatedAppointment) {
            throw new Error('Appointment not found');
        }

        const smsMessage = `
        Hi it's CarePulse.
        ${type === 'schedule'
        ?`Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} with Dr. ${appointment.primaryPhysician}`
        :`We regret to inform you that your appointment has been cancelled. Reason: ${appointment.cancellationReason}`
        }`
        await sendSMSNotification(userId, smsMessage);


        revalidatePath('/admin');
        return parseStringify(updatedAppointment);
    } catch (error) {
        console.log(error);
        
    }
} 

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
        const message = await messaging.createSms(
            ID.unique(),
            content,
            [],
            [userId]
        )

        return parseStringify(message)
    } catch (error) {
        console.log(error);  
    }
}