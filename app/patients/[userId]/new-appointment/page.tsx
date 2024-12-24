'use server'
import AppointmentForm from '@/components/forms/AppointmentForm'
import { getPatient, getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import React from 'react'

const NewAppointment = async ({params: {userId}}: SearchParamProps) => {
    const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">

       <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[880px] flex-1 justify-between">
          <Image src='/assets/icons/logo-full.svg' className="mb-12 h-10 w-fit" height={1000} width={1000} alt="pateint" />
           
          <AppointmentForm type='create' userId={userId} patientId={patient.$id}/>

          <p className=" text-dark-600 py-8">
          © 2024 CarePulse
          </p>
         
        </div>
       </section>
       <Image src='/assets/images/appointment-img.png' height={1000} width={1000} alt="appointment" className="side-img max-w-[390px]" />
    </div>
  )
}

export default NewAppointment