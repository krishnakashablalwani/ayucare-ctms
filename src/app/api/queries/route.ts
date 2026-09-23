import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  try {
    const queries = await prisma.monitoringQuery.findMany({
      include: {
        trial: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, queries });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      trialId,
      subjectScreeningId,
      visitName,
      field,
      issueDescription,
      raisedBy = "Dr. Ananya Mishra (CRA)",
      assignedTo = "Study Coordinator",
      userRole = "ROLE_MONITOR",
      reasonForChange = "Discrepancy identified during Source Data Verification (SDV).",
    } = body;

    if (!trialId || !subjectScreeningId || !visitName || !field || !issueDescription) {
      return NextResponse.json({ success: false, error: "Missing required query fields." }, { status: 400 });
    }

    const query = await prisma.monitoringQuery.create({
      data: {
        trialId,
        subjectScreeningId,
        visitName,
        field,
        issueDescription,
        raisedBy,
        assignedTo,
        status: "Open",
      },
    });

    // 21 CFR Part 11 Audit Trail
    await createAuditLog({
      tableName: "MonitoringQuery",
      recordId: query.id,
      operation: "INSERT",
      previousValue: null,
      newValue: { subjectScreeningId, visitName, field, issueDescription },
      modifiedBy: raisedBy,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, query });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      status, // "Answered" or "Resolved"
      response,
      modifiedBy = "Clinical Research Coordinator",
      userRole = "ROLE_CRC",
      reasonForChange = "Resolution details submitted for monitoring discrepancy.",
    } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status." }, { status: 400 });
    }

    const currentQuery = await prisma.monitoringQuery.findUnique({ where: { id } });
    if (!currentQuery) {
      return NextResponse.json({ success: false, error: "Query not found." }, { status: 404 });
    }

    const updated = await prisma.monitoringQuery.update({
      where: { id },
      data: {
        status,
        ...(response ? { response } : {}),
        ...(status === "Resolved" ? { resolvedAt: new Date() } : {}),
      },
    });

    await createAuditLog({
      tableName: "MonitoringQuery",
      recordId: id,
      operation: "UPDATE",
      previousValue: currentQuery,
      newValue: updated,
      modifiedBy,
      userRole,
      reasonForChange,
    });

    return NextResponse.json({ success: true, query: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
