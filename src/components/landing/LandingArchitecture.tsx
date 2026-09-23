"use client";

import React from "react";
import Link from "next/link";

interface WorkflowStep {
  num: string;
  title: string;
  desc: string;
}

const steps: WorkflowStep[] = [
  {
    num: "01",
    title: "Protocol & Ethics Clearance",
    desc: "IEC/IRB committee approval synchronization, CTRI prospective registration, and investigator vaulting under NDCT Rules 2019.",
  },
  {
    num: "02",
    title: "Patient Intake & Digital eCRF",
    desc: "Standardized visit questionnaires, automated Prakriti phenotyping, and digital informed consent under DPDP Act 2023.",
  },
  {
    num: "03",
    title: "Safety, SDV & Cryptographic Lock",
    desc: "Real-time NPvCC pharmacovigilance, 100% CRA Source Data Verification, and SHA-256 HMAC append-only trial locking.",
  },
];

export const LandingArchitecture: React.FC = () => {
  return (
    <section
      id="workflow"
      style={{
        backgroundColor: "var(--bg-primary)",
        paddingTop: "var(--spacing-96)",
        paddingBottom: "var(--spacing-96)",
      }}
    >
      <div className="max-w-steep mx-auto px-6 lg:px-8">
        {/* 2-Column Layout — Text Left, Artifact Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-start">

          {/* Left: Text + CTA */}
          <div className="max-w-[520px]">
            <h2
              className="font-signifier animate-fade-in-up"
              style={{
                fontSize: "clamp(36px, 4vw, 44px)",
                lineHeight: 1.3,
                letterSpacing: "-0.66px",
                fontWeight: 400,
                color: "var(--text-primary)",
              }}
            >
              A continuous, audited pathway from intake to lock.
            </h2>

            <p
              className="font-sohne mt-6 animate-fade-in-up animation-delay-100"
              style={{
                fontSize: "17px",
                lineHeight: 1.55,
                fontWeight: 400,
                color: "var(--text-secondary)",
              }}
            >
              Eliminating fragmented paper spreadsheets and disconnected systems
              through an integrated national platform. Every data entry is
              cryptographically sealed, every workflow step is auditable, and
              every site is synchronized in real time.
            </p>

            {/* Pill Button Pair */}
            <div className="flex flex-wrap items-center gap-4 mt-10 animate-fade-in-up animation-delay-200">
              <Link href="/dashboard" className="steep-pill-filled">
                Enter platform
              </Link>
              <Link href="/dashboard/protocols" className="steep-pill-ghost">
                View protocols
              </Link>
            </div>
          </div>

          {/* Right: Floating Artifact — Workflow Timeline */}
          <div className="animate-fade-in-up animation-delay-300">
            <div className="steep-artifact" style={{ padding: "28px 24px" }}>
              <span
                className="font-sohne text-[13px] block mb-6"
                style={{ fontWeight: 500, color: "var(--text-secondary)" }}
              >
                Clinical Trial Lifecycle
              </span>

              <div className="space-y-0">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="flex gap-5"
                    style={{
                      paddingBottom: i < steps.length - 1 ? "28px" : "0",
                    }}
                  >
                    {/* Timeline Indicator */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center font-sohne text-[13px] flex-shrink-0"
                        style={{
                          fontWeight: 500,
                          backgroundColor: "var(--bg-card)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {step.num}
                      </div>
                      {i < steps.length - 1 && (
                        <div
                          className="w-[1px] flex-1 mt-2"
                          style={{ backgroundColor: "var(--border-subtle)" }}
                        />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="pt-1 pb-1">
                      <h4
                        className="font-sohne"
                        style={{
                          fontSize: "18px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          lineHeight: 1.3,
                        }}
                      >
                        {step.title}
                      </h4>
                      <p
                        className="font-sohne mt-2"
                        style={{
                          fontSize: "15px",
                          fontWeight: 400,
                          lineHeight: 1.55,
                          color: "var(--text-secondary)",
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner — Clean centered callout */}
        <div
          className="mt-20 text-center steep-card animate-fade-in-up"
          style={{ padding: "64px 32px" }}
        >
          <h3
            className="font-signifier mx-auto max-w-[600px]"
            style={{
              fontSize: "clamp(28px, 3.5vw, 44px)",
              lineHeight: 1.3,
              letterSpacing: "-0.66px",
              fontWeight: 400,
              color: "var(--text-primary)",
            }}
          >
            Ready to inspect active Ayurvedic clinical trials?
          </h3>

          <p
            className="font-sohne mt-5 max-w-[460px] mx-auto"
            style={{
              fontSize: "17px",
              lineHeight: 1.5,
              fontWeight: 400,
              color: "var(--text-secondary)",
            }}
          >
            Access the clinical workstation to explore active protocols,
            electronic case report forms, and verified audit trails.
          </p>

          <div className="flex justify-center mt-8">
            <Link href="/dashboard" className="steep-pill-filled">
              Enter AyuCare platform →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
