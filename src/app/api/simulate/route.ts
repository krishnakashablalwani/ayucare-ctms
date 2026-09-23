import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, trialId } = body;

    const trial = trialId
      ? await prisma.clinicalTrial.findUnique({ where: { id: trialId } })
      : await prisma.clinicalTrial.findFirst();

    if (!trial) {
      return NextResponse.json({ success: false, error: "Trial not found" }, { status: 404 });
    }

    if (action === "INJECT_SAE") {
      // Find or pick a subject in this trial
      const subject = await prisma.trialSubject.findFirst({
        where: { trialId: trial.id },
      });

      if (!subject) {
        return NextResponse.json({ success: false, error: "No subject available for SAE injection." }, { status: 400 });
      }

      const now = new Date();
      const deadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // exactly 24h

      const sae = await prisma.adverseEvent.create({
        data: {
          subjectId: subject.id,
          eventTerm: "Acute Bronchospasm & Shwasa Krichhrata (Severe Allergic Reaction)",
          medDraCode: "10006482",
          medDraTerm: "Bronchospasm",
          whoDrugCode: "WDU-AYU-EXP09",
          onsetDate: now.toISOString().split("T")[0],
          severity: "Severe",
          ctcaeGrade: 4,
          isSeriousnessSae: true,
          seriousnessCriteria: "Life-Threatening / Emergency Hospitalization",
          causalityAyushDrug: "Definite",
          actionTaken: "Investigational Formulation Discontinued Permanently",
          outcome: "Hospitalized / Under Observation",
          reportedToEthics: false,
          reportedToDcgi: false,
          regulatoryDeadline24h: deadline,
        },
      });

      await createAuditLog({
        tableName: "AdverseEvent",
        recordId: sae.id,
        operation: "INSERT",
        previousValue: null,
        newValue: { event: sae.eventTerm, ctcaeGrade: 4, sae: true },
        modifiedBy: "NPvCC Surveillance Simulator",
        userRole: "ROLE_NPVCC",
        reasonForChange: "SIMULATION: Critical Serious Adverse Event injected to test 24-hr regulatory alerting cascade.",
      });

      return NextResponse.json({ success: true, message: "Emergency SAE Injected! 24-hour countdown active.", sae });
    }

    if (action === "QUICK_ENROLL") {
      const count = await prisma.trialSubject.count({ where: { trialId: trial.id } });
      const seq = count + 1;
      const screeningId = `SCR-AIIA-${String(seq).padStart(3, "0")}`;
      const randomizationId = `RND-EXP-${String(seq).padStart(3, "0")}`;
      const today = new Date().toISOString().split("T")[0];

      const subject = await prisma.trialSubject.create({
        data: {
          trialId: trial.id,
          screeningId,
          randomizationId,
          subjectInitials: `S.T.${seq}`,
          age: 35 + (seq % 30),
          gender: seq % 2 === 0 ? "Female" : "Male",
          assignedArm: seq % 2 === 0 ? "Active Investigational Arm" : "Standard Control Arm",
          status: "Active",
          enrollmentDate: today,
          baselinePrakriti: JSON.stringify({
            vata: 35,
            pitta: 40,
            kapha: 25,
            primary: "Pitta-Vata",
            characteristics: "Sama Agni, Madhyama Bala",
          }),
          doshicDerangement: JSON.stringify({ vata: 4, pitta: 6, kapha: 3 }),
          informedConsentDate: today,
          informedConsentVerified: true,
        },
      });

      await prisma.ecrfVisit.create({
        data: {
          subjectId: subject.id,
          visitNumber: 1,
          visitName: "Visit 1 (Baseline)",
          scheduledDate: today,
          completedDate: today,
          status: "Completed",
          clinicalObservations: JSON.stringify({
            nadi: "Samanya",
            bloodPressure: "122/78 mmHg",
            pulse: "74 bpm",
            pittaIndex: 4.2,
          }),
          sdvStatus: "Pending",
        },
      });

      await prisma.clinicalTrial.update({
        where: { id: trial.id },
        data: { currentEnrollment: { increment: 1 } },
      });

      await createAuditLog({
        tableName: "TrialSubject",
        recordId: subject.id,
        operation: "INSERT",
        previousValue: null,
        newValue: { screeningId, randomizationId },
        modifiedBy: "Clinical Research Coordinator",
        userRole: "ROLE_CRC",
        reasonForChange: "SIMULATION: Quick participant enrollment generated for trial workflow demonstration.",
      });

      return NextResponse.json({ success: true, message: `Enrolled participant ${screeningId}`, subject });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
