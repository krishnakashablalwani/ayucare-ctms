    # System Architecture & Engineering Blueprint: SIH26046

**Document Target:** Google Antigravity IDE / Engineering Workspace

**System Scope:** SIH26046 (AIIA Real-Time, Cloud-Based, GCP-Compliant CTMS & Clinical Trials Dashboard)

**Standard Compliance:** GCP (Good Clinical Practice), 21 CFR Part 11, CDISC ODM/SDTM, HL7 FHIR v4, NDCT Rules 2019, CTRI

---

## 1. Executive Summary & System Scope

The objective is to establish an enterprise-grade **Clinical Trial Management System (CTMS)** and **Electronic Data Capture (EDC)** platform under **SIH26046**.

* **Architectural Synergy:** The core patient intake, Prakriti scoring, and symptom evaluation workflows form the foundational **Electronic Case Report Form (eCRF)** capture layer of SIH26046.
* **Scope Extension:** Multi-tenant, role-gated, audit-trailed clinical trials platform with real-time KPI orchestration for the All India Institute of Ayurveda (AIIA).

---

## 2. Component Architecture Matrix

| Architectural Layer | Core Intake Baseline | SIH26046 (Target CTMS Scope) | Implementation Action |
| --- | --- | --- | --- |
| **Data Ingestion** | Patient Case Sheets, Subjective Intake, Dosha/Prakriti forms | Dynamic eCRFs, Multi-Visit Scheduling, Baseline & Follow-Up visit validation | **Refactor & Extend:** Re-anchor case sheets to protocol visit schedules. |
| **Data Normalization** | Proprietary Ayush terminology / Custom JSON | **HL7 FHIR v4** (`ResearchStudy`, `ResearchSubject`, `Observation`), **CDISC ODM/SDTM** | **New Feature:** Implement FHIR serializer & CDISC mapping pipeline. |
| **Security & Auditing** | Standard CRUD, basic session logging | **21 CFR Part 11 & GCP Audit Trails:** Cryptographic append-only logs, dual-factor e-signatures | **New Feature:** Implement immutable DB triggers and non-repudiation logging. |
| **Governance & Workflow** | Doctor/Patient dual-role interface | **Multi-Role RBAC:** Principal Investigator (PI), CRC, Site Monitor (CRA), Ethics Committee (EC), Auditor | **New Feature:** Implement role-based workspaces and permissions. |
| **Regulatory & Safety** | None / Static notes | **NDCT Rules 2019 / CTRI tracking**, Adverse Drug Reaction (ADR) detection, CIOMS/PvPI form generation | **New Feature:** Implement safety monitoring and trial governance engines. |
| **Visualization** | Individual patient clinical history | **AIIA Executive Dashboard:** Real-time enrollment funnels, query resolution metrics, protocol deviation KPIs | **New Feature:** Build aggregate clinical intelligence analytics. |

---

## 3. Database Schema Evolutions (PostgreSQL)

Antigravity should generate the following relational schemas to bridge current case-taking tables with trial management infrastructure.

```sql
-- 1. Clinical Trial Studies (CTRI & NDCT Context)
CREATE TABLE clinical_trials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ctri_registration_id VARCHAR(50) UNIQUE NOT NULL,
    study_protocol_number VARCHAR(100) UNIQUE NOT NULL,
    study_title TEXT NOT NULL,
    therapeutic_area VARCHAR(100) DEFAULT 'Ayurveda',
    phase VARCHAR(20) NOT NULL, -- Phase I, II, III, IV, or Observational
    ndct_approval_status VARCHAR(50) NOT NULL,
    ethics_committee_approval_date DATE,
    lead_institution VARCHAR(255) DEFAULT 'All India Institute of Ayurveda (AIIA)',
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Extended Trial Subjects (Mapped from Core Patient Entities)
CREATE TABLE trial_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trial_id UUID REFERENCES clinical_trials(id) ON DELETE CASCADE,
    subject_screening_id VARCHAR(50) NOT NULL,
    subject_randomization_id VARCHAR(50) UNIQUE,
    enrollment_date DATE NOT NULL,
    assigned_arm VARCHAR(100), -- Interventional / Comparative / Placebo
    current_status VARCHAR(50) DEFAULT 'Screened', -- Screened, Randomized, Completed, Withdrawn
    baseline_prakriti_profile JSONB, -- Baseline Prakriti Profile
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(trial_id, subject_screening_id)
);

-- 3. Dynamic eCRF & Visit Capture (Upgraded Case-Taking Sheets)
CREATE TABLE ecrf_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES trial_subjects(id) ON DELETE CASCADE,
    visit_number INT NOT NULL,
    visit_type VARCHAR(50) NOT NULL, -- Baseline, Day 7, Day 14, Day 28, Endpoint
    clinical_observations JSONB NOT NULL, -- Clinical observations parameters
    doshic_derangement_score JSONB,
    source_data_verified BOOLEAN DEFAULT FALSE,
    cra_signature_hash TEXT,
    created_by UUID NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. 21 CFR Part 11 Cryptographic Audit Trail
CREATE TABLE gcp_audit_trail (
    audit_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    operation VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    previous_value JSONB,
    new_value JSONB,
    modified_by UUID NOT NULL,
    modification_reason TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    record_signature_hash TEXT NOT NULL -- SHA-256 (prev_val + new_val + user + salt)
);

-- 5. Pharmacovigilance & Adverse Drug Reaction (ADR) Logs
CREATE TABLE trial_adverse_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES trial_subjects(id) ON DELETE CASCADE,
    event_term VARCHAR(255) NOT NULL,
    onset_date TIMESTAMPTZ NOT NULL,
    severity VARCHAR(50) NOT NULL, -- Mild, Moderate, Severe (CTCAE scale)
    seriousness_criteria VARCHAR(100), -- Hospitalization, Life-threatening, etc.
    causality_ayush_investigational_drug VARCHAR(50) NOT NULL, -- Definite, Probable, Possible, Unlikely
    action_taken TEXT NOT NULL,
    reported_to_ethics_committee BOOLEAN DEFAULT FALSE,
    reported_to_dcgi BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

```

