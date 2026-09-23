import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const subjects = await prisma.trialSubject.findMany({
      include: {
        trial: true,
        visits: {
          orderBy: { visitNumber: "asc" },
        },
        adverseEvents: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, subjects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      trialId,
      screeningId,
      randomizationId,
      subjectInitials,
      age,
      gender,
      assignedArm,
      baselinePrakriti,
      userRole = "ROLE_CRC",
      modifiedBy = "Study Coordinator",
      reasonForChange = "New participant enrollment after eligibility verification and informed consent.",
    } = body;

    if (!trialId || !screeningId || !subjectInitials || !age || !gender || !assignedArm) {
      return NextResponse.json(
        { success: false, error: "Missing required fields for subject enrollment." },
        { status: 400 }
      );
    }

    const enrollmentDate = new Date().toISOString().split("T")[0];

    // Create subject
    const subject = await prisma.trialSubject.create({
      data: {
        trialId,
        screeningId,
        randomizationId: randomizationId || null,
        subjectInitials,
        age: parseInt(age, 10),
        gender,
        assignedArm,
        status: randomizationId ? "Active" : "Screened",
        enrollmentDate,
        baselinePrakriti: typeof baselinePrakriti === "string" ? baselinePrakriti : JSON.stringify(baselinePrakriti),
        informedConsentDate: enrollmentDate,
        informedConsentVerified: true,
      },
    });

    // Automatically create Visit 1 (Baseline)
    await prisma.ecrfVisit.create({
      data: {
        subjectId: subject.id,
        visitNumber: 1,
        visitName: "Visit 1 (Day 0 - Baseline)",
        scheduledDate: enrollmentDate,
        completedDate: enrollmentDate,
        status: "Completed",
        clinicalObservations: JSON.stringify({
          nadi: "Samanya",
          mutra: "Prakrita",
          jihwa: "Nirama",
          sparsha: "Prakrita",
          bloodPressure: "120/80 mmHg",
          pulse: "72 bpm",
          pittaIndex: 4.0,
        }),
        sdvStatus: "Pending",
      },
    });

    // Update Trial current enrollment
    await prisma.clinicalTrial.update({
      where: { id: trialId },
      data: { currentEnrollment: { increment: 1 } },
    });

    // 21 CFR Part 11 Audit Trail
    await createAuditLog({
      tableName: "TrialSubject",
      recordId: subject.id,
      operation: "INSERT",
      previousValue: null,
      newValue: { screeningId, randomizationId, assignedArm, age, gender },
      modifiedBy,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, subject });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
