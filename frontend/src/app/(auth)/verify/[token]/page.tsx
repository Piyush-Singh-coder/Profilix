"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, AlertCircle } from "lucide-react";

export default function VerifyTokenPage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;
  
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleVerify = async () => {
    if (!token) return;
    setStatus("loading");
    try {
      await verifyEmail(token);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to verify email");
    }
  };

  return (
    <>
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl font-headline font-bold text-text-primary mb-3">
          {status === "idle" && "Verify your Email"}
          {status === "loading" && "Verifying Data"}
          {status === "success" && "Verification Complete"}
          {status === "error" && "Invalid Link"}
        </h1>
        <p className="text-text-secondary max-w-md mx-auto lg:mx-0">
          Finalizing the activation of your developer account.
        </p>
      </div>

      <div className="flex flex-col items-center lg:items-start gap-6">
        {status === "idle" && (
           <Button onClick={handleVerify} className="w-full max-w-sm">
             Verify My Email
           </Button>
        )}

        {status === "loading" && (
           <Button disabled className="w-full max-w-sm">
             Verifying Secure Token...
           </Button>
        )}

        {status === "success" && (
          <div className="p-6 bg-surface-high border border-green-500/30 rounded-xl w-full max-w-sm text-center">
            <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Verified Successfully!</h3>
            <p className="text-sm text-text-secondary mb-6">
              Your account is now primed and active. You can proceed to securely log in.
            </p>
            <Button
              onClick={() => router.push("/login")}
              className="w-full bg-green-600 hover:bg-green-500 text-white border-transparent"
            >
              Continue to Login
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="p-6 bg-surface-high border border-red-500/30 rounded-xl w-full max-w-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold text-text-primary mb-2">Verification Failed</h3>
            <p className="text-sm text-text-secondary mb-6">
              {errorMsg}
            </p>
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="w-full"
            >
              Return to Login
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
