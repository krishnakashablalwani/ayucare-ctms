import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuditChainIntegrity } from "@/lib/audit";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { id: "desc" },
      take: 100,
    });

    const verification = await verifyAuditChainIntegrity();

    return NextResponse.json({
      success: true,
      logs,
      verification,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
