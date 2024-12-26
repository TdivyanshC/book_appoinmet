'use client';

import PatientForm from "@/components/forms/PatientForm";
import PasskeyModel from "@/components/PasskeyModel";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  return (
    <div className="flex h-screen max-h-screen">
      {isAdmin && <PasskeyModel />}

      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[380px]">
          <Image
            src="/assets/icons/logo-full.svg"
            className="mb-12 h-10 w-fit"
            height={1000}
            width={1000}
            alt="patient"
          />
          <PatientForm />

          <div className="text-14-regular mt-2 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePulse
            </p>
            <Link href="/?admin=true" className="text-green-500">
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
}
