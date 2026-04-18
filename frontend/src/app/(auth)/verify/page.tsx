"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { MailCheck } from "lucide-react";

export default function VerifyPendingPage() {
  const router = useRouter();

  return (
    <>
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-headline font-bold text-text-primary mb-3">
          Check your Inbox
        </h1>
        <p className="text-text-secondary max-w-md mx-auto lg:mx-0">
          We've shipped a verification link to your email address. Please click it to activate your account.
        </p>
      </div>

      <div className="flex flex-col items-center lg:items-start gap-6">
        <div className="p-6 bg-surface-high border border-border rounded-xl w-full max-w-sm text-center">
          <MailCheck className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-text-primary mb-2">Email Dispatched</h3>
          <p className="text-sm text-text-secondary mb-6">
            Check your spam folder if you don't see it fly in within the next few minutes.
          </p>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            className="w-full"
          >
            I've already verified
          </Button>
        </div>
      </div>
    </>
  );
}
