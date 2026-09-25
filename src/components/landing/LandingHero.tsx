"use client";

import React from "react";
import Link from "next/link";

/* ────────────────────────────────────────────────────────────
   Floating Product Artifact — Region Data Table
   ──────────────────────────────────────────────────────────── */
const RegionTableArtifact: React.FC = () => {
  const rows = [
    { region: "New Delhi", sites: 12, enrolled: 486, rate: "94.6%" },
    { region: "Jaipur", sites: 8, enrolled: 312, rate: "91.2%" },
    { region: "Varanasi", sites: 6, enrolled: 224, rate: "88.7%" },
    { region: "Pune", sites: 5, enrolled: 198, rate: "92.1%" },
    { region: "Bengaluru", sites: 4, enrolled: 156, rate: "86.4%" },
  ];

  return (
    <div className="steep-artifact w-[300px] p-4 animate-fade-in-up animation-delay-200">
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-sohne text-[13px]"
          style={{ fontWeight: 500, color: "var(--text-primary)" }}
        >
          Clinical Regions
        </span>
        <span className="steep-tag text-[12px]">Live</span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr
            className="text-[11px] font-sohne uppercase tracking-wider"
            style={{ color: "var(--text-tertiary)" }}
          >
            <th className="pb-2 font-normal">Region</th>
            <th className="pb-2 font-normal text-right">Sites</th>
            <th className="pb-2 font-normal text-right">Enrolled</th>
            <th className="pb-2 font-normal text-right">Rate</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="text-[13px] font-sohne"
              style={{
                color: "var(--text-primary)",
                borderTop: "1px solid var(--border-hairline)",
              }}
            >
              <td className="py-[6px]">{row.region}</td>
              <td className="py-[6px] text-right" style={{ color: "var(--text-secondary)" }}>
                {row.sites}
              </td>
              <td className="py-[6px] text-right">{row.enrolled}</td>
              <td
                className="py-[6px] text-right"
                style={{ color: "var(--color-sienna-brown)" }}
              >
                {row.rate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Floating Product Artifact — Registration Stat Card
   ──────────────────────────────────────────────────────────── */
const RegistrationStatArtifact: React.FC = () => {
  return (
    <div className="steep-artifact w-[200px] p-4 animate-fade-in-up animation-delay-300">
      <span
        className="font-sohne text-[13px] block mb-1"
        style={{ color: "var(--text-secondary)" }}
      >
        Registrations
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className="font-sohne text-[28px]"
          style={{ fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-0.5px" }}
        >
          2.4k
        </span>
      </div>
      <span
        className="font-sohne text-[13px] mt-1 block"
        style={{ color: "var(--text-secondary)" }}
      >
        ↑ 5.5x vs last week
      </span>

      {/* Mini sparkline — gestural line, not a data dashboard */}
      <svg
        viewBox="0 0 160 40"
        className="w-full h-8 mt-3"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 32 C20 28, 30 20, 50 22 S80 10, 100 14 S130 4, 160 2"
          stroke="var(--color-sienna-brown)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Floating Product Artifact — Activation Chart (Radial)
   ──────────────────────────────────────────────────────────── */
const ActivationChartArtifact: React.FC = () => {
  const percentage = 46.2;
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="steep-artifact w-[180px] p-4 flex flex-col items-center animate-fade-in-up animation-delay-400">
      <span
        className="font-sohne text-[13px] self-start mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        Activation
      </span>

      {/* Radial progress ring */}
      <svg width="88" height="88" viewBox="0 0 88 88" className="mb-2">
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth="4"
        />
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          stroke="var(--color-sienna-brown)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          className="transition-all duration-700"
        />
        <text
          x="44"
          y="44"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-sohne"
          style={{
            fontSize: "18px",
            fontWeight: 500,
            fill: "var(--text-primary)",
          }}
        >
          46.2%
        </text>
      </svg>

      <span
        className="font-sohne text-[12px]"
        style={{ color: "var(--text-tertiary)" }}
      >
        Aug – Nov 2026
      </span>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Floating Product Artifact — AI Composer Input
   ──────────────────────────────────────────────────────────── */
const AIComposerArtifact: React.FC = () => {
  return (
    <div className="steep-artifact w-[340px] p-3 animate-fade-in-up animation-delay-500">
      <div
        className="flex items-center gap-3 rounded-inputs px-4 py-3"
        style={{
          border: "1px solid var(--border-subtle)",
          backgroundColor: "var(--surface-elevated-white)",
        }}
      >
        {/* Left icons */}
        <span
          className="font-sohne text-[15px]"
          style={{ color: "var(--text-muted)" }}
        >
          @
        </span>

        {/* Placeholder */}
        <span
          className="font-sohne text-[15px] flex-1"
          style={{ color: "var(--color-smoke-gray)" }}
        >
          Ask anything…
        </span>

        {/* Send button */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "var(--text-primary)" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7h10M8 3l4 4-4 4"
              stroke="var(--bg-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ────────────────────────────────────────────────────────────
   Hero Section
   ──────────────────────────────────────────────────────────── */
export const LandingHero: React.FC = () => {
  return (
    <section
      id="overview"
      className="relative overflow-hidden"
      style={{ paddingTop: "80px", paddingBottom: "120px" }}
    >
      <div className="max-w-steep mx-auto px-6 lg:px-8 relative">
        {/* ── Centered Text Block ── */}
        <div className="text-center max-w-[800px] mx-auto relative z-10">
          {/* Display Headline — 90px Signifier weight 400 */}
          <h1
            className="font-signifier animate-fade-in-up"
            style={{
              fontSize: "clamp(44px, 7vw, 90px)",
              lineHeight: 1.3,
              letterSpacing: "-2.25px",
              fontWeight: 400,
              color: "var(--text-primary)",
            }}
          >
            Clinical trials for Ayurveda,{" "}
            <em className="not-italic" style={{ fontStyle: "italic" }}>
              engineered with precision.
            </em>
          </h1>

          {/* Subhead — 17px Sohne weight 400 */}
          <p
            className="font-sohne mt-6 mx-auto max-w-[540px] animate-fade-in-up animation-delay-100"
            style={{
              fontSize: "17px",
              lineHeight: 1.5,
              fontWeight: 400,
              color: "var(--text-secondary)",
            }}
          >
            An integrated platform standardizing multi-centre Ayurvedic research
            with digital eCRFs, automated Prakriti phenotyping, and 21 CFR Part 11
            integrity.
          </p>

          {/* Pill Button Pair */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 animate-fade-in-up animation-delay-200">
            <Link href="/login" className="steep-pill-filled">
              Get started
            </Link>
            <Link href="/login" className="steep-pill-ghost">
              Explore protocols
            </Link>
          </div>
        </div>

        {/* ── Floating Product Artifacts ── */}
        {/* These are positioned absolutely to overlap hero text margins */}

        {/* Region Table — Top Left */}
        <div className="hidden lg:block absolute left-0 top-[20px] -translate-x-[40px]">
          <RegionTableArtifact />
        </div>

        {/* Registration Stat — Right */}
        <div className="hidden lg:block absolute right-0 top-[60px] translate-x-[20px]">
          <RegistrationStatArtifact />
        </div>

        {/* Activation Chart — Bottom Left */}
        <div className="hidden lg:block absolute left-[60px] bottom-[-20px]">
          <ActivationChartArtifact />
        </div>

        {/* AI Composer — Bottom Center-Right */}
        <div className="hidden lg:block absolute right-[40px] bottom-[0px]">
          <AIComposerArtifact />
        </div>

        {/* ── Mobile: Stacked Artifacts ── */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16">
          <RegionTableArtifact />
          <RegistrationStatArtifact />
          <ActivationChartArtifact />
          <AIComposerArtifact />
        </div>
      </div>
    </section>
  );
};
