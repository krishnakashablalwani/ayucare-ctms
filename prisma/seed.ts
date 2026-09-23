import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning existing database...");
  await prisma.auditLog.deleteMany();
  await prisma.monitoringQuery.deleteMany();
  await prisma.adverseEvent.deleteMany();
  await prisma.ecrfVisit.deleteMany();
  await prisma.trialSubject.deleteMany();
  await prisma.clinicalTrial.deleteMany();

  console.log("Seeding AIIA Clinical Trials...");

  // 1. Ashwagandha Cognitive Trial
  const trial1 = await prisma.clinicalTrial.create({
    data: {
      ctriId: "CTRI/2024/03/064210",
      protocolNumber: "AIIA-NEURO-2024-01",
      studyTitle: "A Randomized, Double-Blind, Placebo-Controlled Trial of Withania Somnifera (Ashwagandha) Extract in Mild Cognitive Impairment",
      therapeuticArea: "Ayurveda - Manasa Roga / Neurology",
      trialPhase: "Phase II",
      ndctStatus: "Approved by CDSCO / CTRI Registered",
      ethicsApprovalDate: "2024-02-15",
      leadInstitution: "All India Institute of Ayurveda (AIIA), New Delhi",
      principalInvestigator: "Prof. (Dr.) Tanuja Nesari, MD (Ayu), PhD",
      targetEnrollment: 120,
      currentEnrollment: 84,
      status: "Recruiting",
    },
  });

  // 2. Curcumin-Boswellia Osteoarthritis Trial
  const trial2 = await prisma.clinicalTrial.create({
    data: {
      ctriId: "CTRI/2023/11/059844",
      protocolNumber: "AIIA-ORTHO-2023-04",
      studyTitle: "Multi-centre Active-Controlled Phase III Trial Evaluating Standardized Curcumin-Boswellia Serrata Formulation vs Celecoxib in Knee Sandhigatavata (Osteoarthritis)",
      therapeuticArea: "Ayurveda - Sandhigata Vata / Rheumatology",
      trialPhase: "Phase III",
      ndctStatus: "Approved by CDSCO / CTRI Registered",
      ethicsApprovalDate: "2023-10-10",
      leadInstitution: "All India Institute of Ayurveda (AIIA), New Delhi",
      principalInvestigator: "Dr. Anand More, MD (Ayu)",
      targetEnrollment: 250,
      currentEnrollment: 198,
      status: "Recruiting",
    },
  });

  // 3. Ayush-64 Hepatic Steatosis Trial
  const trial3 = await prisma.clinicalTrial.create({
    data: {
      ctriId: "CTRI/2024/01/061208",
      protocolNumber: "AIIA-METAB-2024-02",
      studyTitle: "Clinical Evaluation of Ayush-64 Formulation on Metabolic Biomarkers and Hepatic Steatosis (Yakrit Roga): A Multicenter Randomized Study",
      therapeuticArea: "Ayurveda - Yakrit & Medoroga / Hepatology",
      trialPhase: "Phase II",
      ndctStatus: "Approved by CDSCO / CTRI Registered",
      ethicsApprovalDate: "2024-01-05",
      leadInstitution: "All India Institute of Ayurveda (AIIA), New Delhi",
      principalInvestigator: "Dr. Rama Kant Sharma, MD (Ayu)",
      targetEnrollment: 80,
      currentEnrollment: 62,
      status: "Recruiting",
    },
  });

  console.log("Seeding Subjects for Trial 1 (Ashwagandha)...");

  const subject1 = await prisma.trialSubject.create({
    data: {
      trialId: trial1.id,
      screeningId: "SCR-AIIA-001",
      randomizationId: "RND-ASH-001",
      subjectInitials: "R.K.S.",
      age: 62,
      gender: "Male",
      assignedArm: "Withania Somnifera Extract 500mg BID",
      status: "Active",
      enrollmentDate: "2024-04-10",
      baselinePrakriti: JSON.stringify({
        vata: 55,
        pitta: 30,
        kapha: 15,
        primary: "Vata-Pitta",
        characteristics: "Vishama Agni, Krura Koshtha, Alpa Nidra",
      }),
      doshicDerangement: JSON.stringify({ vata: 8, pitta: 4, kapha: 2 }),
      informedConsentDate: "2024-04-08",
      informedConsentVerified: true,
    },
  });

  const subject2 = await prisma.trialSubject.create({
    data: {
      trialId: trial1.id,
      screeningId: "SCR-AIIA-002",
      randomizationId: "RND-ASH-002",
      subjectInitials: "M.D.V.",
      age: 58,
      gender: "Female",
      assignedArm: "Matching Placebo Capsule BID",
      status: "Active",
      enrollmentDate: "2024-04-12",
      baselinePrakriti: JSON.stringify({
        vata: 25,
        pitta: 50,
        kapha: 25,
        primary: "Pitta-Kapha",
        characteristics: "Tikshna Agni, Madhyama Koshtha",
      }),
      doshicDerangement: JSON.stringify({ vata: 4, pitta: 7, kapha: 3 }),
      informedConsentDate: "2024-04-10",
      informedConsentVerified: true,
    },
  });

  const subject3 = await prisma.trialSubject.create({
    data: {
      trialId: trial1.id,
      screeningId: "SCR-AIIA-003",
      randomizationId: "RND-ASH-003",
      subjectInitials: "P.L.G.",
      age: 67,
      gender: "Male",
      assignedArm: "Withania Somnifera Extract 500mg BID",
      status: "Active",
      enrollmentDate: "2024-04-15",
      baselinePrakriti: JSON.stringify({
        vata: 45,
        pitta: 40,
        kapha: 15,
        primary: "Vata-Pitta",
        characteristics: "Smriti Bhramsha, Chanchala Chitta",
      }),
      doshicDerangement: JSON.stringify({ vata: 7, pitta: 5, kapha: 2 }),
      informedConsentDate: "2024-04-14",
      informedConsentVerified: true,
    },
  });

  const subject4 = await prisma.trialSubject.create({
    data: {
      trialId: trial2.id,
      screeningId: "SCR-AIIA-101",
      randomizationId: "RND-CUR-045",
      subjectInitials: "S.B.N.",
      age: 54,
      gender: "Female",
      assignedArm: "Curcumin-Boswellia Complex 400mg TID",
      status: "Active",
      enrollmentDate: "2024-03-01",
      baselinePrakriti: JSON.stringify({
        vata: 60,
        pitta: 20,
        kapha: 20,
        primary: "Vata Pradhana",
        characteristics: "Sandhi Shoola, Stabdhata",
      }),
      doshicDerangement: JSON.stringify({ vata: 9, pitta: 3, kapha: 4 }),
      informedConsentDate: "2024-02-28",
      informedConsentVerified: true,
    },
  });

  const subject5 = await prisma.trialSubject.create({
    data: {
      trialId: trial3.id,
      screeningId: "SCR-AIIA-201",
      randomizationId: "RND-AYU-012",
      subjectInitials: "V.P.K.",
      age: 49,
      gender: "Male",
      assignedArm: "Ayush-64 Standard Tablet 500mg BID",
      status: "Active",
      enrollmentDate: "2024-05-02",
      baselinePrakriti: JSON.stringify({
        vata: 20,
        pitta: 45,
        kapha: 35,
        primary: "Pitta-Kapha",
        characteristics: "Medo Dhatvagni Mandya",
      }),
      doshicDerangement: JSON.stringify({ vata: 3, pitta: 8, kapha: 7 }),
      informedConsentDate: "2024-05-01",
      informedConsentVerified: true,
    },
  });

  console.log("Seeding eCRF Visits...");

  // Visits for Subject 1
  await prisma.ecrfVisit.create({
    data: {
      subjectId: subject1.id,
      visitNumber: 1,
      visitName: "Visit 1 (Day 0 - Baseline)",
      scheduledDate: "2024-04-10",
      completedDate: "2024-04-10",
      status: "Completed",
      clinicalObservations: JSON.stringify({
        nadi: "Vata-Pitta Mandyam",
        mutra: "Prakrita (Normal)",
        jihwa: "Nirama (Clear)",
        sparsha: "Ruksha (Dry)",
        bloodPressure: "128/82 mmHg",
        pulse: "74 bpm",
        mmseScore: 23,
        pittaIndex: 4.5,
      }),
      sdvStatus: "Verified",
      sdvSignedBy: "Dr. Ananya Mishra (CRA)",
      sdvSignedAt: new Date("2024-04-12T11:30:00Z"),
      craSignatureHash: "cra_sig_hash_8a92f001b",
    },
  });

  await prisma.ecrfVisit.create({
    data: {
      subjectId: subject1.id,
      visitNumber: 2,
      visitName: "Visit 2 (Day 14 Assessment)",
      scheduledDate: "2024-04-24",
      completedDate: "2024-04-24",
      status: "Completed",
      clinicalObservations: JSON.stringify({
        nadi: "Sama Vata",
        mutra: "Prakrita",
        jihwa: "Nirama",
        sparsha: "Snigdha",
        bloodPressure: "124/80 mmHg",
        pulse: "72 bpm",
        mmseScore: 25,
        pittaIndex: 4.0,
      }),
      sdvStatus: "Verified",
      sdvSignedBy: "Dr. Ananya Mishra (CRA)",
      sdvSignedAt: new Date("2024-04-26T14:15:00Z"),
      craSignatureHash: "cra_sig_hash_99c3a104",
    },
  });

  await prisma.ecrfVisit.create({
    data: {
      subjectId: subject1.id,
      visitNumber: 3,
      visitName: "Visit 3 (Day 28 Midpoint)",
      scheduledDate: "2024-05-08",
      completedDate: "2024-05-08",
      status: "Completed",
      clinicalObservations: JSON.stringify({
        nadi: "Prasanna",
        bloodPressure: "120/78 mmHg",
        pulse: "70 bpm",
        mmseScore: 27,
        pittaIndex: 3.5,
      }),
      sdvStatus: "Pending",
    },
  });

  await prisma.ecrfVisit.create({
    data: {
      subjectId: subject1.id,
      visitNumber: 4,
      visitName: "Visit 4 (Day 56 Endpoint)",
      scheduledDate: "2024-06-05",
      status: "Scheduled",
      clinicalObservations: JSON.stringify({}),
      sdvStatus: "Pending",
    },
  });

  // Visits for Subject 5 (Trial 3)
  await prisma.ecrfVisit.create({
    data: {
      subjectId: subject5.id,
      visitNumber: 1,
      visitName: "Visit 1 (Baseline)",
      scheduledDate: "2024-05-02",
      completedDate: "2024-05-02",
      status: "Completed",
      clinicalObservations: JSON.stringify({
        nadi: "Pitta-Kapha Tivra",
        alt: "84 IU/L",
        ast: "68 IU/L",
        lipidProfile: "Total Chol: 242 mg/dL",
        pittaIndex: 8.2,
      }),
      sdvStatus: "Verified",
      sdvSignedBy: "Dr. Ananya Mishra (CRA)",
      sdvSignedAt: new Date("2024-05-04T10:00:00Z"),
    },
  });

  console.log("Seeding Adverse Events & NPvCC Safety Records...");

  // Serious Adverse Event (SAE) with 24-hr regulatory countdown active!
  const now = new Date();
  const deadline = new Date(now.getTime() + 18 * 60 * 60 * 1000); // 18 hours remaining for demo!

  await prisma.adverseEvent.create({
    data: {
      subjectId: subject5.id,
      eventTerm: "Acute Transaminitis / Yakrit Pitta Vriddhi (ALT 420 IU/L)",
      medDraCode: "10020146",
      medDraTerm: "Hepatic enzyme increased",
      whoDrugCode: "WDU-AYU-6401 Ayush-64",
      onsetDate: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString().split("T")[0],
      severity: "Severe",
      ctcaeGrade: 3,
      isSeriousnessSae: true,
      seriousnessCriteria: "Required Inpatient Hospitalization",
      causalityAyushDrug: "Probable",
      actionTaken: "Drug Withdrawn & Hepatoprotective Therapy Initiated",
      outcome: "Recovering",
      reportedToEthics: false,
      reportedToDcgi: false,
      regulatoryDeadline24h: deadline,
    },
  });

  // Non-serious Adverse Event
  await prisma.adverseEvent.create({
    data: {
      subjectId: subject2.id,
      eventTerm: "Mild Epigastric Discomfort / Udarashoola",
      medDraCode: "10017947",
      medDraTerm: "Gastric disorder",
      whoDrugCode: "WDU-AYU-8821 Withania / Placebo",
      onsetDate: "2024-04-20",
      severity: "Mild",
      ctcaeGrade: 1,
      isSeriousnessSae: false,
      seriousnessCriteria: "None",
      causalityAyushDrug: "Possible",
      actionTaken: "Dose timing adjusted post-meal",
      outcome: "Recovered",
      reportedToEthics: true,
      reportedToDcgi: false,
      regulatoryDeadline24h: new Date("2024-04-21T18:00:00Z"),
      reportedAt: new Date("2024-04-21T09:30:00Z"),
    },
  });

  console.log("Seeding Monitoring Queries...");

  await prisma.monitoringQuery.create({
    data: {
      trialId: trial1.id,
      subjectScreeningId: "SCR-AIIA-001",
      visitName: "Visit 3 (Day 28 Midpoint)",
      field: "MMSE Cognitive Score",
      issueDescription: "MMSE score entered as 27, but clinic sheet scanned attachment shows 26. Please verify and reconcile source document discrepancy.",
      raisedBy: "Dr. Ananya Mishra (CRA)",
      assignedTo: "Dr. Rajiv Verma (CRC)",
      status: "Open",
    },
  });

  await prisma.monitoringQuery.create({
    data: {
      trialId: trial3.id,
      subjectScreeningId: "SCR-AIIA-201",
      visitName: "Visit 1 (Baseline)",
      field: "Serum Triglycerides",
      issueDescription: "Fasting lipid profile lab report missing accredited laboratory sign-off stamp. Upload accredited lab verification copy.",
      raisedBy: "Dr. Ananya Mishra (CRA)",
      assignedTo: "Dr. Rajiv Verma (CRC)",
      status: "Open",
    },
  });

  console.log("Seeding Cryptographically Chained 21 CFR Part 11 Audit Trail...");

  let prevHash = "0000000000000000000000000000000000000000000000000000000000000000_GENESIS";

  const auditEntries = [
    {
      tableName: "ClinicalTrial",
      recordId: trial1.id,
      operation: "INSERT",
      prevVal: null,
      newVal: { protocol: trial1.protocolNumber, ctri: trial1.ctriId },
      by: "Prof. (Dr.) Tanuja Nesari",
      role: "ROLE_PI",
      reason: "Initial trial protocol setup and CTRI registration authorization under GCP-ASU guidelines.",
      time: new Date("2024-02-15T09:00:00Z"),
    },
    {
      tableName: "TrialSubject",
      recordId: subject1.id,
      operation: "INSERT",
      prevVal: null,
      newVal: { screeningId: subject1.screeningId, arm: subject1.assignedArm },
      by: "Dr. Rajiv Verma",
      role: "ROLE_CRC",
      reason: "Patient screened, verified against inclusion/exclusion criteria, and written informed consent documented.",
      time: new Date("2024-04-10T10:30:00Z"),
    },
    {
      tableName: "EcrfVisit",
      recordId: subject1.id,
      operation: "SIGN",
      prevVal: { sdvStatus: "Pending" },
      newVal: { sdvStatus: "Verified" },
      by: "Dr. Ananya Mishra",
      role: "ROLE_MONITOR",
      reason: "Source Data Verification (SDV) completed for Visit 1 baseline metrics against hospital OPD case sheet.",
      time: new Date("2024-04-12T11:30:00Z"),
    },
    {
      tableName: "AdverseEvent",
      recordId: subject5.id,
      operation: "INSERT",
      prevVal: null,
      newVal: { event: "Acute Transaminitis", ctcaeGrade: 3, sae: true },
      by: "Dr. Sunita Pathak",
      role: "ROLE_NPVCC",
      reason: "NPvCC expedited Adverse Drug Reaction intake logged. 24h regulatory countdown to Ethics Committee initiated.",
      time: new Date(now.getTime() - 6 * 60 * 60 * 1000),
    },
  ];

  for (const entry of auditEntries) {
    const prevStr = entry.prevVal ? JSON.stringify(entry.prevVal) : "";
    const newStr = entry.newVal ? JSON.stringify(entry.newVal) : "";
    const payload = `${prevHash}|${entry.tableName}|${entry.recordId}|${entry.operation}|${prevStr}|${newStr}|${entry.by}|${entry.role}|${entry.reason}|${entry.time.toISOString()}`;
    const hash = crypto.createHash("sha256").update(payload).digest("hex");

    await prisma.auditLog.create({
      data: {
        tableName: entry.tableName,
        recordId: entry.recordId,
        operation: entry.operation,
        previousValue: prevStr || null,
        newValue: newStr || null,
        modifiedBy: entry.by,
        userRole: entry.role,
        reasonForChange: entry.reason,
        timestamp: entry.time,
        previousHash: prevHash,
        recordSignatureHash: hash,
      },
    });

    prevHash = hash;
  }

  console.log("Database successfully seeded with realistic AIIA CTMS data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
