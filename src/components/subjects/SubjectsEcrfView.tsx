"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  FileEdit,
  Lock,
} from "lucide-react";
import { RoleType } from "../layout/Header";

interface SubjectsEcrfViewProps {
  subjects: any[];
  trials: any[];
  currentRole: RoleType;
  onRefresh: () => void;
  selectedTrialId: string | null;
}

export const SubjectsEcrfView: React.FC<SubjectsEcrfViewProps> = ({
  subjects,
  trials,
  currentRole,
  onRefresh,
  selectedTrialId,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<any | null>(subjects[0] || null);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showEcrfEditModal, setShowEcrfEditModal] = useState(false);
  const [activeEditingVisit, setActiveEditingVisit] = useState<any | null>(null);
  
  // AI Insights State
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    setAiInsight(null);
  }, [selectedSubject?.id]);

  // New Subject Form State
  const [enrollTrialId, setEnrollTrialId] = useState(selectedTrialId || trials[0]?.id || "");
  const [screeningId, setScreeningId] = useState("");
  const [subjectInitials, setSubjectInitials] = useState("");
  const [age, setAge] = useState("45");
  const [gender, setGender] = useState("Female");
  const [assignedArm, setAssignedArm] = useState("Investigational Herbal Extract (500mg BID)");
  const [vata, setVata] = useState(40);
  const [pitta, setPitta] = useState(40);
  const [kapha, setKapha] = useState(20);
  const [isEnrolling, setIsEnrolling] = useState(false);

  // eCRF Edit Form State (with mandatory Reason for Change)
  const [editBp, setEditBp] = useState("");
  const [editPulse, setEditPulse] = useState("");
  const [editNadi, setEditNadi] = useState("Samanya");
  const [editPittaIndex, setEditPittaIndex] = useState(4.0);
  const [reasonForChange, setReasonForChange] = useState("");
  const [isUpdatingVisit, setIsUpdatingVisit] = useState(false);
  const [ecrfError, setEcrfError] = useState("");

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch =
      s.screeningId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.randomizationId && s.randomizationId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.subjectInitials.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrial = selectedTrialId ? s.trialId === selectedTrialId : true;
    return matchesSearch && matchesTrial;
  });

  const getDominantPrakriti = (v: number, p: number, k: number) => {
    if (v >= p && v >= k) return "Vata Pradhana";
    if (p >= v && p >= k) return "Pitta Pradhana";
    return "Kapha Pradhana";
  };

  const handleGenerateInsight = async () => {
    if (!selectedSubject) return;
    setIsGeneratingInsight(true);
    setAiInsight(null);

    let pObj: any = { vata: 33, pitta: 33, kapha: 34 };
    try {
      pObj = typeof selectedSubject.baselinePrakriti === "string"
        ? JSON.parse(selectedSubject.baselinePrakriti)
        : selectedSubject.baselinePrakriti;
    } catch {}

    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vata: pObj.vata,
          pitta: pObj.pitta,
          kapha: pObj.kapha,
          age: selectedSubject.age,
          gender: selectedSubject.gender,
          assignedArm: selectedSubject.assignedArm,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        setAiInsight(err.error || "Failed to generate insight.");
      } else {
        const data = await res.json();
        setAiInsight(data.insight);
      }
    } catch (err: any) {
      setAiInsight("An error occurred while calling the AI model.");
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screeningId || !subjectInitials || !age) {
      alert("Please fill all required fields.");
      return;
    }

    setIsEnrolling(true);
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trialId: enrollTrialId || trials[0]?.id,
          screeningId,
          randomizationId: `RND-${screeningId.replace("SCR-", "")}`,
          subjectInitials,
          age: parseInt(age, 10),
          gender,
          assignedArm,
          baselinePrakriti: {
            vata,
            pitta,
            kapha,
            primary: getDominantPrakriti(vata, pitta, kapha),
            characteristics: "Sama Agni, Madhyama Bala",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Enrollment failed");
      } else {
        setShowEnrollModal(false);
        setScreeningId("");
        setSubjectInitials("");
        onRefresh();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const openEditVisitModal = (visit: any) => {
    setActiveEditingVisit(visit);
    let obs: any = {};
    try {
      obs = typeof visit.clinicalObservations === "string"
        ? JSON.parse(visit.clinicalObservations)
        : visit.clinicalObservations || {};
    } catch {}

    setEditBp(obs.bloodPressure || "120/80");
    setEditPulse(obs.pulse || "72");
    setEditNadi(obs.nadi || "Samanya");
    setEditPittaIndex(obs.pittaAggravationScore || 3.5);
    setReasonForChange("");
    setEcrfError("");
    setShowEcrfEditModal(true);
  };

  const handleUpdateVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonForChange || reasonForChange.trim().length < 5) {
      setEcrfError("21 CFR Part 11 requires a descriptive Reason-for-Change (min 5 characters).");
      return;
    }

    setIsUpdatingVisit(true);
    setEcrfError("");

    try {
      const res = await fetch(`/api/visits/${activeEditingVisit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reasonForChange,
          modifiedBy: currentRole,
          clinicalObservations: {
            bloodPressure: editBp,
            pulse: editPulse,
            nadi: editNadi,
            pittaAggravationScore: Number(editPittaIndex),
            lastUpdatedBy: currentRole,
            timestamp: new Date().toISOString(),
          },
          status: "Completed",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setEcrfError(data.error || "Update failed.");
      } else {
        setShowEcrfEditModal(false);
        onRefresh();
      }
    } catch (err: any) {
      setEcrfError("Error: " + err.message);
    } finally {
      setIsUpdatingVisit(false);
    }
  };

  return (
    <div className="space-y-10 animate-fade-in-up pb-12">
      {/* Workstation Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>Ayurveda Clinical Intake</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-signifier font-normal text-text-primary tracking-heading leading-heading-sm">
            Subject Cohorts &amp; eCRF
          </h1>
          <p className="text-body text-text-secondary font-sohne max-w-2xl">
            Standardized Prakriti phenotyping, Rogi Pariksha telemetry, and 21 CFR Part 11 reason-for-change forms.
          </p>
        </div>

        <button
          onClick={() => setShowEnrollModal(true)}
          className="steep-pill-filled self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Subject</span>
        </button>
      </div>

      {/* Main Grid: Subject Table (left) & Detailed eCRF / Prakriti Inspector (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Subject Registry List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Screening ID, Randomization ID, or Initials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border-subtle rounded-inputs py-3 pl-12 pr-4 text-sm font-sohne text-text-primary focus:outline-none focus:border-text-muted transition-colors"
            />
          </div>

          <div className="bg-background border border-border-subtle rounded-cards overflow-hidden shadow-steep-subtle">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-sohne text-sm">
                <thead className="bg-surface-fog border-b border-border-subtle text-text-muted text-xs font-medium uppercase tracking-wide">
                  <tr>
                    <th className="p-4">Subject ID</th>
                    <th className="p-4">Demographics</th>
                    <th className="p-4">Prakriti</th>
                    <th className="p-4">Arm</th>
                    <th className="p-4">Visits</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredSubjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-text-secondary">
                        No participants found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredSubjects.map((subj) => {
                      const isSelected = selectedSubject?.id === subj.id;
                      let dominant = "Pitta";
                      try {
                        const p = typeof subj.baselinePrakriti === "string" ? JSON.parse(subj.baselinePrakriti) : subj.baselinePrakriti;
                        dominant = p.primary || "Ayurvedic";
                      } catch {}

                      const completedVisits = subj.visits?.filter((v: any) => v.status === "Completed").length || 0;
                      const totalVisits = subj.visits?.length || 0;

                      return (
                        <tr
                          key={subj.id}
                          onClick={() => setSelectedSubject(subj)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-surface-accent text-sienna"
                              : "hover:bg-surface-fog text-text-primary"
                          }`}
                        >
                          <td className="p-4">
                            <span className="font-medium block">
                              {subj.screeningId}
                            </span>
                            <span className={`text-xs block mt-0.5 ${isSelected ? 'text-sienna/70' : 'text-text-muted'}`}>
                              {subj.randomizationId || "Not randomized"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="block font-medium">
                              {subj.subjectInitials}
                            </span>
                            <span className={`text-xs block mt-0.5 ${isSelected ? 'text-sienna/70' : 'text-text-muted'}`}>
                              {subj.age}y • {subj.gender}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${isSelected ? 'bg-background/50 border-sienna/20 text-sienna' : 'bg-surface-fog border-border-subtle text-text-secondary'}`}>
                              {dominant}
                            </span>
                          </td>
                          <td className={`p-4 max-w-[130px] truncate text-xs ${isSelected ? 'text-sienna/80' : 'text-text-secondary'}`} title={subj.assignedArm}>
                            {subj.assignedArm}
                          </td>
                          <td className="p-4 font-medium">
                            {completedVisits}/{totalVisits}
                          </td>
                          <td className="p-4">
                            <span className={`text-xs font-medium flex items-center gap-1.5 ${isSelected ? 'text-sienna' : 'text-text-primary'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-sienna' : 'bg-text-primary'}`} />
                              {subj.status}
                            </span>
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

        {/* eCRF Drilldown & Subject Intake Detail (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {selectedSubject ? (
            <div className="steep-card space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-5">
                <div>
                  <span className="text-xs uppercase font-sohne text-text-muted font-medium tracking-widest">
                    Participant eCRF Dossier
                  </span>
                  <h2 className="text-2xl font-signifier font-medium text-text-primary mt-2">
                    {selectedSubject.subjectInitials} ({selectedSubject.screeningId})
                  </h2>
                  <p className="text-sm text-text-secondary mt-1 font-sohne">
                    Enrolled: {selectedSubject.enrollmentDate} • Consent Verified
                  </p>
                </div>
                <span className="steep-tag px-3 py-1 rounded-md bg-background border border-border-subtle font-medium">
                  {selectedSubject.randomizationId || "SCREENED"}
                </span>
              </div>

              {/* Prakriti Constitutional Breakdown */}
              <div className="p-5 bg-background rounded-cards border border-border-subtle space-y-4 font-sohne text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">
                    Baseline Prakriti Profile
                  </span>
                  <span className="text-xs text-text-primary bg-surface-fog px-2 py-0.5 rounded-full border border-border-subtle font-medium">
                    ALCOA+ Verified
                  </span>
                </div>

                {(() => {
                  let pObj: any = { vata: 33, pitta: 33, kapha: 34, primary: "Sama Prakriti" };
                  try {
                    pObj = typeof selectedSubject.baselinePrakriti === "string"
                      ? JSON.parse(selectedSubject.baselinePrakriti)
                      : selectedSubject.baselinePrakriti;
                  } catch {}

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm pb-2 border-b border-border-subtle">
                        <span className="text-text-secondary">Dominant Dosha</span>
                        <span className="font-medium text-text-primary">{pObj.primary}</span>
                      </div>

                      {/* Dosha Distribution Bars */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-text-muted mb-1">
                            <span>Vata (Movement / Air)</span>
                            <span className="font-medium text-text-primary">{pObj.vata}%</span>
                          </div>
                          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                            <div className="bg-text-primary h-full" style={{ width: `${pObj.vata}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-text-muted mb-1">
                            <span>Pitta (Metabolism / Fire)</span>
                            <span className="font-medium text-text-primary">{pObj.pitta}%</span>
                          </div>
                          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                            <div className="bg-text-secondary h-full" style={{ width: `${pObj.pitta}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-text-muted mb-1">
                            <span>Kapha (Structure / Earth)</span>
                            <span className="font-medium text-text-primary">{pObj.kapha}%</span>
                          </div>
                          <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                            <div className="bg-text-tertiary h-full" style={{ width: `${pObj.kapha}%` }} />
                          </div>
                        </div>
                      </div>
                      
                      {/* AI Insights Button & Result */}
                      <div className="pt-4 border-t border-border-subtle">
                        <button
                          onClick={handleGenerateInsight}
                          disabled={isGeneratingInsight}
                          className="steep-pill-ghost w-full justify-center text-xs"
                        >
                          {isGeneratingInsight ? "Analyzing Doshic Balance..." : "✨ Generate AI Risk Insight"}
                        </button>
                        
                        {aiInsight && (
                          <div className="mt-4 p-4 rounded-xl bg-surface-accent border border-sienna/20 text-sienna text-xs leading-relaxed animate-fade-in-up shadow-steep-subtle font-medium">
                            {aiInsight}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Scheduled eCRF Visits Lifecycle */}
              <div className="space-y-4 font-sohne">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">
                    eCRF Visit Schedule
                  </span>
                  <span className="text-xs text-text-muted">
                    {selectedSubject.visits?.length || 0} Timepoints
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedSubject.visits && selectedSubject.visits.length > 0 ? (
                    selectedSubject.visits.map((v: any) => {
                      let obs: any = {};
                      try {
                        obs = typeof v.clinicalObservations === "string"
                          ? JSON.parse(v.clinicalObservations)
                          : v.clinicalObservations;
                      } catch {}

                      const isCompleted = v.status === "Completed";

                      return (
                        <div
                          key={v.id}
                          className="p-4 bg-background rounded-xl border border-border-subtle flex flex-col justify-between gap-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium text-text-primary block text-sm">
                                {v.visitName}
                              </span>
                              <span className="text-xs text-text-secondary mt-0.5 block">
                                Scheduled: {v.scheduledDate} {v.completedDate && `• Done: ${v.completedDate}`}
                              </span>
                            </div>

                            <span
                              className={`text-xs px-2.5 py-1 rounded-md font-medium border ${
                                isCompleted
                                  ? "bg-text-primary text-background border-text-primary"
                                  : "bg-surface-fog text-text-secondary border-border-subtle"
                              }`}
                            >
                              {v.status}
                            </span>
                          </div>

                          {/* Quick Clinical Glance */}
                          {isCompleted && (
                            <div className="grid grid-cols-3 gap-2 text-xs text-text-secondary pt-3 border-t border-border-subtle">
                              <div>BP: {obs.bloodPressure || "120/80"}</div>
                              <div>Pulse: {obs.pulse || "72 bpm"}</div>
                              <div>Nadi: {obs.nadi || "Samanya"}</div>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-xs text-text-muted">
                              SDV: {v.sdvStatus || "Pending"}
                            </span>
                            <button
                              onClick={() => openEditVisitModal(v)}
                              className="steep-text-link text-xs font-medium"
                            >
                              <FileEdit className="w-3.5 h-3.5" />
                              <span>Edit eCRF</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 bg-surface-fog border border-dashed border-border-subtle text-center text-text-muted rounded-xl text-sm font-sohne">
                      No visits scheduled.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="steep-card p-12 text-center text-text-muted font-sohne text-sm flex items-center justify-center min-h-[400px]">
              Select a participant from the table to inspect their case record.
            </div>
          )}
        </div>
      </div>

      {/* ENROLL SUBJECT MODAL */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="steep-card max-w-lg w-full bg-background shadow-steep-subtle-2 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
              <h3 className="font-signifier font-medium text-2xl text-text-primary">
                Enroll Trial Participant
              </h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-6 font-sohne text-sm">
              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Target Protocol</label>
                <select
                  value={enrollTrialId}
                  onChange={(e) => setEnrollTrialId(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                >
                  {trials.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.protocolNumber} — {t.studyTitle.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Screening ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SCR-AIIA-009"
                    value={screeningId}
                    onChange={(e) => setScreeningId(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Subject Initials *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A.K.V."
                    value={subjectInitials}
                    onChange={(e) => setSubjectInitials(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Age *</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="90"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Gender *</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Assigned Study Arm</label>
                <input
                  type="text"
                  value={assignedArm}
                  onChange={(e) => setAssignedArm(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                />
              </div>

              {/* Prakriti Intake Sliders */}
              <div className="p-5 bg-surface-fog rounded-cards border border-border-subtle space-y-4">
                <span className="text-sm font-medium text-text-primary block">
                  Baseline Deha Prakriti Assessment
                </span>

                <div>
                  <div className="flex justify-between text-xs text-text-muted mb-2">
                    <span>Vata: {vata}%</span>
                    <span>Pitta: {pitta}%</span>
                    <span>Kapha: {kapha}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={vata}
                    onChange={(e) => setVata(Number(e.target.value))}
                    className="w-full accent-text-primary cursor-pointer"
                  />
                </div>
                <div className="text-sm text-text-primary font-medium">
                  Computed Type: {getDominantPrakriti(vata, pitta, kapha)}
                </div>
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="steep-pill-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEnrolling}
                  className="steep-pill-filled"
                >
                  {isEnrolling ? "Enrolling..." : "Complete Enrollment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT eCRF MODAL WITH MANDATORY REASON FOR CHANGE (GCP 21 CFR PART 11) */}
      {showEcrfEditModal && activeEditingVisit && (
        <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="steep-card max-w-lg w-full bg-background shadow-steep-subtle-2 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-6">
              <div>
                <span className="text-xs text-text-primary border border-border-subtle bg-surface-fog px-2 py-0.5 rounded-full font-medium uppercase tracking-wider block font-sohne w-max mb-2">
                  21 CFR PART 11 AUDITED FORM
                </span>
                <h3 className="font-signifier font-medium text-2xl text-text-primary">
                  Update {activeEditingVisit.visitName}
                </h3>
              </div>
              <button
                onClick={() => setShowEcrfEditModal(false)}
                className="text-text-muted hover:text-text-primary transition-colors text-xl"
              >
                ✕
              </button>
            </div>

            {ecrfError && (
              <div className="mb-6 p-4 rounded-cards bg-surface-accent border border-sienna/10 text-sienna text-sm font-sohne">
                {ecrfError}
              </div>
            )}

            <form onSubmit={handleUpdateVisit} className="space-y-6 font-sohne text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 120/80"
                    value={editBp}
                    onChange={(e) => setEditBp(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Pulse Rate (bpm)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 74"
                    value={editPulse}
                    onChange={(e) => setEditPulse(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Nadi Rhythm (Pulse Type)</label>
                  <select
                    value={editNadi}
                    onChange={(e) => setEditNadi(e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  >
                    <option value="Samanya">Samanya (Normal)</option>
                    <option value="Sarpa Gati (Vata)">Sarpa Gati (Vata / Serpentine)</option>
                    <option value="Manduka Gati (Pitta)">Manduka Gati (Pitta / Froglike)</option>
                    <option value="Hamsa Gati (Kapha)">Hamsa Gati (Kapha / Swanlike)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted uppercase text-xs mb-1.5 font-medium tracking-wide">Pitta Severity (0-10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={editPittaIndex}
                    onChange={(e) => setEditPittaIndex(Number(e.target.value))}
                    className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary"
                  />
                </div>
              </div>

              {/* MANDATORY 21 CFR 11 REASON FOR CHANGE */}
              <div className="p-5 bg-surface-fog rounded-cards border border-border-subtle space-y-3">
                <div className="flex items-center gap-2 text-text-primary font-medium text-sm">
                  <Lock className="w-4 h-4" />
                  <span>Mandatory Reason for Change (21 CFR § 11.10e)</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  This amendment will be immutably recorded in the cryptographic audit trail with your digital role signature.
                </p>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain why this eCRF data point is being altered (e.g. 'Transcription error from source paper sheet')..."
                  value={reasonForChange}
                  onChange={(e) => setReasonForChange(e.target.value)}
                  className="w-full bg-background border border-border-subtle rounded-inputs py-2.5 px-3 text-text-primary focus:outline-none focus:border-text-secondary mt-2"
                />
              </div>

              <div className="pt-6 flex items-center justify-end gap-3 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={() => setShowEcrfEditModal(false)}
                  className="steep-pill-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingVisit}
                  className="steep-pill-filled"
                >
                  {isUpdatingVisit ? "Signing & Storing..." : "Sign & Append Change"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
