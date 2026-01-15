"use client";

import { ToastProvider } from "@/components/patterns/toast";

export default function SignerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        {children}
      </div>
    </ToastProvider>
  );
}