---

## 4. Interoperability & Data Mapping Pipeline

Antigravity must establish an adapter layer transforming internal clinical snapshots into FHIR resources:

```
[Clinical Input Engine] 
         │ (JSON Case Records)
         ▼
[Ingestion & Normalization Layer]
         │ 
         ├──► Map Prakriti / Doshic Metrics ──► FHIR 'Observation' (SNOMED-CT / NAMASTE)
         ├──► Map Subject Identifiers        ──► FHIR 'ResearchSubject'
         ├──► Map Study Protocol             ──► FHIR 'ResearchStudy'
         └──► Map ADR Logs                   ──► FHIR 'AdverseEvent'
         │
         ▼
[Export Service] ──► CDISC ODM XML / SDTM Tabular Export for Regulatory Audits

```

### FHIR Observation Payload Example (Ayush Domain):

```json
{
  "resourceType": "Observation",
  "status": "final",
  "category": [
    {
      "coding": [
        {
          "system": "http://terminology.hl7.org/CodeSystem/observation-category",
          "code": "exam"
        }
      ]
    }
  ],
  "code": {
    "coding": [
      {
        "system": "https://namstp.ayush.gov.in/",
        "code": "AYU-OBS-014",
        "display": "Pitta Aggravation Index"
      }
    ]
  },
  "subject": {
    "reference": "ResearchSubject/SUBJ-2026-AIIA-042"
  },
  "effectiveDateTime": "2026-09-22T17:00:00+05:30",
  "valueQuantity": {
    "value": 7.4,
    "unit": "Score (1-10)",
    "system": "http://unitsofmeasure.org"
  }
}

```

---

## 5. Development Tasks & Antigravity Work Orders

### Phase 1: Core Foundation & Auth Refactor

1. **Directory Restructure:** Initialize `@ctms-core/` and deprecate direct case-sheet client submissions in favor of `@edc/ecrf-engine`.
2. **RBAC Implementation:** Configure 5-tier access boundaries:
* `ROLE_PI`: Protocol authorization, safety approvals, statistical review.
* `ROLE_CRC`: Patient onboarding, visit updates, case-sheet completion.
* `ROLE_MONITOR`: Verification (SDV), discrepancy flag raising.
* `ROLE_ETHICS`: Audit inspections, regulatory filings, trial freeze trigger.
* `ROLE_AUDITOR`: Read-only, cryptographic log verification.



### Phase 2: eCRF & Visit Workflow Adapter

1. Import existing UI form components.
2. Wrap forms in visit-lifecycle handlers (`visit_window_start`, `visit_window_end`, `visit_lock`).
3. Add form change-detection logic that prompts users for a **Mandatory Reason for Change** (GCP requirement) prior to executing any update.

### Phase 3: Safety & Pharmacovigilance Module

1. Build the adverse event intake form with CTCAE grading integrated with Ayurvedic symptom classification.
2. Implement automated notification pipelines for Serious Adverse Events (SAEs) enforcing 24-hour reporting protocols to the Ethics Committee.

### Phase 4: AIIA Real-Time KPI Dashboard

1. Deploy real-time aggregations (using Prisma / Supabase / standard SQL views):
* Recruitment targets vs. actual screenings.
* Query backlog and turnaround latency for Source Data Verification (SDV).
* Dropout rates categorized by trial arm.
* Safety escalation counter.



---

## 6. Verifiable Deliverable Checklist for Antigravity

* [ ] Existing case-taking forms refactored into modular, versioned eCRFs.
* [ ] Database migration scripts run with append-only audit trail triggers active.
* [ ] Role-based access control protecting routes under `/dashboard/pi`, `/dashboard/crc`, and `/dashboard/ec`.
* [ ] One-click export script generating CDISC ODM-compliant XML and JSON-based FHIR bundles.
* [ ] Interactive KPI dashboard deployed with live widgets for trial progress metrics.