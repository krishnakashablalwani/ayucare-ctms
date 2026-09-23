/**
 * CDISC ODM (XML) and SDTM (Tabular CSV) Exporter
 * Aligned with CDISC standards (CDASH, SDTM v1.7, ODM v1.3.2)
 */

export function generateCdiscOdmXml(trial: any, subjects: any[], adverseEvents: any[]) {
  const timestamp = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<ODM xmlns="http://www.cdisc.org/ns/odm/v1.3"
     xmlns:xs="http://www.w3.org/2001/XMLSchema"
     xmlns:aiia="https://aiia.gov.in/cdisc/extensions"
     FileType="Snapshot"
     FileOID="ODM.AIIA.${trial.protocolNumber}.${Date.now()}"
     CreationDateTime="${timestamp}"
     ODMVersion="1.3.2">
  <Study OID="STUDY.${trial.protocolNumber}">
    <GlobalVariables>
      <StudyName>${escapeXml(trial.studyTitle)}</StudyName>
      <StudyDescription>AyuCare-CTMS (All India Institute of Ayurveda) Study Record - CTRI ID: ${trial.ctriId}</StudyDescription>
      <ProtocolName>${trial.protocolNumber}</ProtocolName>
    </GlobalVariables>
    <MetaDataVersion OID="MDV.${trial.protocolNumber}.001" Name="AIIA Metadata v1">
      <Protocol>
        <StudyEventRef StudyEventOID="SE.BASELINE" OrderNumber="1" Mandatory="Yes"/>
        <StudyEventRef StudyEventOID="SE.DAY7" OrderNumber="2" Mandatory="Yes"/>
        <StudyEventRef StudyEventOID="SE.DAY14" OrderNumber="3" Mandatory="Yes"/>
        <StudyEventRef StudyEventOID="SE.DAY28" OrderNumber="4" Mandatory="Yes"/>
        <StudyEventRef StudyEventOID="SE.ENDPOINT" OrderNumber="5" Mandatory="Yes"/>
      </Protocol>
    </MetaDataVersion>
  </Study>
  <ClinicalData StudyOID="STUDY.${trial.protocolNumber}" MetaDataVersionOID="MDV.${trial.protocolNumber}.001">
`;

  subjects.forEach((subj) => {
    xml += `    <SubjectData SubjectKey="${subj.screeningId}" aiia:RandomizationID="${subj.randomizationId || "NA"}">
      <SiteRef LocationOID="SITE.AIIA.DELHI"/>
`;

    if (subj.visits && subj.visits.length > 0) {
      subj.visits.forEach((v: any, idx: number) => {
        xml += `      <StudyEventData StudyEventOID="SE.VISIT${v.visitNumber}">
        <FormData FormOID="FORM.AIIA.ECRF">
          <ItemGroupData ItemGroupOID="IG.DOSHA">
            <ItemData ItemOID="IT.VISIT_STATUS" Value="${v.status}"/>
            <ItemData ItemOID="IT.SDV_STATUS" Value="${v.sdvStatus}"/>
          </ItemGroupData>
        </FormData>
      </StudyEventData>
`;
      });
    }

    xml += `    </SubjectData>
`;
  });

  xml += `  </ClinicalData>
</ODM>`;

  return xml;
}

export function generateSdtmDemographicsCsv(trial: any, subjects: any[]) {
  const headers = [
    "STUDYID",
    "DOMAIN",
    "USUBJID",
    "SUBJID",
    "RFSTDTC",
    "AGE",
    "AGEU",
    "SEX",
    "ARMCD",
    "ARM",
    "ACTARM",
    "COUNTRY",
    "AYU_PRAKRITI_DOMINANT",
  ];

  const rows = subjects.map((subj) => {
    let dominantPrakriti = "NA";
    try {
      const p = typeof subj.baselinePrakriti === "string" ? JSON.parse(subj.baselinePrakriti) : subj.baselinePrakriti;
      dominantPrakriti = p.primary || "NA";
    } catch {}

    return [
      trial.protocolNumber,
      "DM",
      `AIIA-${trial.protocolNumber}-${subj.screeningId}`,
      subj.screeningId,
      subj.enrollmentDate,
      subj.age,
      "YEARS",
      subj.gender === "Male" ? "M" : subj.gender === "Female" ? "F" : "O",
      subj.assignedArm.includes("Placebo") ? "PBO" : "ACT",
      `"${subj.assignedArm}"`,
      `"${subj.assignedArm}"`,
      "IND",
      `"${dominantPrakriti}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

export function generateSdtmAdverseEventsCsv(trial: any, adverseEvents: any[]) {
  const headers = [
    "STUDYID",
    "DOMAIN",
    "USUBJID",
    "AESEQ",
    "AETERM",
    "AEDECOD",
    "AEPTCD",
    "AESTDTC",
    "AESEV",
    "AESER",
    "AEREL",
    "AEOUT",
    "AETOXGR",
  ];

  const rows = adverseEvents.map((ae, index) => {
    return [
      trial.protocolNumber,
      "AE",
      `AIIA-${trial.protocolNumber}-${ae.subject?.screeningId || "SUBJ"}`,
      index + 1,
      `"${ae.eventTerm}"`,
      `"${ae.medDraTerm}"`,
      ae.medDraCode,
      ae.onsetDate,
      ae.severity.toUpperCase(),
      ae.isSeriousnessSae ? "Y" : "N",
      `"${ae.causalityAyushDrug}"`,
      `"${ae.outcome}"`,
      ae.ctcaeGrade,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<": return "&lt;";
      case ">": return "&gt;";
      case "&": return "&amp;";
      case "'": return "&apos;";
      case '"': return "&quot;";
      default: return c;
    }
  });
}
