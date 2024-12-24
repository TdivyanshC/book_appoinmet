'use server'
import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.actions'
import Image from 'next/image'
import React from 'react'

const Register = async ({params: {userId}}: SearchParamProps) => {
    const user = await getUser(userId);
  return (
    <div className="flex h-screen max-h-screen">
      {/* otp verification */}
       <section className="remove-scrollbar container ">
        <div className="sub-container max-w-[880px] flex-1 py-10 flex-col">
          <Image src='/assets/icons/logo-full.svg' className="mb-12 h-10 w-fit" height={1000} width={1000} alt="pateint" />
           
           <RegisterForm user={user}/>

          <p className=" text-dark-600 py-8">
          © 2024 CarePulse
          </p>
         
        </div>
       </section>
       <Image src='/assets/images/register-img.png' height={1000} width={1000} alt="patient" className="side-img max-w-[390px]" />
    </div>
  )
}

export default Register