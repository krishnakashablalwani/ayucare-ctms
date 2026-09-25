import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      targetAuthority, // "ETHICS" or "DCGI"
      userRole = "ROLE_NPVCC",
      modifiedBy = "National Pharmacovigilance Officer",
      reasonForChange = "Regulatory notification dispatched within mandatory 24-hour window.",
    } = body;

    const currentAe = await prisma.adverseEvent.findUnique({
      where: { id },
    });

    if (!currentAe) {
      return NextResponse.json({ success: false, error: "Adverse event not found." }, { status: 404 });
    }

    const updateData: any = {
      reportedAt: new Date(),
    };

    if (targetAuthority === "ETHICS" || targetAuthority === "BOTH") {
      updateData.reportedToEthics = true;
    }
    if (targetAuthority === "DCGI" || targetAuthority === "BOTH") {
      updateData.reportedToDcgi = true;
    }

    const updated = await prisma.adverseEvent.update({
      where: { id },
      data: updateData,
    });

    // 21 CFR Part 11 Audit Trail
    await createAuditLog({
      tableName: "AdverseEvent",
      recordId: id,
      operation: "SIGN",
      previousValue: {
        reportedToEthics: currentAe.reportedToEthics,
        reportedToDcgi: currentAe.reportedToDcgi,
      },
      newValue: {
        reportedToEthics: updated.reportedToEthics,
        reportedToDcgi: updated.reportedToDcgi,
        targetAuthority,
      },
      modifiedBy,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, adverseEvent: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
