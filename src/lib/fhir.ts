/**
 * HL7 FHIR R4 Serializer for AIIA Clinical Trials
 * Interoperable with Ayushman Bharat Digital Mission (ABDM) and standard Electronic Health Records.
 */

export interface FhirStudyPayload {
  trial: any;
  subjects: any[];
  adverseEvents: any[];
}

export function generateFhirR4Bundle({ trial, subjects, adverseEvents }: FhirStudyPayload) {
  const entries: any[] = [];

  // 1. ResearchStudy Resource
  entries.push({
    fullUrl: `urn:uuid:${trial.id}`,
    resource: {
      resourceType: "ResearchStudy",
      id: trial.id,
      identifier: [
        {
          use: "official",
          system: "https://ctri.nic.in",
          value: trial.ctriId,
        },
        {
          use: "secondary",
          system: "https://aiia.gov.in/protocols",
          value: trial.protocolNumber,
        },
      ],
      title: trial.studyTitle,
      status: trial.status.toLowerCase() === "recruiting" ? "active" : "completed",
      phase: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/research-study-phase",
            code: trial.trialPhase.toLowerCase().replace(" ", "-"),
            display: trial.trialPhase,
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system: "https://namstp.ayush.gov.in/",
              code: "AYUSH-CLINICAL-TRIAL",
              display: "Ayurveda Clinical Research Study",
            },
          ],
        },
      ],
      sponsor: {
        display: trial.leadInstitution,
      },
      principalInvestigator: {
        display: trial.principalInvestigator,
      },
    },
  });

  // 2. ResearchSubject & Observation Resources
  subjects.forEach((subj) => {
    const subjId = `ResearchSubject-${subj.id}`;
    entries.push({
      fullUrl: `urn:uuid:${subj.id}`,
      resource: {
        resourceType: "ResearchSubject",
        id: subj.id,
        identifier: [
          {
            system: "https://aiia.gov.in/subjects",
            value: subj.screeningId,
          },
          ...(subj.randomizationId
            ? [
                {
                  system: "https://aiia.gov.in/randomization",
                  value: subj.randomizationId,
                },
              ]
            : []),
        ],
        status: subj.status.toLowerCase(),
        study: {
          reference: `ResearchStudy/${trial.id}`,
          display: trial.studyTitle,
        },
        assignedArm: subj.assignedArm,
        actualArm: subj.assignedArm,
      },
    });

    // Parse Baseline Prakriti into FHIR Observations
    try {
      const prakriti = typeof subj.baselinePrakriti === "string" 
        ? JSON.parse(subj.baselinePrakriti) 
        : subj.baselinePrakriti;

      if (prakriti) {
        entries.push({
          fullUrl: `urn:uuid:${subj.id}-prakriti`,
          resource: {
            resourceType: "Observation",
            id: `${subj.id}-prakriti`,
            status: "final",
            category: [
              {
                coding: [
                  {
                    system: "http://terminology.hl7.org/CodeSystem/observation-category",
                    code: "exam",
                    display: "Exam",
                  },
                ],
              },
            ],
            code: {
              coding: [
                {
                  system: "https://namstp.ayush.gov.in/",
                  code: "AYU-OBS-PRAKRITI",
                  display: "Ayurvedic Deha Prakriti Assessment",
                },
              ],
            },
            subject: {
              reference: `ResearchSubject/${subj.id}`,
            },
            effectiveDateTime: subj.enrollmentDate,
            component: [
              {
                code: { text: "Vata Score" },
                valueQuantity: { value: prakriti.vata, unit: "%" },
              },
              {
                code: { text: "Pitta Score" },
                valueQuantity: { value: prakriti.pitta, unit: "%" },
              },
              {
                code: { text: "Kapha Score" },
                valueQuantity: { value: prakriti.kapha, unit: "%" },
              },
              {
                code: { text: "Dominant Prakriti" },
                valueString: prakriti.primary,
              },
            ],
          },
        });
      }
    } catch {
      // ignore JSON parse errors
    }

    // Visits Observation (Doshic derangement / Ashtavidha Pariksha)
    if (subj.visits && subj.visits.length > 0) {
      subj.visits.forEach((v: any) => {
        try {
          const obs = typeof v.clinicalObservations === "string" 
            ? JSON.parse(v.clinicalObservations) 
            : v.clinicalObservations;

          entries.push({
            fullUrl: `urn:uuid:${v.id}`,
            resource: {
              resourceType: "Observation",
              id: v.id,
              status: v.status.toLowerCase() === "completed" ? "final" : "registered",
              code: {
                coding: [
                  {
                    system: "https://namstp.ayush.gov.in/",
                    code: "AYU-OBS-VISIT-EVAL",
                    display: `AIIA Clinical Evaluation - ${v.visitName}`,
                  },
                ],
              },
              subject: {
                reference: `ResearchSubject/${subj.id}`,
              },
              effectiveDateTime: v.completedDate || v.scheduledDate,
              note: [
                {
                  text: `SDV Status: ${v.sdvStatus}; Verified by: ${v.sdvSignedBy || "None"}`,
                },
              ],
              component: [
                {
                  code: { text: "Nadi Pariksha" },
                  valueString: obs.nadi || "Samanya (Normal)",
                },
                {
                  code: { text: "Agni Status" },
                  valueString: obs.agni || "Sama Agni",
                },
                {
                  code: { text: "Pitta Aggravation Index" },
                  valueQuantity: {
                    value: obs.pittaIndex || 5.0,
                    unit: "Scale (1-10)",
                    system: "http://unitsofmeasure.org",
                  },
                },
              ],
            },
          });
        } catch {
          // ignore
        }
      });
    }
  });

  // 3. Adverse Events Resources
  adverseEvents.forEach((ae) => {
    entries.push({
      fullUrl: `urn:uuid:${ae.id}`,
      resource: {
        resourceType: "AdverseEvent",
        id: ae.id,
        actuality: "actual",
        category: [
          {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/adverse-event-category",
                code: "product-use-error",
                display: "Adverse Drug Reaction",
              },
            ],
          },
        ],
        event: {
          coding: [
            {
              system: "https://www.meddra.org",
              code: ae.medDraCode,
              display: ae.medDraTerm,
            },
          ],
          text: ae.eventTerm,
        },
        subject: {
          reference: `ResearchSubject/${ae.subjectId}`,
        },
        date: ae.onsetDate,
        seriousness: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/adverse-event-seriousness",
              code: ae.isSeriousnessSae ? "Serious" : "Non-serious",
              display: ae.seriousnessCriteria || "Non-serious Event",
            },
          ],
        },
        severity: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/adverse-event-severity",
              code: `grade-${ae.ctcaeGrade}`,
              display: `CTCAE Grade ${ae.ctcaeGrade} (${ae.severity})`,
            },
          ],
        },
        causality: [
          {
            assessment: {
              text: `WHO-UMC Causality: ${ae.causalityAyushDrug}`,
            },
            productRelatedness: ae.causalityAyushDrug,
          },
        ],
      },
    });
  });

  return {
    resourceType: "Bundle",
    id: `AyuCare-CTMS-${trial.ctriId.replace(/\//g, "-")}`,
    type: "collection",
    timestamp: new Date().toISOString(),
    total: entries.length,
    entry: entries,
  };
}
