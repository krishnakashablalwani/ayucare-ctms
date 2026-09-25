import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";
import crypto from "crypto";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      status,
      clinicalObservations,
      completedDate,
      userRole = "ROLE_CRC",
      modifiedBy = "Clinical Research Coordinator",
      reasonForChange,
    } = body;

    if (!reasonForChange) {
      return NextResponse.json(
        {
          success: false,
          error: "GCP Compliance Violation: A mandatory 'Reason for Change' is required to modify clinical eCRF data.",
        },
        { status: 400 }
      );
    }

    const currentVisit = await prisma.ecrfVisit.findUnique({
      where: { id },
    });

    if (!currentVisit) {
      return NextResponse.json({ success: false, error: "Visit not found." }, { status: 404 });
    }

    const updatedVisit = await prisma.ecrfVisit.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(completedDate ? { completedDate } : {}),
        ...(clinicalObservations
          ? {
              clinicalObservations:
                typeof clinicalObservations === "string"
                  ? clinicalObservations
                  : JSON.stringify(clinicalObservations),
            }
          : {}),
      },
    });

    // 21 CFR Part 11 Audit Trail
    await createAuditLog({
      tableName: "EcrfVisit",
      recordId: id,
      operation: "UPDATE",
      previousValue: currentVisit,
      newValue: updatedVisit,
      modifiedBy,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, visit: updatedVisit });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// SDV Verification by Monitor (CRA)
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      sdvStatus = "Verified",
      monitorName = "Dr. Ananya Mishra (CRA)",
      userRole = "ROLE_MONITOR",
      reasonForChange = "Source Data Verification (SDV) executed against source documents.",
    } = body;

    const currentVisit = await prisma.ecrfVisit.findUnique({
      where: { id },
    });

    if (!currentVisit) {
      return NextResponse.json({ success: false, error: "Visit not found." }, { status: 404 });
    }

    const timestamp = new Date();
    const signaturePayload = `${id}|${sdvStatus}|${monitorName}|${timestamp.toISOString()}`;
    const craSignatureHash = crypto.createHash("sha256").update(signaturePayload).digest("hex");

    const updatedVisit = await prisma.ecrfVisit.update({
      where: { id },
      data: {
        sdvStatus,
        sdvSignedBy: monitorName,
        sdvSignedAt: timestamp,
        craSignatureHash,
      },
    });

    await createAuditLog({
      tableName: "EcrfVisit",
      recordId: id,
      operation: "VERIFY",
      previousValue: { sdvStatus: currentVisit.sdvStatus },
      newValue: { sdvStatus, sdvSignedBy: monitorName, craSignatureHash },
      modifiedBy: monitorName,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, visit: updatedVisit });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
