"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  Download,
  Code2,
  Layers,
  Database,
  Share2,
} from "lucide-react";
import { RoleType } from "../layout/Header";

interface InteroperabilityViewProps {
  trials: any[];
  currentRole: RoleType;
}

export const InteroperabilityView: React.FC<InteroperabilityViewProps> = ({
  trials,
  currentRole,
}) => {
  const [selectedTrialId, setSelectedTrialId] = useState(trials[0]?.id || "");
  const [activeFormat, setActiveFormat] = useState<"fhir" | "cdisc-odm" | "sdtm-dm" | "sdtm-ae">("fhir");
  const [previewContent, setPreviewContent] = useState<string>("");
  const [loadingPreview, setLoadingPreview] = useState(false);

  const fetchPreview = async (format: string, trialId: string) => {
    setLoadingPreview(true);
    try {
      const res = await fetch(`/api/export?type=${format}&trialId=${trialId}`);
      const text = await res.text();
      setPreviewContent(text);
    } catch (e) {
      setPreviewContent("Error loading preview.");
    } finally {
      setLoadingPreview(false);
    }
  };

  React.useEffect(() => {
    if (selectedTrialId) {
      fetchPreview(activeFormat, selectedTrialId);
    }
  }, [selectedTrialId, activeFormat]);

  const handleDownload = (format: string) => {
    window.open(`/api/export?type=${format}&trialId=${selectedTrialId}`, "_blank");
  };

  return (
    <div className="space-y-10 animate-fade-in-up pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>HL7 FHIR &amp; CDISC SDTM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-signifier font-normal text-text-primary tracking-heading leading-heading-sm">
            Regulatory Interoperability
          </h1>
          <p className="text-body text-text-secondary font-sohne max-w-2xl">
            Standardized data exchange: HL7 FHIR R4 resources mapped with Ayush NAMASTE terminology, plus CDISC ODM and SDTM datasets.
          </p>
        </div>

        {/* Trial Selector */}
        <div className="flex items-center gap-3 bg-surface-fog border border-border-subtle rounded-inputs px-4 py-2.5 shadow-steep-subtle self-start sm:self-auto shrink-0">
          <span className="text-text-muted text-xs font-medium uppercase tracking-widest">STUDY</span>
          <select
            value={selectedTrialId}
            onChange={(e) => setSelectedTrialId(e.target.value)}
            className="bg-transparent font-medium text-text-primary focus:outline-none cursor-pointer text-sm font-sohne"
          >
            {trials.map((t) => (
              <option key={t.id} value={t.id} className="bg-background text-text-primary">
                {t.protocolNumber}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Export Format Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Format 1: FHIR R4 */}
        <div
          onClick={() => setActiveFormat("fhir")}
          className={`steep-card p-6 cursor-pointer transition-all ${
            activeFormat === "fhir"
              ? "border-text-primary bg-background shadow-steep-subtle-2"
              : "border-border-subtle bg-background hover:bg-surface-fog"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-sohne font-medium px-2.5 py-1 rounded-md border ${activeFormat === "fhir" ? "bg-surface-accent border-sienna/20 text-sienna" : "bg-surface-fog border-border-subtle text-text-secondary"}`}>
              HL7 FHIR R4
            </span>
            <div className={`p-2 rounded-lg border ${activeFormat === "fhir" ? "bg-background border-border-subtle text-text-primary" : "bg-surface-fog border-border-subtle text-text-muted"}`}>
              <Code2 className="w-4 h-4" />
            </div>
          </div>
          <h4 className="font-signifier font-medium text-xl text-text-primary mt-6">FHIR R4 Bundle</h4>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed font-sohne">
            ResearchStudy, ResearchSubject, Observation (NAMASTE portal Ayush codes).
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload("fhir");
            }}
            className="mt-6 steep-text-link text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Download JSON</span>
          </button>
        </div>

        {/* Format 2: CDISC ODM */}
        <div
          onClick={() => setActiveFormat("cdisc-odm")}
          className={`steep-card p-6 cursor-pointer transition-all ${
            activeFormat === "cdisc-odm"
              ? "border-text-primary bg-background shadow-steep-subtle-2"
              : "border-border-subtle bg-background hover:bg-surface-fog"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-sohne font-medium px-2.5 py-1 rounded-md border ${activeFormat === "cdisc-odm" ? "bg-surface-accent border-sienna/20 text-sienna" : "bg-surface-fog border-border-subtle text-text-secondary"}`}>
              CDISC ODM v1.3.2
            </span>
            <div className={`p-2 rounded-lg border ${activeFormat === "cdisc-odm" ? "bg-background border-border-subtle text-text-primary" : "bg-surface-fog border-border-subtle text-text-muted"}`}>
              <FileSpreadsheet className="w-4 h-4" />
            </div>
          </div>
          <h4 className="font-signifier font-medium text-xl text-text-primary mt-6">CDISC ODM XML</h4>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed font-sohne">
            Operational Data Model XML snapshot formatted for regulatory dossier archives.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload("cdisc-odm");
            }}
            className="mt-6 steep-text-link text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Download XML</span>
          </button>
        </div>

        {/* Format 3: SDTM DM */}
        <div
          onClick={() => setActiveFormat("sdtm-dm")}
          className={`steep-card p-6 cursor-pointer transition-all ${
            activeFormat === "sdtm-dm"
              ? "border-text-primary bg-background shadow-steep-subtle-2"
              : "border-border-subtle bg-background hover:bg-surface-fog"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-sohne font-medium px-2.5 py-1 rounded-md border ${activeFormat === "sdtm-dm" ? "bg-surface-accent border-sienna/20 text-sienna" : "bg-surface-fog border-border-subtle text-text-secondary"}`}>
              SDTM v1.7
            </span>
            <div className={`p-2 rounded-lg border ${activeFormat === "sdtm-dm" ? "bg-background border-border-subtle text-text-primary" : "bg-surface-fog border-border-subtle text-text-muted"}`}>
              <Database className="w-4 h-4" />
            </div>
          </div>
          <h4 className="font-signifier font-medium text-xl text-text-primary mt-6">Demographics (DM)</h4>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed font-sohne">
            Tabular SDTM dataset including Ayush dominant Prakriti annotations.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload("sdtm-dm");
            }}
            className="mt-6 steep-text-link text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

        {/* Format 4: SDTM AE */}
        <div
          onClick={() => setActiveFormat("sdtm-ae")}
          className={`steep-card p-6 cursor-pointer transition-all ${
            activeFormat === "sdtm-ae"
              ? "border-text-primary bg-background shadow-steep-subtle-2"
              : "border-border-subtle bg-background hover:bg-surface-fog"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-xs font-sohne font-medium px-2.5 py-1 rounded-md border ${activeFormat === "sdtm-ae" ? "bg-surface-accent border-sienna/20 text-sienna" : "bg-surface-fog border-border-subtle text-text-secondary"}`}>
              SDTM v1.7
            </span>
            <div className={`p-2 rounded-lg border ${activeFormat === "sdtm-ae" ? "bg-background border-border-subtle text-text-primary" : "bg-surface-fog border-border-subtle text-text-muted"}`}>
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h4 className="font-signifier font-medium text-xl text-text-primary mt-6">Adverse Events (AE)</h4>
          <p className="text-sm text-text-secondary mt-2 leading-relaxed font-sohne">
            MedDRA-coded adverse drug reactions and WHO-UMC causality assessments.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownload("sdtm-ae");
            }}
            className="mt-6 steep-text-link text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>

      {/* Live Data Payload Viewer */}
      <div className="steep-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-6">
          <div>
            <h3 className="font-signifier font-medium text-2xl text-text-primary">
              Live Payload Preview: {activeFormat.toUpperCase()}
            </h3>
            <p className="text-sm text-text-secondary font-sohne mt-1">
              Generated dynamically from active trial models &amp; Ayush terminology tables.
            </p>
          </div>

          <button
            onClick={() => handleDownload(activeFormat)}
            className="steep-pill-filled"
          >
            <Download className="w-4 h-4" />
            <span>Download Full File</span>
          </button>
        </div>

        <div className="relative">
          {loadingPreview ? (
            <div className="p-16 text-center text-text-muted font-sohne flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-text-muted border-t-transparent rounded-full animate-spin"></div>
              <span>Generating regulatory payload...</span>
            </div>
          ) : (
            <pre className="p-6 bg-surface-fog text-text-primary rounded-cards overflow-x-auto text-xs max-h-[500px] leading-relaxed font-mono border border-border-subtle">
              {previewContent}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
};
