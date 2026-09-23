"use client";

import React from "react";
import {
  TrendingUp,
  Users,
  ShieldAlert,
  ClipboardCheck,
  Building2,
  ArrowUpRight,
} from "lucide-react";
import { RoleType } from "../layout/Header";

interface ExecutiveKpiViewProps {
  trials: any[];
  currentRole: RoleType;
  onSelectTrial: (trialId: string) => void;
  selectedTrialId: string | null;
  onNavigateTab: (tab: string) => void;
}

export const ExecutiveKpiView: React.FC<ExecutiveKpiViewProps> = ({
  trials,
  currentRole,
  onSelectTrial,
  selectedTrialId,
  onNavigateTab,
}) => {
  // Aggregate KPIs
  const totalTarget = trials.reduce((sum, t) => sum + (t.targetEnrollment || 0), 0);
  const totalCurrent = trials.reduce((sum, t) => sum + (t.currentEnrollment || 0), 0);

  let totalQueries = 0;
  let totalAdverse = 0;
  let activeSaeCount = 0;

  trials.forEach((t) => {
    totalQueries += t.monitoringQueries?.filter((q: any) => q.status === "Open").length || 0;
    t.subjects?.forEach((s: any) => {
      s.adverseEvents?.forEach((ae: any) => {
        totalAdverse++;
        if (ae.isSeriousnessSae && !ae.reportedToEthics) {
          activeSaeCount++;
        }
      });
    });
  });

  const enrollmentPct = totalTarget > 0 ? Math.round((totalCurrent / totalTarget) * 100) : 0;

  return (
    <div className="space-y-12 animate-fade-in-up pb-12">
      {/* Top Banner / Hero Overview */}
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
          <span>AIIA Clinical Portfolio Command</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-heading-lg font-signifier font-normal text-text-primary tracking-heading-lg leading-heading-lg">
          Ayurveda Clinical Research Portfolio &amp; Safety Surveillance
        </h1>

        <p className="text-body-lg text-text-secondary font-sohne leading-body-lg max-w-3xl">
          Real-time multi-centre trial governance. Tracking prospective CTRI registrations, good clinical practices (GCP-ASU), 21 CFR Part 11 audit trails, and national ASU&amp;H pharmacovigilance (NPvCC).
        </p>

        <div className="pt-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => onNavigateTab("subjects")}
            className="steep-pill-filled"
          >
            <span>Review eCRF Intake</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigateTab("pharmacovigilance")}
            className="steep-pill-ghost"
          >
            <span>NPvCC Safety Signals</span>
            {activeSaeCount > 0 && (
              <span className="bg-surface-accent text-sienna px-2 py-0.5 rounded-full text-xs font-medium ml-2 border border-sienna/10 animate-pulse">
                {activeSaeCount} ALERT
              </span>
            )}
          </button>
          <button
            onClick={() => onNavigateTab("interoperability")}
            className="steep-text-link"
          >
            <span>FHIR &amp; CDISC Export</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Active Trials */}
        <div className="steep-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sohne uppercase text-text-muted font-medium tracking-wider">
              Active Protocols
            </span>
            <div className="text-text-primary">
              <Building2 className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <div className="mt-8 mb-6">
            <div className="text-4xl font-signifier font-medium text-text-primary">{trials.length}</div>
            <div className="text-sm text-text-secondary mt-1 font-sohne">
              CTRI Registered &amp; NDCT 2019
            </div>
          </div>
          <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-sm font-sohne">
            <span className="text-text-secondary">Ethics Clearances</span>
            <span className="font-medium text-text-primary">100% Cleared</span>
          </div>
        </div>

        {/* KPI 2: Total Enrollment */}
        <div className="steep-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sohne uppercase text-text-muted font-medium tracking-wider">
              Enrollment Velocity
            </span>
            <div className="text-text-primary">
              <TrendingUp className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <div className="mt-8 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-signifier font-medium text-text-primary">{totalCurrent}</span>
              <span className="text-sm font-sohne text-text-muted">/ {totalTarget}</span>
            </div>
            <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden mt-3">
              <div
                className="bg-text-primary h-full transition-all duration-700"
                style={{ width: `${enrollmentPct}%` }}
              />
            </div>
          </div>
          <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-sm font-sohne">
            <span className="text-text-secondary">Cohort Completion</span>
            <span className="font-medium text-text-primary">{enrollmentPct}% Achieved</span>
          </div>
        </div>

        {/* KPI 3: Site Monitoring & SDV */}
        <div className="steep-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-sohne uppercase text-text-muted font-medium tracking-wider">
              SDV &amp; Queries
            </span>
            <div className="text-text-primary">
              <ClipboardCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
          </div>
          <div className="mt-8 mb-6">
            <div className="text-4xl font-signifier font-medium text-text-primary">{totalQueries}</div>
            <div className="text-sm text-text-secondary mt-1 font-sohne">
              Pending Discrepancies
            </div>
          </div>
          <div className="pt-4 border-t border-border-subtle flex items-center justify-between text-sm font-sohne">
            <span className="text-text-secondary">Verification Rate</span>
            <span className="font-medium text-text-primary">98.8% SDV</span>
          </div>
        </div>

        {/* KPI 4: NPvCC Safety */}
        <div className={activeSaeCount > 0 ? "steep-card-accent flex flex-col justify-between" : "steep-card flex flex-col justify-between"}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-sohne uppercase font-medium tracking-wider ${activeSaeCount > 0 ? 'text-sienna/70' : 'text-text-muted'}`}>
              NPvCC Safety Signals
            </span>
            <div className={activeSaeCount > 0 ? "text-sienna" : "text-text-primary"}>
              <ShieldAlert
                className={`w-5 h-5 stroke-[1.5] ${activeSaeCount > 0 ? "animate-pulse" : ""}`}
              />
            </div>
          </div>
          <div className="mt-8 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-signifier font-medium">{totalAdverse}</span>
              <span className={`text-sm font-sohne ${activeSaeCount > 0 ? 'text-sienna/80' : 'text-text-muted'}`}>ADRs Recorded</span>
            </div>
            {activeSaeCount > 0 ? (
              <div className="text-sm font-medium mt-2 flex items-center gap-2 font-sohne">
                <span className="w-1.5 h-1.5 rounded-full bg-sienna animate-ping" />
                {activeSaeCount} Urgent 24h SAE Escalation!
              </div>
            ) : (
              <div className="text-sm text-text-primary font-medium mt-2 font-sohne">
                All 24h Timelines Met
              </div>
            )}
          </div>
          <div className={`pt-4 border-t flex items-center justify-between text-sm font-sohne ${activeSaeCount > 0 ? 'border-sienna/20' : 'border-border-subtle'}`}>
            <span className={activeSaeCount > 0 ? "text-sienna/80" : "text-text-secondary"}>Causality Model</span>
            <span className="font-medium">WHO-UMC Standard</span>
          </div>
        </div>
      </div>

      {/* Clinical Studies Portfolio Grid */}
      <div className="space-y-6 pt-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <h2 className="text-2xl font-signifier font-normal text-text-primary">
              Active Clinical Research Protocols
            </h2>
            <p className="text-sm text-text-secondary font-sohne mt-1">
              Select a study to inspect protocol milestones, eCRFs, and data models.
            </p>
          </div>
          <span className="text-sm font-sohne text-text-secondary">
            {trials.length} Active Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trials.map((trial) => {
            const isSelected = selectedTrialId === trial.id;
            const trialPct =
              trial.targetEnrollment > 0
                ? Math.round((trial.currentEnrollment / trial.targetEnrollment) * 100)
                : 0;

            const openQueries = trial.monitoringQueries?.filter((q: any) => q.status === "Open").length || 0;

            return (
              <div
                key={trial.id}
                onClick={() => onSelectTrial(trial.id)}
                className={`p-6 rounded-cards cursor-pointer transition-all flex flex-col justify-between border ${
                  isSelected
                    ? "bg-surface-card border-text-primary shadow-steep-subtle"
                    : "bg-surface-card border-transparent hover:border-border-subtle hover:shadow-steep-subtle-2"
                }`}
              >
                <div>
                  {/* Header badges */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="steep-tag px-2 py-1 bg-background border border-border-subtle rounded-md">
                      {trial.trialPhase}
                    </span>
                    <span className="text-xs font-sohne font-medium text-text-secondary">
                      {trial.ctriId}
                    </span>
                  </div>

                  <h3 className="font-signifier font-medium text-lg text-text-primary leading-snug line-clamp-2">
                    {trial.studyTitle}
                  </h3>

                  <div className="mt-4 text-sm text-text-secondary space-y-2 font-sohne">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-text-muted">Discipline</span>
                      <span className="truncate font-medium text-text-primary">{trial.therapeuticArea}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-text-muted">Principal Inv.</span>
                      <span className="truncate font-medium text-text-primary">{trial.principalInvestigator}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-border-subtle space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2 font-sohne">
                      <span className="text-text-secondary">Enrolled</span>
                      <span className="font-medium text-text-primary">
                        {trial.currentEnrollment} / {trial.targetEnrollment} <span className="text-text-muted font-normal ml-1">({trialPct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-border-subtle h-1 rounded-full overflow-hidden">
                      <div
                        className="bg-text-primary h-full"
                        style={{ width: `${trialPct}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 font-sohne">
                    <span className="text-text-primary font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
                      <span>{trial.status}</span>
                    </span>
                    {openQueries > 0 ? (
                      <span className="text-text-primary font-medium">
                        {openQueries} Open Queries
                      </span>
                    ) : (
                      <span className="text-text-muted">0 Open Queries</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
