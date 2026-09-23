"use client";

import React from "react";
import Link from "next/link";

interface FeatureCard {
  category: string;
  title: string;
  body: string;
  href: string;
}

const features: FeatureCard[] = [
  {
    category: "Phenotyping Engine",
    title: "Digital eCRFs & Prakriti Intake",
    body: "Standardized electronic case report forms integrating algorithmic Tridosha phenotyping and structured patient visit logs across every clinical centre.",
    href: "/dashboard",
  },
  {
    category: "NPvCC ASU Gateway",
    title: "24-Hour Pharmacovigilance",
    body: "Real-time adverse event capture with automated escalation to the National Pharmacovigilance Coordination Centre, ensuring regulatory SAE compliance within 24 hours.",
    href: "/dashboard",
  },
  {
    category: "ICH-GCP E6(R2)",
    title: "Risk-Based CRA Monitoring",
    body: "Centralized Source Data Verification with automated audit checklists and 100% SDV coverage across multi-centre Ayurvedic clinical trial sites.",
    href: "/dashboard",
  },
];

export const LandingFeatures: React.FC = () => {
  return (
    <section
      id="features"
      style={{
        backgroundColor: "var(--bg-secondary)",
        paddingTop: "var(--spacing-80)",
        paddingBottom: "var(--spacing-80)",
      }}
    >
      <div className="max-w-steep mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <h2
            className="font-signifier animate-fade-in-up"
            style={{
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.3,
              letterSpacing: "-0.96px",
              fontWeight: 400,
              color: "var(--text-primary)",
            }}
          >
            Everything required for certified clinical rigor.
          </h2>
          <p
            className="font-sohne mt-5 animate-fade-in-up animation-delay-100"
            style={{
              fontSize: "18px",
              lineHeight: 1.5,
              fontWeight: 430,
              color: "var(--text-secondary)",
            }}
          >
            Built specifically for Ayurvedic multi-centre studies, combining
            classical research parameters with international trial compliance.
          </p>
        </div>

        {/* Feature Grid — 3 Neutral Cards + 1 Accent Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <Link
              key={i}
              href={feat.href}
              className="steep-card group flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
              style={{ padding: "32px 24px" }}
            >
              {/* Category Tag — ghost-like, no badge */}
              <div>
                <span className="steep-tag">{feat.category}</span>

                <h3
                  className="font-sohne mt-4"
                  style={{
                    fontSize: "20px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    lineHeight: 1.3,
                  }}
                >
                  {feat.title}
                </h3>

                <p
                  className="font-sohne mt-3"
                  style={{
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: 1.55,
                    color: "var(--text-primary)",
                  }}
                >
                  {feat.body}
                </p>
              </div>

              {/* Text Link with Arrow */}
              <span
                className="steep-text-link mt-8 text-[15px] group-hover:underline"
                style={{ color: "var(--text-primary)" }}
              >
                Learn more →
              </span>
            </Link>
          ))}
        </div>

        {/* Accent Peach Card — Editorial Highlight (one per page max) */}
        <div
          className="steep-card-accent mt-6 animate-fade-in-up"
          style={{ padding: "40px 32px" }}
        >
          <div className="max-w-[640px]">
            <span
              className="font-sohne text-[14px] block mb-4"
              style={{
                fontWeight: 400,
                color: "var(--color-sienna-brown)",
                opacity: 0.7,
              }}
            >
              Customer Story
            </span>

            <h3
              className="font-sohne"
              style={{
                fontSize: "26px",
                fontWeight: 450,
                color: "var(--color-sienna-brown)",
                letterSpacing: "-0.23px",
                lineHeight: 1.3,
              }}
            >
              &ldquo;AyuCare-CTMS reduced our multi-centre enrollment timeline
              from 14 weeks to 6, with complete audit integrity across every
              site.&rdquo;
            </h3>

            <p
              className="font-sohne mt-6"
              style={{
                fontSize: "14px",
                fontWeight: 400,
                color: "var(--color-sienna-brown)",
              }}
            >
              Dr. Ananya Sharma, Principal Investigator — All India Institute of
              Ayurveda, New Delhi
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
