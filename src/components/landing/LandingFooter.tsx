"use client";

import React from "react";
import Link from "next/link";

const footerColumns = [
  {
    heading: "Platform",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Clinical Protocols", href: "/dashboard/protocols" },
      { label: "eCRFs & Prakriti", href: "/dashboard" },
      { label: "Safety & SAEs", href: "/dashboard" },
    ],
  },
  {
    heading: "Compliance",
    links: [
      { label: "Site Monitoring", href: "/dashboard" },
      { label: "Audit Trail", href: "/dashboard" },
      { label: "FHIR & CDISC", href: "/dashboard" },
      { label: "Data Integrity", href: "/dashboard" },
    ],
  },
  {
    heading: "Standards",
    links: [
      { label: "CTRI Registry", href: "https://ctri.nic.in" },
      { label: "CDISC Standards", href: "https://cdisc.org" },
      { label: "HL7 FHIR R4", href: "https://hl7.org/fhir" },
      { label: "ICH-GCP E6(R2)", href: "#" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "AIIA, Ministry of Ayush", href: "#" },
      { label: "SIH 2024 · PS 26046", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export const LandingFooter: React.FC = () => {
  return (
    <footer
      id="compliance"
      style={{
        backgroundColor: "var(--bg-card)",
        paddingTop: "var(--spacing-64)",
        paddingBottom: "var(--spacing-40)",
      }}
    >
      <div className="max-w-steep mx-auto px-6 lg:px-8">
        {/* Top: Logo */}
        <div
          className="flex items-center gap-2 mb-12"
          style={{ borderBottom: "1px solid var(--border-hairline)", paddingBottom: "var(--spacing-32)" }}
        >
          <span
            className="font-signifier text-[20px]"
            style={{ fontWeight: 400, color: "var(--text-primary)" }}
          >
            AyuCare
          </span>
          <span
            className="font-sohne text-[12px] uppercase tracking-widest"
            style={{
              fontWeight: 500,
              color: "var(--text-tertiary)",
              letterSpacing: "0.1em",
            }}
          >
            CTMS
          </span>
        </div>

        {/* Link Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {footerColumns.map((col, i) => (
            <div key={i}>
              <span
                className="font-sohne text-[13px] block mb-4"
                style={{
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  letterSpacing: "0.02em",
                }}
              >
                {col.heading}
              </span>

              <ul className="space-y-3">
                {col.links.map((link, j) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={j}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-sohne text-[14px] transition-colors duration-150"
                          style={{ color: "var(--text-secondary)" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "var(--text-primary)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "var(--text-secondary)")
                          }
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="font-sohne text-[14px] transition-colors duration-150"
                          style={{ color: "var(--text-secondary)" }}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.color = "var(--text-primary)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.color = "var(--text-secondary)")
                          }
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6"
          style={{ borderTop: "1px solid var(--border-hairline)" }}
        >
          <span
            className="font-sohne text-[13px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            © 2026 AyuCare-CTMS · All India Institute of Ayurveda, Ministry of
            Ayush, Government of India.
          </span>

          <span
            className="font-sohne text-[13px]"
            style={{ color: "var(--text-tertiary)" }}
          >
            21 CFR Part 11 · DPDP Act 2023 · ISO/IEC 27001
          </span>
        </div>
      </div>
    </footer>
  );
};
