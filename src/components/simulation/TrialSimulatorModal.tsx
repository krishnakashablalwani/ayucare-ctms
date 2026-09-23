"use client";

import React, { useState } from "react";
import { Zap, AlertTriangle, UserPlus, CheckCircle2 } from "lucide-react";

interface TrialSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  trials: any[];
  onRefresh: () => void;
}

export const TrialSimulatorModal: React.FC<TrialSimulatorModalProps> = ({
  isOpen,
  onClose,
  trials,
  onRefresh,
}) => {
  const [selectedTrialId, setSelectedTrialId] = useState(trials[0]?.id || "");
  const [statusMessage, setStatusMessage] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const handleSimulateAction = async (action: string) => {
    setIsSimulating(true);
    setStatusMessage("");
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          trialId: selectedTrialId || trials[0]?.id,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage(data.message || "Simulation event successfully executed.");
        onRefresh();
      } else {
        setStatusMessage("Error: " + data.error);
      }
    } catch (e: any) {
      setStatusMessage("Simulation failed: " + e.message);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
      <div className="steep-card max-w-lg w-full bg-background shadow-steep-subtle-2 p-8 font-sohne text-sm">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-accent text-text-primary flex items-center justify-center border border-border-subtle">
              <Zap className="w-4 h-4 text-text-primary" />
            </div>
            <h3 className="font-signifier font-medium text-2xl text-text-primary tracking-tight">
              Simulation Lab
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <p className="text-text-secondary leading-relaxed mb-6">
          Test real-time platform behaviors for SIH evaluators. Trigger emergency pharmacovigilance alerts, rapid subject intake, and GCP cryptographic changes on the fly.
        </p>

        {statusMessage && (
          <div className="mb-6 p-4 rounded-cards bg-surface-fog border border-border-subtle text-text-primary font-medium flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-text-primary" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">
              Target Clinical Trial
            </label>
            <select
              value={selectedTrialId}
              onChange={(e) => setSelectedTrialId(e.target.value)}
              className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
            >
              {trials.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.protocolNumber} — {t.ctriId}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-4 pt-2">
            {/* Scenario 1: Urgent SAE Trigger */}
            <div className="p-4 bg-surface-accent border border-sienna/20 rounded-cards flex items-center justify-between gap-4">
              <div>
                <div className="font-medium text-sienna flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Scenario A: Inject Serious Adverse Event (SAE)</span>
                </div>
                <div className="text-xs text-sienna/80 mt-1 leading-relaxed">
                  Fires a CTCAE Grade 4 reaction. Starts 24-hr regulatory countdown across PI and Ethics dashboards.
                </div>
              </div>
              <button
                onClick={() => handleSimulateAction("INJECT_SAE")}
                disabled={isSimulating}
                className="steep-pill-filled shrink-0"
              >
                Inject SAE
              </button>
            </div>

            {/* Scenario 2: Quick Enroll Participant */}
            <div className="p-4 bg-background border border-border-subtle rounded-cards flex items-center justify-between gap-4 shadow-steep-subtle">
              <div>
                <div className="font-medium text-text-primary flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-text-primary flex-shrink-0" />
                  <span>Scenario B: Quick Enroll Participant</span>
                </div>
                <div className="text-xs text-text-secondary mt-1 leading-relaxed">
                  Generates an eligible subject with Prakriti scores and schedules baseline visit.
                </div>
              </div>
              <button
                onClick={() => handleSimulateAction("QUICK_ENROLL")}
                disabled={isSimulating}
                className="steep-pill-ghost shrink-0"
              >
                Enroll Subject
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6 mt-8 border-t border-border-subtle flex items-center justify-end">
          <button
            onClick={onClose}
            className="steep-pill-ghost"
          >
            Close Lab
          </button>
        </div>
      </div>
    </div>
  );
};
