"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

const PasskeyModel = () => {
  const router = useRouter();
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAccessKey = () => {
      const encryptedKey =
        typeof window !== "undefined"
          ? localStorage.getItem("accessKey")
          : null;

      try {
        const accessKey = encryptedKey ? decryptKey(encryptedKey) : null;

        if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
          setOpen(false);
          router.push("/admin");
        } else {
          setOpen(true);
        }
      } catch (error) {
        console.error("Error decrypting access key:", error);
        setOpen(true);
      }
    };

    checkAccessKey();
  }, [path, router]);

  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  const validatePasskey = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      try {
        const encryptedKey = encryptKey(passkey);
        localStorage.setItem("accessKey", encryptedKey);
        setOpen(false);
        router.push("/admin");
      } catch (error) {
        console.error("Error encrypting passkey:", error);
        setError("Unexpected error. Please try again.");
      }
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => setPasskey(value)}
          >
            <InputOTPGroup className="shad-otp">
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot key={index} className="shad-otp-slot" index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 flex justify-center">
              {error}
            </p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={validatePasskey}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasskeyModel;
