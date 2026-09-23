import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const adverseEvents = await prisma.adverseEvent.findMany({
      include: {
        subject: {
          include: {
            trial: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, adverseEvents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      subjectId,
      eventTerm,
      medDraCode = "10046735",
      medDraTerm = "Drug-induced adverse reaction",
      whoDrugCode = "WDU-AYU-GEN",
      severity = "Moderate",
      ctcaeGrade = 2,
      isSeriousnessSae = false,
      seriousnessCriteria = "None",
      causalityAyushDrug = "Probable",
      actionTaken = "Dose Reduced",
      outcome = "Recovering",
      userRole = "ROLE_NPVCC",
      modifiedBy = "National Pharmacovigilance Officer",
      reasonForChange = "Expedited ADR intake logged under NPvCC safety surveillance protocol.",
    } = body;

    if (!subjectId || !eventTerm) {
      return NextResponse.json(
        { success: false, error: "Missing required adverse event fields." },
        { status: 400 }
      );
    }

    const now = new Date();
    // 24 hours deadline for regulatory notification (NDCT 2019 / GCP requirement)
    const regulatoryDeadline24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const ae = await prisma.adverseEvent.create({
      data: {
        subjectId,
        eventTerm,
        medDraCode,
        medDraTerm,
        whoDrugCode,
        onsetDate: now.toISOString().split("T")[0],
        severity,
        ctcaeGrade: parseInt(ctcaeGrade as any, 10),
        isSeriousnessSae: Boolean(isSeriousnessSae),
        seriousnessCriteria,
        causalityAyushDrug,
        actionTaken,
        outcome,
        reportedToEthics: false,
        reportedToDcgi: false,
        regulatoryDeadline24h,
      },
    });

    // 21 CFR Part 11 Audit Trail
    await createAuditLog({
      tableName: "AdverseEvent",
      recordId: ae.id,
      operation: "INSERT",
      previousValue: null,
      newValue: {
        eventTerm,
        ctcaeGrade,
        isSeriousnessSae,
        causalityAyushDrug,
        deadline: regulatoryDeadline24h,
      },
      modifiedBy,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, adverseEvent: ae });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
