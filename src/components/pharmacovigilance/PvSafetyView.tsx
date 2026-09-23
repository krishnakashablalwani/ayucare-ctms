"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Send,
  Plus,
  Building,
  CheckCircle2,
  Lock,
  Activity,
} from "lucide-react";
import { RoleType } from "../layout/Header";

interface PvSafetyViewProps {
  adverseEvents: any[];
  subjects: any[];
  trials: any[];
  currentRole: RoleType;
  onRefresh: () => void;
  selectedTrialId: string | null;
}

export const PvSafetyView: React.FC<PvSafetyViewProps> = ({
  adverseEvents,
  subjects,
  trials,
  currentRole,
  onRefresh,
  selectedTrialId,
}) => {
  const [selectedAe, setSelectedAe] = useState<any | null>(adverseEvents[0] || null);
  const [showLogAdrModal, setShowLogAdrModal] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // ADR Intake Form State
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || "");
  const [eventTerm, setEventTerm] = useState("");
  const [medDraCode, setMedDraCode] = useState("10019692");
  const [medDraTerm, setMedDraTerm] = useState("Hepatic enzyme increased");
  const [ctcaeGrade, setCtcaeGrade] = useState(3);
  const [severity, setSeverity] = useState("Severe");
  const [causality, setCausality] = useState("Probable");
  const [isSeriousnessSae, setIsSeriousnessSae] = useState(true);
  const [seriousnessCriteria, setSeriousnessCriteria] = useState("Inpatient Hospitalization");
  const [actionTaken, setActionTaken] = useState("Dose Temporarily Interrupted");
  const [outcome, setOutcome] = useState("Recovering / Resolving");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Time remaining calculation for 24-hr regulatory compliance
  const formatCountdown = (deadlineIso?: string) => {
    if (!deadlineIso) return { text: "24h Regulatory Clock Not Started", isPast: false };
    const diff = new Date(deadlineIso).getTime() - new Date().getTime();
    if (diff <= 0) return { text: "OVERDUE (Regulatory Window Elapsed)", isPast: true };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return { text: `${hours}h : ${mins}m Remaining to Notify DCGI/EC`, isPast: false };
  };

  const handleLogAdrSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !eventTerm) {
      alert("Subject and Adverse Event Term are mandatory.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/adverse-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          eventTerm,
          medDraCode,
          medDraTerm,
          ctcaeGrade: Number(ctcaeGrade),
          severity,
          isSeriousnessSae,
          seriousnessCriteria: isSeriousnessSae ? seriousnessCriteria : null,
          causalityAyushDrug: causality,
          actionTaken,
          outcome,
          reportedByRole: currentRole,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to log Adverse Event");
      } else {
        setShowLogAdrModal(false);
        setEventTerm("");
        onRefresh();
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEscalateReport = async (aeId: string, destination: "ETHICS" | "DCGI") => {
    setIsReporting(true);
    try {
      const res = await fetch(`/api/adverse-events/${aeId}/report`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, reportedBy: currentRole }),
      });

      if (res.ok) {
        onRefresh();
      } else {
        const data = await res.json();
        alert("Error escalating report: " + data.error);
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsReporting(false);
    }
  };

  const urgentSaes = adverseEvents.filter((ae) => ae.isSeriousnessSae && (!ae.reportedToEthics || !ae.reportedToDcgi));

  return (
    <div className="space-y-10 animate-fade-in-up pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>Pharmacovigilance &amp; Safety</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-signifier font-normal text-text-primary tracking-heading leading-heading-sm">
            National PV Centre
          </h1>
          <p className="text-body text-text-secondary font-sohne max-w-2xl">
            Safety monitoring for ASU&amp;H research: CTCAE v5.0 severity grading, MedDRA coding, and 24-hr regulatory reporting.
          </p>
        </div>

        <button
          onClick={() => setShowLogAdrModal(true)}
          className="steep-pill-filled self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Report Adverse Event</span>
        </button>
      </div>

      {/* URGENT 24-HOUR REGULATORY ALERT BANNER */}
      {urgentSaes.length > 0 && (
        <div className="p-6 border border-sienna/20 bg-sienna/5 rounded-cards space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-sienna/10 pb-4">
            <div className="flex items-center gap-2.5 text-sienna font-medium text-lg font-signifier">
              <AlertTriangle className="w-5 h-5" />
              <span>Urgent: {urgentSaes.length} Serious Adverse Event(s) Require 24-hr Filing</span>
            </div>
            <span className="text-xs font-sohne text-sienna/70 uppercase tracking-widest font-medium">
              Mandatory NDCT Rules 2019
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {urgentSaes.map((sae) => {
              const countdown = formatCountdown(sae.regulatoryDeadline24h);
              return (
                <div
                  key={sae.id}
                  className="p-5 bg-background rounded-xl border border-sienna/20 space-y-4 shadow-steep-subtle"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-sienna uppercase font-medium tracking-wide block mb-1">
                        CTCAE Grade {sae.ctcaeGrade} ({sae.severity})
                      </span>
                      <h4 className="font-signifier font-medium text-xl text-text-primary">
                        {sae.eventTerm}
                      </h4>
                      <p className="text-sm text-text-secondary font-sohne mt-1">
                        Participant: {sae.subject?.screeningId} • Trial: {sae.subject?.trial?.protocolNumber}
                      </p>
                    </div>
                  </div>

                  {/* Real-time Countdown Gauge */}
                  <div className="p-3 rounded-lg bg-surface-fog border border-border-subtle flex items-center justify-between font-sohne text-sm">
                    <div className="flex items-center gap-2 text-text-primary font-medium">
                      <Clock className="w-4 h-4 text-sienna" />
                      <span className={countdown.isPast ? "text-sienna" : ""}>{countdown.text}</span>
                    </div>
                  </div>

                  {/* 1-Click Escalation Actions */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {!sae.reportedToEthics ? (
                      <button
                        onClick={() => handleEscalateReport(sae.id, "ETHICS")}
                        disabled={isReporting}
                        className="steep-pill-filled text-sm"
                      >
                        <Send className="w-4 h-4" />
                        <span>Notify Ethics</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-md bg-surface-fog text-text-primary border border-border-subtle text-xs font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ethics Notified
                      </span>
                    )}

                    {!sae.reportedToDcgi ? (
                      <button
                        onClick={() => handleEscalateReport(sae.id, "DCGI")}
                        disabled={isReporting}
                        className="steep-pill-ghost text-sm"
                      >
                        <Building className="w-4 h-4" />
                        <span>File to DCGI</span>
                      </button>
                    ) : (
                      <span className="px-3 py-1 rounded-md bg-surface-fog text-text-primary border border-border-subtle text-xs font-medium flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        DCGI Escalated
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main ADR Table & Deep Safety Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Safety Registry Table (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-background border border-border-subtle rounded-cards overflow-hidden shadow-steep-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sohne text-sm">
                <thead className="bg-surface-fog border-b border-border-subtle text-text-muted text-xs font-medium uppercase tracking-wide">
                  <tr>
                    <th className="p-4">Event &amp; MedDRA</th>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Grade</th>
                    <th className="p-4">Causality</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {adverseEvents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-text-secondary">
                        No adverse events registered.
                      </td>
                    </tr>
                  ) : (
                    adverseEvents.map((ae) => {
                      const isSelected = selectedAe?.id === ae.id;
                      return (
                        <tr
                          key={ae.id}
                          onClick={() => setSelectedAe(ae)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-surface-accent text-sienna"
                              : "hover:bg-surface-fog text-text-primary"
                          }`}
                        >
                          <td className="p-4">
                            <span className="font-medium block">
                              {ae.eventTerm}
                            </span>
                            <span className={`text-xs block mt-0.5 ${isSelected ? 'text-sienna/70' : 'text-text-muted'}`}>
                              MedDRA: {ae.medDraCode}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="block font-medium">
                              {ae.subject?.screeningId || "SUBJ"}
                            </span>
                            <span className={`text-xs block mt-0.5 ${isSelected ? 'text-sienna/70' : 'text-text-muted'}`}>
                              Onset: {ae.onsetDate}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                                ae.ctcaeGrade >= 3
                                  ? (isSelected ? "bg-background/50 border-sienna/20 text-sienna" : "bg-surface-accent border-sienna/20 text-sienna")
                                  : (isSelected ? "bg-background/50 border-sienna/20 text-sienna" : "bg-surface-fog border-border-subtle text-text-secondary")
                              }`}
                            >
                              Grade {ae.ctcaeGrade}
                            </span>
                          </td>
                          <td className={`p-4 text-xs ${isSelected ? 'text-sienna/80' : 'text-text-secondary'}`}>
                            {ae.causalityAyushDrug}
                          </td>
                          <td className="p-4">
                            {ae.reportedToEthics && ae.reportedToDcgi ? (
                              <span className={`text-xs font-medium flex items-center gap-1.5 ${isSelected ? 'text-sienna' : 'text-text-primary'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sienna' : 'bg-text-primary'}`} />
                                Fully Reported
                              </span>
                            ) : ae.isSeriousnessSae ? (
                              <span className="text-sienna text-xs font-medium">
                                Pending 24h
                              </span>
                            ) : (
                              <span className={`text-xs ${isSelected ? 'text-sienna/70' : 'text-text-muted'}`}>
                                Logged
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Adverse Event Dossier (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedAe ? (
            <div className="steep-card space-y-6">
              <div className="flex items-start justify-between border-b border-border-subtle pb-5">
                <div>
                  <span className="text-xs uppercase font-sohne text-text-muted font-medium tracking-widest">
                    Pharmacovigilance Dossier
                  </span>
                  <h3 className="font-signifier font-medium text-2xl text-text-primary mt-2">
                    {selectedAe.eventTerm}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1 font-sohne">
                    Onset: {selectedAe.onsetDate} • Subject: {selectedAe.subject?.screeningId}
                  </p>
                </div>
                <span
                  className={`steep-tag px-3 py-1 rounded-md border font-medium ${
                    selectedAe.isSeriousnessSae
                      ? "bg-surface-accent text-sienna border-sienna/20"
                      : "bg-background text-text-secondary border-border-subtle"
                  }`}
                >
                  {selectedAe.isSeriousnessSae ? "SAE" : "ADR"}
                </span>
              </div>

              {/* Dictionaries & Grading Breakdown */}
              <div className="space-y-4 font-sohne text-sm">
                <div className="p-4 bg-background rounded-cards border border-border-subtle space-y-1">
                  <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">MedDRA Coded Term</span>
                  <div className="text-text-primary font-medium">
                    {selectedAe.medDraTerm} (Code: {selectedAe.medDraCode})
                  </div>
                </div>

                <div className="p-4 bg-background rounded-cards border border-border-subtle space-y-1">
                  <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">WHODrug / Ayush Investigational Agent</span>
                  <div className="text-text-primary font-medium">
                    {selectedAe.whoDrugCode || "Withania Somnifera (Ashwagandha Extract)"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-cards border border-border-subtle">
                    <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">Causality</span>
                    <span className="font-medium text-text-primary mt-1 block">{selectedAe.causalityAyushDrug}</span>
                  </div>
                  <div className="p-4 bg-background rounded-cards border border-border-subtle">
                    <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">Action Taken</span>
                    <span className="font-medium text-text-primary mt-1 block">{selectedAe.actionTaken}</span>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-cards border border-border-subtle space-y-1">
                  <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">Seriousness Criteria</span>
                  <div className="text-text-primary font-medium">
                    {selectedAe.seriousnessCriteria || "None (Non-serious)"}
                  </div>
                </div>
              </div>

              {/* Regulatory Escalation Status */}
              <div className="p-5 bg-surface-fog rounded-cards border border-border-subtle space-y-3 font-sohne text-sm">
                <span className="font-medium text-text-primary block border-b border-border-subtle pb-2">
                  Regulatory Escalation Log (NDCT 2019)
                </span>
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">Ethics Committee (IEC):</span>
                    <span className={`font-medium ${selectedAe.reportedToEthics ? "text-text-primary" : "text-sienna"}`}>
                      {selectedAe.reportedToEthics ? "Reported" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">DCGI / CDSCO:</span>
                    <span className={`font-medium ${selectedAe.reportedToDcgi ? "text-text-primary" : "text-sienna"}`}>
                      {selectedAe.reportedToDcgi ? "Reported" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="steep-card p-12 text-center text-text-muted font-sohne text-sm flex items-center justify-center min-h-[400px]">
              Select an event to view full safety profile.
            </div>
          )}
        </div>
      </div>

      {/* LOG ADR MODAL */}
      {showLogAdrModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="steep-card max-w-lg w-full bg-background shadow-steep-subtle-2 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
              <h3 className="font-signifier font-medium text-2xl text-text-primary">
                Log Adverse Event
              </h3>
              <button
                onClick={() => setShowLogAdrModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogAdrSubmit} className="space-y-6 font-sohne text-sm">
              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Subject *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.screeningId} ({s.subjectInitials}) — {s.assignedArm.slice(0, 35)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Reported Adverse Event Term *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Transaminitis with Jaundice"
                  value={eventTerm}
                  onChange={(e) => setEventTerm(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">MedDRA Term</label>
                  <input
                    type="text"
                    value={medDraTerm}
                    onChange={(e) => setMedDraTerm(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">MedDRA Code</label>
                  <input
                    type="text"
                    value={medDraCode}
                    onChange={(e) => setMedDraCode(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">CTCAE v5.0 Grade</label>
                  <select
                    value={ctcaeGrade}
                    onChange={(e) => {
                      const g = Number(e.target.value);
                      setCtcaeGrade(g);
                      if (g >= 3) {
                        setIsSeriousnessSae(true);
                        setSeverity("Severe");
                      } else {
                        setIsSeriousnessSae(false);
                        setSeverity("Mild");
                      }
                    }}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  >
                    <option value={1}>Grade 1: Mild</option>
                    <option value={2}>Grade 2: Moderate</option>
                    <option value={3}>Grade 3: Severe (SAE)</option>
                    <option value={4}>Grade 4: Life-threatening</option>
                    <option value={5}>Grade 5: Death</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Causality</label>
                  <select
                    value={causality}
                    onChange={(e) => setCausality(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  >
                    <option value="Certain">Certain</option>
                    <option value="Probable">Probable</option>
                    <option value="Possible">Possible</option>
                    <option value="Unlikely">Unlikely</option>
                    <option value="Unclassifiable">Unclassifiable</option>
                  </select>
                </div>
              </div>

              <div className="p-5 bg-surface-fog rounded-cards border border-border-subtle space-y-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeriousnessSae}
                    onChange={(e) => setIsSeriousnessSae(e.target.checked)}
                    className="mt-1 accent-text-primary"
                  />
                  <div>
                    <span className="font-medium text-text-primary block text-sm">
                      Serious Adverse Event (SAE)
                    </span>
                    <span className="text-xs text-text-secondary">
                      Triggers mandatory 24-hr regulatory reporting clock
                    </span>
                  </div>
                </label>

                {isSeriousnessSae && (
                  <div className="pt-2">
                    <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Seriousness Criteria</label>
                    <select
                      value={seriousnessCriteria}
                      onChange={(e) => setSeriousnessCriteria(e.target.value)}
                      className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                    >
                      <option value="Inpatient Hospitalization">Required Inpatient Hospitalization</option>
                      <option value="Life-Threatening Event">Life-Threatening Event</option>
                      <option value="Persistent Disability">Persistent Disability or Incapacity</option>
                      <option value="Medically Significant">Medically Significant Event</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowLogAdrModal(false)}
                  className="steep-pill-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="steep-pill-filled"
                >
                  {isSubmitting ? "Logging..." : "Submit Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
