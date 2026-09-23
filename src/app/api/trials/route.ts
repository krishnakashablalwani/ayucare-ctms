import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const trials = await prisma.clinicalTrial.findMany({
      include: {
        subjects: {
          include: {
            visits: true,
            adverseEvents: true,
          },
        },
        monitoringQueries: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, trials });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
