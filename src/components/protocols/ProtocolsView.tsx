"use client";

import React from "react";
import {
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface ProtocolsViewProps {
  trials: any[];
  selectedTrialId: string | null;
  onSelectTrial: (trialId: string) => void;
}

export const ProtocolsView: React.FC<ProtocolsViewProps> = ({
  trials,
  selectedTrialId,
  onSelectTrial,
}) => {
  const activeTrial =
    trials.find((t) => t.id === selectedTrialId) || trials[0] || null;

  return (
    <div className="space-y-12 animate-fade-in-up pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>Governance &amp; Tracking</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-signifier font-normal text-text-primary tracking-heading leading-heading-sm">
            Clinical Protocols
          </h1>
          <p className="text-body text-text-secondary font-sohne max-w-2xl">
            Governance under GCP-ASU, ICMR Ethical Guidelines, NDCT Rules 2019, and CTRI prospective registry.
          </p>
        </div>

        {/* Study Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-text-muted font-sohne uppercase tracking-wider font-medium">
            Active Study
          </label>
          <div className="relative flex items-center bg-surface-card border border-border-subtle rounded-inputs px-4 py-2 hover:border-text-muted transition-colors">
            <select
              value={activeTrial?.id || ""}
              onChange={(e) => onSelectTrial(e.target.value)}
              className="bg-transparent font-sohne font-medium text-text-primary focus:outline-none cursor-pointer appearance-none pr-8 w-full"
            >
              {trials.map((t) => (
                <option key={t.id} value={t.id} className="bg-background text-text-primary">
                  {t.protocolNumber} — {t.ctriId}
                </option>
              ))}
            </select>
            <div className="absolute right-4 pointer-events-none text-text-muted">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {activeTrial && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Protocol Details (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="steep-card space-y-8">
              <div className="flex items-center justify-between">
                <span className="steep-tag px-3 py-1 bg-background border border-border-subtle rounded-full flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  CTRI PROSPECTIVE REGISTRATION
                </span>
                <a
                  href="https://ctri.nic.in"
                  target="_blank"
                  rel="noreferrer"
                  className="steep-text-link font-medium"
                >
                  <span>{activeTrial.ctriId}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <h2 className="text-2xl sm:text-3xl font-signifier font-medium text-text-primary leading-snug">
                {activeTrial.studyTitle}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-background rounded-cards border border-border-subtle">
                  <span className="text-text-muted block text-xs uppercase font-medium font-sohne tracking-wide">Protocol Identifier</span>
                  <span className="font-medium text-text-primary font-sohne mt-1 block">{activeTrial.protocolNumber}</span>
                </div>
                <div className="p-4 bg-background rounded-cards border border-border-subtle">
                  <span className="text-text-muted block text-xs uppercase font-medium font-sohne tracking-wide">Trial Phase</span>
                  <span className="font-medium text-text-primary font-sohne mt-1 block">{activeTrial.trialPhase}</span>
                </div>
                <div className="p-4 bg-background rounded-cards border border-border-subtle">
                  <span className="text-text-muted block text-xs uppercase font-medium font-sohne tracking-wide">Therapeutic Discipline</span>
                  <span className="font-medium text-text-primary font-sohne mt-1 block">{activeTrial.therapeuticArea}</span>
                </div>
                <div className="p-4 bg-background rounded-cards border border-border-subtle">
                  <span className="text-text-muted block text-xs uppercase font-medium font-sohne tracking-wide">Lead Clinical Centre</span>
                  <span className="font-medium text-text-primary font-sohne mt-1 block">{activeTrial.leadInstitution}</span>
                </div>
              </div>

              <div className="p-5 bg-surface-accent rounded-cards">
                <div className="text-sienna uppercase text-xs font-sohne font-medium tracking-wider mb-2">
                  Principal Investigator
                </div>
                <div className="text-lg font-medium text-sienna font-sohne mb-1">
                  {activeTrial.principalInvestigator}
                </div>
                <div className="text-sm text-sienna/80 font-sohne leading-relaxed">
                  Responsible for protocol adherence, subject safety, eCRF completeness, and 21 CFR Part 11 biometric sign-offs.
                </div>
              </div>
            </div>

            {/* NDCT Rules 2019 & Ethics Compliance Checklist */}
            <div className="steep-card space-y-6">
              <div className="flex items-center justify-between border-b border-border-subtle pb-4">
                <h3 className="text-xl font-signifier font-medium text-text-primary">
                  Regulatory Compliance &amp; Ethics Ledger
                </h3>
                <span className="text-xs text-text-primary bg-background px-3 py-1 rounded-full border border-border-subtle font-medium font-sohne">
                  AUDIT READY
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-cards border border-border-subtle">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-text-primary stroke-[1.5] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-text-primary font-sohne text-sm">Institutional Ethics Committee (IEC) Clearance</div>
                      <div className="text-xs text-text-secondary font-sohne mt-1">Ref: IEC/AIIA/2024/APP-082 • Approved on {activeTrial.ethicsApprovalDate}</div>
                    </div>
                  </div>
                  <span className="text-text-primary font-medium font-sohne text-xs">CLEARED</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-cards border border-border-subtle">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-text-primary stroke-[1.5] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-text-primary font-sohne text-sm">NDCT Rules 2019 (CDSCO Regulatory Clearance)</div>
                      <div className="text-xs text-text-secondary font-sohne mt-1">{activeTrial.ndctStatus}</div>
                    </div>
                  </div>
                  <span className="text-text-primary font-medium font-sohne text-xs">ACTIVE</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-cards border border-border-subtle">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-text-primary stroke-[1.5] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-text-primary font-sohne text-sm">DPDP Act 2023 Digital Informed Consent Framework</div>
                      <div className="text-xs text-text-secondary font-sohne mt-1">Bilingual audio-visual informed consent verification with cryptographic hash</div>
                    </div>
                  </div>
                  <span className="text-text-primary font-medium font-sohne text-xs">ENFORCED</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-cards border border-border-subtle">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-5 h-5 text-text-primary stroke-[1.5] flex-shrink-0" />
                    <div>
                      <div className="font-medium text-text-primary font-sohne text-sm">National Pharmacovigilance (NPvCC) ASU Routing</div>
                      <div className="text-xs text-text-secondary font-sohne mt-1">Continuous ADR tracking with 24h SAE escalation protocol to DCGI</div>
                    </div>
                  </div>
                  <span className="text-text-primary font-medium font-sohne text-xs">INTEGRATED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info & Protocol Arms (1 col) */}
          <div className="space-y-8">
            <div className="steep-card space-y-5">
              <h3 className="text-xl font-signifier font-medium text-text-primary border-b border-border-subtle pb-3">
                Study Arms &amp; Intervention
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-background rounded-cards border border-border-subtle space-y-2">
                  <span className="text-xs font-sohne text-text-primary uppercase font-medium">Arm A (Investigational)</span>
                  <p className="text-text-secondary leading-relaxed text-sm font-sohne">
                    Standardized Active Ayush Formulation (500mg BID) post prandial with Sukhoshna Jala.
                  </p>
                </div>

                <div className="p-4 bg-surface-fog rounded-cards border border-border-subtle space-y-2">
                  <span className="text-xs font-sohne text-text-muted uppercase font-medium">Arm B (Comparator / Control)</span>
                  <p className="text-text-secondary leading-relaxed text-sm font-sohne">
                    Matching Placebo or Standard First-line Control according to approved protocol.
                  </p>
                </div>
              </div>
            </div>

            <div className="steep-card space-y-5">
              <h3 className="text-xl font-signifier font-medium text-text-primary border-b border-border-subtle pb-3">
                Visit Schedule
              </h3>
              <div className="space-y-3 font-sohne text-sm">
                {[
                  { name: "Visit 1 (Day 0)", type: "Baseline & Prakriti Intake" },
                  { name: "Visit 2 (Day 14)", type: "Follow-up & Doshic Score" },
                  { name: "Visit 3 (Day 28)", type: "Midpoint Efficacy Evaluation" },
                  { name: "Visit 4 (Day 56)", type: "Endpoint & Closeout eCRF" },
                ].map((v, i) => (
                  <div key={i} className="flex flex-col gap-1 p-3 rounded-lg bg-background border border-border-subtle">
                    <span className="font-medium text-text-primary">{v.name}</span>
                    <span className="text-text-secondary text-xs">{v.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
