import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trialId = searchParams.get("trialId");

  if (!trialId) {
    return NextResponse.json({ error: "trialId is required" }, { status: 400 });
  }

  try {
    const batches = await prisma.investigationalProduct.findMany({
      where: { trialId },
      include: {
        dispensations: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(batches);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { trialId, batchNumber, productName, manufacturingDate, expiryDate, totalQuantityReceived, status } = body;

    const batch = await prisma.investigationalProduct.create({
      data: {
        trialId,
        batchNumber,
        productName,
        manufacturingDate,
        expiryDate,
        totalQuantityReceived: parseInt(totalQuantityReceived, 10),
        quantityAvailable: parseInt(totalQuantityReceived, 10),
        quantityDispensed: 0,
        status: status || "Quarantined",
      },
    });

    return NextResponse.json(batch);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
