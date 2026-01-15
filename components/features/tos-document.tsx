"use client";

import { cn } from "@/lib/utils";

interface TOSDocumentProps {
  className?: string;
}

export function TOSDocument({ className }: TOSDocumentProps) {
  return (
    <div className={cn("bg-white text-gray-900 p-8 md:p-12 max-w-4xl mx-auto shadow-lg", className)}>
      <div className="text-center border-b-2 border-gray-200 pb-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">TERMS OF SERVICE</h1>
        <p className="text-sm text-gray-500">Agreement Reference: TOS-2026-042</p>
      </div>

      <section className="mb-8 text-gray-700 leading-relaxed">
        <p>
          These Terms of Service (the "Agreement") are entered into as of January 21, 2026 by and
          between Plume Design Studio ("Provider") and Brightline Analytics LLC ("Customer"). This
          Agreement governs Customer access to the Plume Cloud Platform (the "Service").
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          1. ACCESS AND USE
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Provider grants Customer a non-exclusive, non-transferable right to access and use the
          Service for internal business purposes during the subscription term. Customer is
          responsible for all activity under its accounts and for maintaining the confidentiality
          of its credentials.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          2. SUBSCRIPTION AND BILLING
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The Service is provided on an annual subscription basis. Fees are billed annually in
          advance and are non-refundable except as required by law. Late payments may result in
          suspension of access.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Customer is responsible for applicable taxes, excluding taxes based on Provider income.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          3. ACCEPTABLE USE
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            <span className="font-medium">3.1</span> Customer will not use the Service for unlawful
            activities, transmit malware, or attempt to gain unauthorized access to the Service.
          </li>
          <li>
            <span className="font-medium">3.2</span> Customer will not reverse engineer, resell, or
            sublicense the Service without Provider written consent.
          </li>
          <li>
            <span className="font-medium">3.3</span> Provider may suspend access for violations of
            this section after providing notice where feasible.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          4. DATA AND SECURITY
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Provider will maintain reasonable administrative, technical, and physical safeguards to
          protect Customer data. Customer retains ownership of its data and grants Provider a limited
          license to process data solely to provide the Service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          5. TERM AND TERMINATION
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This Agreement remains in effect for the subscription term and renews automatically for
          successive one-year terms unless either party provides thirty (30) days notice of
          non-renewal. Either party may terminate for material breach not cured within fifteen (15)
          days of written notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          6. LIMITATION OF LIABILITY
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Except for breach of confidentiality or willful misconduct, neither party will be liable
          for indirect, incidental, or consequential damages. Provider total liability will not
          exceed the fees paid by Customer in the twelve (12) months preceding the claim.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          7. GOVERNING LAW
        </h2>
        <p className="text-gray-700 leading-relaxed">
          This Agreement is governed by the laws of the State of California, without regard to
          conflict of law principles.
        </p>
      </section>

      <section className="mt-12 pt-8 border-t-2 border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">SIGNATURES</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">PROVIDER</p>
            <div className="h-16 border-b-2 border-gray-300" />
            <div className="text-sm text-gray-600">
              <p>Plume Design Studio</p>
              <p>By: Sarah Chen, Managing Director</p>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">CUSTOMER</p>
            <div className="h-16 border-b-2 border-indigo-300 bg-indigo-50/50 rounded" />
            <div className="text-sm text-gray-600">
              <p>Brightline Analytics LLC</p>
              <p>By: Jordan Lee, IT Manager</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>Terms of Service • Confidential</p>
        <p className="mt-1">Page 1 of 4 • Generated via Plume</p>
      </div>
    </div>
  );
}
