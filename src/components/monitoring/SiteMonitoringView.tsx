"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Plus,
  AlertCircle,
  CheckCircle2,
  FileText,
  UserCheck,
  Send,
  Lock,
  Search,
} from "lucide-react";
import { RoleType } from "../layout/Header";

interface SiteMonitoringViewProps {
  queries: any[];
  subjects: any[];
  trials: any[];
  currentRole: RoleType;
  onRefresh: () => void;
  selectedTrialId: string | null;
}

export const SiteMonitoringView: React.FC<SiteMonitoringViewProps> = ({
  queries,
  subjects,
  trials,
  currentRole,
  onRefresh,
  selectedTrialId,
}) => {
  const [showRaiseQueryModal, setShowRaiseQueryModal] = useState(false);
  const [showSignSdvModal, setShowSignSdvModal] = useState(false);
  const [activeVisitForSdv, setActiveVisitForSdv] = useState<any | null>(null);

  // Raise Query Form State
  const [querySubjectId, setQuerySubjectId] = useState(subjects[0]?.screeningId || "");
  const [queryVisitName, setQueryVisitName] = useState("Visit 1 (Day 0 - Baseline)");
  const [queryField, setQueryField] = useState("");
  const [queryDescription, setQueryDescription] = useState("");
  const [isRaising, setIsRaising] = useState(false);

  // Resolve Query State
  const [resolvingQueryId, setResolvingQueryId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  // Sign SDV Form State
  const [sdvReason, setSdvReason] = useState("100% Source Data Verification completed against EHR and physical Rogi Pariksha sheet.");
  const [isSigningSdv, setIsSigningSdv] = useState(false);

  // Flatten all visits for SDV tracking
  const allVisits: any[] = [];
  subjects.forEach((s) => {
    s.visits?.forEach((v: any) => {
      allVisits.push({
        ...v,
        subjectScreeningId: s.screeningId,
        subjectInitials: s.subjectInitials,
        trialId: s.trialId,
      });
    });
  });

  const handleRaiseQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryField || !queryDescription) {
      alert("All fields are required.");
      return;
    }

    setIsRaising(true);
    try {
      const res = await fetch("/api/monitoring-queries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId: selectedTrialId || trials[0]?.id,
          subjectScreeningId: querySubjectId,
          visitName: queryVisitName,
          field: queryField,
          issueDescription: queryDescription,
          raisedBy: currentRole,
        }),
      });

      if (res.ok) {
        setShowRaiseQueryModal(false);
        setQueryField("");
        setQueryDescription("");
        onRefresh();
      } else {
        const data = await res.json();
        alert("Failed to raise query: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsRaising(false);
    }
  };

  const handleResolveQuery = async (queryId: string) => {
    if (!resolutionNote || resolutionNote.trim().length < 5) {
      alert("Please provide a detailed resolution note (min 5 characters).");
      return;
    }

    setIsResolving(true);
    try {
      const res = await fetch(`/api/monitoring-queries/${queryId}/resolve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: resolutionNote,
          resolvedBy: currentRole,
        }),
      });

      if (res.ok) {
        setResolvingQueryId(null);
        setResolutionNote("");
        onRefresh();
      } else {
        const data = await res.json();
        alert("Resolution error: " + data.error);
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsResolving(false);
    }
  };

  const handleExecuteSdvSign = async () => {
    if (!activeVisitForSdv) return;

    setIsSigningSdv(true);
    try {
      const res = await fetch(`/api/visits/${activeVisitForSdv.id}/sign-sdv`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signedByRole: currentRole,
          sdvReason,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setShowSignSdvModal(false);
        setActiveVisitForSdv(null);
        onRefresh();
      } else {
        alert("SDV Sign failed: " + data.error);
      }
    } catch (err: any) {
      alert("Network error: " + err.message);
    } finally {
      setIsSigningSdv(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>CRA Site Monitoring</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-signifier font-normal text-text-primary tracking-heading leading-heading-sm">
            Clinical Telemetry &amp; SDV
          </h1>
          <p className="text-body text-text-secondary font-sohne max-w-2xl">
            Clinical Research Associate workstation: query management, 100% SDV audit compliance, and monitor sign-offs.
          </p>
        </div>

        <button
          onClick={() => setShowRaiseQueryModal(true)}
          className="steep-pill-filled self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Raise Monitoring Query</span>
        </button>
      </div>

      {/* Grid: Open Queries (Left) & SDV Visit Queue (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Discrepancy Query Queue (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-signifier font-medium text-2xl text-text-primary flex items-center gap-3">
              <span>Discrepancy Ledger</span>
              <span className="steep-tag px-2.5 py-0.5 rounded-md bg-surface-accent border border-sienna/20 text-sienna">
                {queries.filter((q) => q.status === "Open").length} OPEN
              </span>
            </h3>
          </div>

          <div className="space-y-4 font-sohne text-sm">
            {queries.length === 0 ? (
              <div className="steep-card p-10 text-center text-text-secondary font-sohne">
                No active discrepancy queries. Site is fully reconciled.
              </div>
            ) : (
              queries.map((q) => {
                const isOpen = q.status === "Open";
                const isResolvingThis = resolvingQueryId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`steep-card transition-all relative overflow-hidden ${
                      isOpen
                        ? "bg-background"
                        : "bg-surface-fog opacity-80"
                    }`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOpen ? 'bg-sienna' : 'bg-text-muted'}`} />
                    <div className="pl-4">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="text-xs uppercase font-medium text-text-secondary tracking-wide block">
                            Subject: {q.subjectScreeningId} • {q.visitName}
                          </span>
                          <div className="font-medium text-text-primary mt-1 text-base">
                            {q.field}
                          </div>
                        </div>
                        <span
                          className={`text-xs uppercase px-2.5 py-1 rounded-md font-medium border ${
                            isOpen
                              ? "bg-background border-sienna/30 text-sienna"
                              : "bg-background border-border-subtle text-text-secondary"
                          }`}
                        >
                          {q.status}
                        </span>
                      </div>

                      <div className="text-text-primary text-sm leading-relaxed bg-surface-fog p-3.5 rounded-cards border border-border-subtle font-sohne italic">
                        &ldquo;{q.issueDescription}&rdquo;
                      </div>

                      {q.response && (
                        <div className="mt-3 p-3.5 rounded-cards bg-background border border-border-subtle text-text-primary text-sm">
                          <span className="font-medium text-text-secondary block text-xs uppercase tracking-wide mb-1">Resolution Response:</span>
                          <span>{q.response}</span>
                        </div>
                      )}

                      <div className="mt-4 pt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                        <span>Raised by: {q.raisedBy}</span>
                        {isOpen && (
                          <div>
                            {isResolvingThis ? (
                              <div className="flex flex-col gap-3 mt-3 w-full">
                                <textarea
                                  rows={2}
                                  placeholder="Enter resolution justification..."
                                  value={resolutionNote}
                                  onChange={(e) => setResolutionNote(e.target.value)}
                                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary text-sm"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => setResolvingQueryId(null)}
                                    className="steep-pill-ghost text-xs py-1.5 px-3"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleResolveQuery(q.id)}
                                    disabled={isResolving}
                                    className="steep-pill-filled text-xs py-1.5 px-3"
                                  >
                                    {isResolving ? "Resolving..." : "Submit Resolution"}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setResolvingQueryId(q.id)}
                                className="steep-text-link font-medium"
                              >
                                Resolve Discrepancy →
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Source Data Verification (SDV) Table (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h3 className="font-signifier font-medium text-2xl text-text-primary flex items-center gap-3">
              <span>Source Data Verification</span>
            </h3>
            <span className="text-sm text-text-secondary font-sohne font-medium">100% SDV Mandate</span>
          </div>

          <div className="bg-background border border-border-subtle rounded-cards overflow-hidden shadow-steep-subtle font-sohne text-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-fog border-b border-border-subtle text-text-muted text-xs font-medium uppercase tracking-wide">
                  <tr>
                    <th className="p-4">Participant</th>
                    <th className="p-4">Visit</th>
                    <th className="p-4">SDV Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {allVisits.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-text-secondary">
                        No visits logged for verification.
                      </td>
                    </tr>
                  ) : (
                    allVisits.map((v) => {
                      const isVerified = v.sdvStatus === "Verified";

                      return (
                        <tr key={v.id} className="hover:bg-surface-fog transition-colors">
                          <td className="p-4">
                            <span className="font-medium text-text-primary block">
                              {v.subjectScreeningId}
                            </span>
                            <span className="text-xs text-text-muted block mt-0.5">
                              {v.subjectInitials}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-text-primary block">{v.visitName}</span>
                            <span className="text-xs text-text-muted block mt-0.5">
                              Scheduled: {v.scheduledDate}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs uppercase font-medium px-2.5 py-1 rounded-md border ${
                                isVerified
                                  ? "bg-surface-fog border-border-subtle text-text-secondary"
                                  : "bg-surface-accent border-sienna/20 text-sienna"
                              }`}
                            >
                              {v.sdvStatus || "Pending"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            {!isVerified ? (
                              <button
                                onClick={() => {
                                  setActiveVisitForSdv(v);
                                  setShowSignSdvModal(true);
                                }}
                                className="steep-pill-filled text-xs py-1.5 px-3 whitespace-nowrap"
                              >
                                Sign SDV
                              </button>
                            ) : (
                              <span className="text-xs text-text-primary font-medium whitespace-nowrap">
                                ✓ Signed
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
      </div>

      {/* RAISE QUERY MODAL */}
      {showRaiseQueryModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="steep-card max-w-lg w-full bg-background shadow-steep-subtle-2 p-8">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
              <h3 className="font-signifier font-medium text-2xl text-text-primary">Raise Discrepancy Query</h3>
              <button
                onClick={() => setShowRaiseQueryModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRaiseQuery} className="space-y-5 font-sohne text-sm">
              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Subject Screening ID</label>
                <select
                  value={querySubjectId}
                  onChange={(e) => setQuerySubjectId(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.screeningId}>
                      {s.screeningId} ({s.subjectInitials})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Visit Timepoint</label>
                <select
                  value={queryVisitName}
                  onChange={(e) => setQueryVisitName(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                >
                  <option value="Visit 1 (Day 0 - Baseline)">Visit 1 (Day 0 - Baseline)</option>
                  <option value="Visit 2 (Day 14 Assessment)">Visit 2 (Day 14 Assessment)</option>
                  <option value="Visit 3 (Day 28 Midpoint)">Visit 3 (Day 28 Midpoint)</option>
                  <option value="Visit 4 (Day 56 Endpoint)">Visit 4 (Day 56 Endpoint)</option>
                </select>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Discrepant Clinical Field</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Systolic BP / MMSE Score / Rogi Pariksha"
                  value={queryField}
                  onChange={(e) => setQueryField(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                />
              </div>

              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Discrepancy Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify discrepancy observed between source medical records and electronic case sheet."
                  value={queryDescription}
                  onChange={(e) => setQueryDescription(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                />
              </div>

              <div className="pt-5 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowRaiseQueryModal(false)}
                  className="steep-pill-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRaising}
                  className="steep-pill-filled"
                >
                  {isRaising ? "Logging Query..." : "Issue Query to CRC"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIGN SDV MODAL (21 CFR Part 11 Electronic Signature) */}
      {showSignSdvModal && activeVisitForSdv && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="steep-card max-w-md w-full bg-background shadow-steep-subtle-2 p-8">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
              <div>
                <span className="text-xs text-text-primary border border-border-subtle bg-surface-fog px-2 py-0.5 rounded-full font-medium uppercase tracking-wider block font-sohne w-max mb-2">
                  21 CFR PART 11 SIGNATURE
                </span>
                <h3 className="font-signifier font-medium text-2xl text-text-primary">
                  Source Data Verification
                </h3>
              </div>
              <button
                onClick={() => setShowSignSdvModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 font-sohne text-sm">
              <div className="p-4 bg-background rounded-cards border border-border-subtle space-y-2 text-text-secondary">
                <div className="flex justify-between">
                  <span>Subject:</span>
                  <span className="font-medium text-text-primary">{activeVisitForSdv.subjectScreeningId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visit:</span>
                  <span className="font-medium text-text-primary">{activeVisitForSdv.visitName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monitor:</span>
                  <span className="font-medium text-text-primary">Dr. Ananya Mishra (CRA)</span>
                </div>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Verification Confirmation Statement</label>
                <textarea
                  rows={2}
                  value={sdvReason}
                  onChange={(e) => setSdvReason(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                />
              </div>

              <div className="p-4 bg-surface-fog rounded-cards border border-border-subtle text-xs text-text-secondary leading-relaxed flex gap-3 items-start">
                <Lock className="w-4 h-4 text-text-muted shrink-0 mt-0.5" />
                <p>
                  By executing this signature, I legally attest that 100% source data verification has been completed against original medical records in compliance with GCP-ASU and 21 CFR Part 11.
                </p>
              </div>

              <div className="pt-5 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowSignSdvModal(false)}
                  className="steep-pill-ghost"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteSdvSign}
                  disabled={isSigningSdv}
                  className="steep-pill-filled"
                >
                  {isSigningSdv ? "Signing with SHA-256..." : "Sign with Cryptographic Hash"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
