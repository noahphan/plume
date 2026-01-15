"use client";

import { cn } from "@/lib/utils";

interface SOWDocumentProps {
  className?: string;
}

export function SOWDocument({ className }: SOWDocumentProps) {
  return (
    <div className={cn("bg-white text-gray-900 p-8 md:p-12 max-w-4xl mx-auto shadow-lg", className)}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-200 pb-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">STATEMENT OF WORK</h1>
        <p className="text-sm text-gray-500">Contract Reference: SOW-2026-0147</p>
      </div>

      {/* Parties */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          1. PARTIES
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">SERVICE PROVIDER</p>
            <p className="font-semibold text-gray-900">Plume Design Studio</p>
            <p className="text-sm text-gray-600">Sarah Chen, Creative Director</p>
            <p className="text-sm text-gray-600">sarah@plume.design</p>
            <p className="text-sm text-gray-600">123 Design District, San Francisco, CA 94102</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">CLIENT</p>
            <p className="font-semibold text-gray-900">Nova Health Technologies, Inc.</p>
            <p className="text-sm text-gray-600">Marcus Chen, VP of Marketing</p>
            <p className="text-sm text-gray-600">marcus.chen@novahealthtech.com</p>
            <p className="text-sm text-gray-600">456 Innovation Way, Austin, TX 78701</p>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          2. PROJECT OVERVIEW
        </h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium text-gray-900">Project Name</p>
            <p className="text-gray-700">Nova Health Tech - Brand Refresh & Website Redesign</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">Project Description</p>
            <p className="text-gray-700">
              Complete brand refresh including logo redesign, brand guidelines development, 
              and comprehensive website redesign. The project encompasses brand strategy, 
              visual identity system, and responsive website design deliverables to 
              modernize Nova Health Technologies&apos; market presence and improve digital 
              user experience.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 bg-indigo-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">$47,500</p>
              <p className="text-sm text-gray-600">Project Value</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-600">12 Weeks</p>
              <p className="text-sm text-gray-600">Timeline</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">Jan 20, 2026</p>
              <p className="text-sm text-gray-600">Start Date</p>
            </div>
          </div>
        </div>
      </section>

      {/* Scope of Work */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          3. SCOPE OF WORK & DELIVERABLES
        </h2>
        <div className="space-y-3">
          {[
            { num: "3.1", title: "Brand Strategy Document & Competitive Analysis", desc: "Comprehensive research and strategic positioning document" },
            { num: "3.2", title: "Logo Redesign Package", desc: "Primary, secondary, and icon variations in all required formats" },
            { num: "3.3", title: "Brand Guidelines", desc: "Typography, color palette, voice & tone, usage guidelines" },
            { num: "3.4", title: "Website UX Research & Wireframes", desc: "User research findings, information architecture, wireframes" },
            { num: "3.5", title: "Website Visual Design", desc: "Desktop and mobile responsive designs for all key pages" },
            { num: "3.6", title: "Design Assets & Specifications", desc: "Development-ready assets, style guide, and handoff documentation" },
          ].map((item) => (
            <div key={item.num} className="flex gap-4 p-3 hover:bg-gray-50 rounded-lg">
              <span className="text-sm font-mono text-gray-400 w-8">{item.num}</span>
              <div>
                <p className="font-medium text-gray-900">{item.title}</p>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          4. PROJECT TIMELINE & MILESTONES
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Phase</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Duration</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Deliverable</th>
                <th className="text-right py-3 px-4 font-medium text-gray-600">Payment</th>
              </tr>
            </thead>
            <tbody>
              {[
                { phase: "Discovery & Research", duration: "Weeks 1-2", deliverable: "Brand Strategy Document", payment: "$23,750" },
                { phase: "Logo & Identity Design", duration: "Weeks 3-5", deliverable: "Final Logo Package", payment: "—" },
                { phase: "Brand Guidelines", duration: "Weeks 6-7", deliverable: "Brand Guidelines PDF", payment: "$11,875" },
                { phase: "Website UX Design", duration: "Weeks 8-9", deliverable: "Wireframes & User Flows", payment: "—" },
                { phase: "Website Visual Design", duration: "Weeks 10-12", deliverable: "Design Files & Assets", payment: "$11,875" },
              ].map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{row.phase}</td>
                  <td className="py-3 px-4 text-gray-600">{row.duration}</td>
                  <td className="py-3 px-4 text-gray-600">{row.deliverable}</td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900">{row.payment}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="py-3 px-4 font-semibold text-gray-900">Total Project Value</td>
                <td className="py-3 px-4 text-right font-bold text-gray-900">$47,500</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Payment Terms */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
          5. PAYMENT TERMS
        </h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium">5.1</span> Payment shall be made in three installments: 
            50% upon signing ($23,750), 25% at project midpoint ($11,875), and 25% upon 
            final delivery ($11,875).
          </p>
          <p>
            <span className="font-medium">5.2</span> Invoices are due within 15 days of receipt. 
            Late payments will incur a 1.5% monthly interest charge.
          </p>
          <p>
            <span className="font-medium">5.3</span> Additional work outside the scope will be 
            quoted separately and requires written approval before commencement.
          </p>
        </div>
      </section>

      {/* Signatures */}
      <section className="mt-12 pt-8 border-t-2 border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">SIGNATURES</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">SERVICE PROVIDER</p>
            <div className="h-20 border-b-2 border-gray-300 flex items-end pb-2">
              <span className="text-gray-400 italic">Signature appears here</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sarah Chen, Creative Director</span>
              <span className="text-gray-400">Date: ___________</span>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-500">CLIENT</p>
            <div className="h-20 border-b-2 border-indigo-300 bg-indigo-50/50 rounded flex items-center justify-center">
              <span className="text-indigo-600 font-medium">← Your signature will appear here</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Marcus Chen, VP of Marketing</span>
              <span className="text-gray-400">Date: ___________</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-200 text-center text-xs text-gray-400">
        <p>This Statement of Work is subject to the Master Services Agreement dated January 15, 2026.</p>
        <p className="mt-1">Page 1 of 6 • Generated via Plume</p>
      </div>
    </div>
  );
}
