"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AuthForm from "../AuthForm";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { CreateAppointmentSchema, getAppointmentSchema, UserFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";



const AppointmentForm = ({
    userId, patientId , type, appointment, setOpen
}: {
    userId: string;
    patientId: string;
    type: 'create' | 'cancel' | 'schedule' | 'pending';
    appointment?: Appointment;
    setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment.schedule) : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment ? appointment.note : '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  const onSubmit = async (values : z.infer<typeof AppointmentFormValidation>) => {
    setIsLoading(true);

    let status;
    switch (type) {
        case 'schedule':
            status = 'scheduled';
            break;
        case 'cancel':
            status = 'cancelled';
            break;
        default:
            status = 'pending';
            break;
    }

    try {
      if(type === 'create' && patientId) {
        const appointmentData = {
            userId,
            patient: patientId,
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            reason: values.reason!,
            note: values.note,
            status: status as Status
        }
        const appointment = await createAppointment(appointmentData);

        if(appointment) {
            form.reset();
            router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId : appointment?.$id!,
          appointment: {
            primaryPhysician: values?.primaryPhysician,
            schedule: new Date(values?.schedule),
            status: status as Status,
            cancellationReason: values?.cancellationReason,
          },
          type
        }
        const updatedAppoinment = await updateAppointment(appointmentToUpdate);

        if(updatedAppoinment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }

    } catch (error) {
      console.error("Error creating user:", error);
      // Optionally: Show a user-friendly error message here.
    } finally {
      setIsLoading(false);
    }
  };

  let buttonLabel;

  switch (type) {
    case 'cancel':
        buttonLabel = 'Cancel Appointment'
        break;
    case 'create':
        buttonLabel = 'Create Appointment'
        break;
    case 'schedule':
        buttonLabel = 'Schedule Appointment'
        break;
    default:
        break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === 'create' && <section className="mb-6 space-y-4">
          <h1 className="header">Welcome</h1>
          <p className="text-dark-700">Request for an appointment</p>
        </section> }
         {type !== 'cancel' && (
            <>
             <AuthForm
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Doctor"
            placeholder="Select a doctor"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </AuthForm>

          <AuthForm 
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="schedule"
          label="Expected appoinment date"
          showTimeSelect
          dateFormat="MM/dd/yyyy - h:mm aa"
          />

          <div className="flex flex-col gap-6 md:flex-row">
            <AuthForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='reason'
            label='Reason for appointment'
            placeholder="Enter reason for appointment"
            />
             <AuthForm
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name='note'
            label='Note'
            placeholder="Enter notes"
            />
          </div>
       </>
         )}

         {type === 'cancel' && (
            <AuthForm 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            placeholder="Enter reason for cancellation"
            />
         )}
        {/* Submit Button */}
        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ?
            'shad-danger-btn' : 'shad-primary-btn'}`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  );
};

export default AppointmentForm;
