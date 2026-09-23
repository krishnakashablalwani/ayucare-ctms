import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateFhirR4Bundle } from "@/lib/fhir";
import {
  generateCdiscOdmXml,
  generateSdtmDemographicsCsv,
  generateSdtmAdverseEventsCsv,
} from "@/lib/cdisc";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "fhir";
    const trialId = searchParams.get("trialId");

    // Fetch trial or default to the first
    const trial = trialId
      ? await prisma.clinicalTrial.findUnique({ where: { id: trialId } })
      : await prisma.clinicalTrial.findFirst();

    if (!trial) {
      return NextResponse.json({ success: false, error: "No clinical trials found." }, { status: 404 });
    }

    const subjects = await prisma.trialSubject.findMany({
      where: { trialId: trial.id },
      include: {
        visits: true,
      },
    });

    const adverseEvents = await prisma.adverseEvent.findMany({
      where: {
        subject: {
          trialId: trial.id,
        },
      },
      include: {
        subject: true,
      },
    });

    if (type === "fhir") {
      const bundle = generateFhirR4Bundle({ trial, subjects, adverseEvents });
      return new NextResponse(JSON.stringify(bundle, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="AyuCare-FHIR-R4-${trial.protocolNumber}.json"`,
        },
      });
    }

    if (type === "cdisc-odm") {
      const xml = generateCdiscOdmXml(trial, subjects, adverseEvents);
      return new NextResponse(xml, {
        headers: {
          "Content-Type": "application/xml",
          "Content-Disposition": `attachment; filename="AyuCare-CDISC-ODM-${trial.protocolNumber}.xml"`,
        },
      });
    }

    if (type === "sdtm-dm") {
      const csv = generateSdtmDemographicsCsv(trial, subjects);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="SDTM-DM-${trial.protocolNumber}.csv"`,
        },
      });
    }

    if (type === "sdtm-ae") {
      const csv = generateSdtmAdverseEventsCsv(trial, adverseEvents);
      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="SDTM-AE-${trial.protocolNumber}.csv"`,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid export type requested." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
