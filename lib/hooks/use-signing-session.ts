"use client";

import { useState, useEffect } from "react";
import type { SigningSession } from "@/lib/types";
import { getSigningSession, verifyOtp } from "@/lib/api/mock";

interface UseSigningSessionResult {
  session: SigningSession | null;
  isLoading: boolean;
  error: string | null;
  updateSession: (updates: Partial<SigningSession>) => void;
  verifyOtpCode: (code: string) => Promise<boolean>;
}

export function useSigningSession(token: string): UseSigningSessionResult {
  const [session, setSession] = useState<SigningSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      if (!token) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSigningSession(token);
        if (!data) {
          setError("Invalid or expired link");
        }
        setSession(data);
      } catch (err) {
        setError("Failed to load session");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSession();
  }, [token]);

  const updateSession = (updates: Partial<SigningSession>) => {
    setSession((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const verifyOtpCode = async (code: string): Promise<boolean> => {
    const result = await verifyOtp(token, code);
    if (result.success) {
      updateSession({ otpVerified: true, currentStep: "review" });
    }
    return result.success;
  };

  return { session, isLoading, error, updateSession, verifyOtpCode };
}
