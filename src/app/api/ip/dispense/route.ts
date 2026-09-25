import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ipId, subjectId, visitName, quantityDispensed, dispensedDate, dispensedBy } = body;

    const parsedQty = parseInt(quantityDispensed, 10);

    // Use a transaction to ensure stock is accurately deducted
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch current IP stock
      const ip = await tx.investigationalProduct.findUnique({ where: { id: ipId } });
      
      if (!ip) throw new Error("IP Batch not found");
      if (ip.quantityAvailable < parsedQty) throw new Error("Insufficient stock in batch");
      if (ip.status !== "Released") throw new Error("Batch is not released for dispensing");

      // 2. Create the dispensation log
      const log = await tx.ipDispensation.create({
        data: {
          ipId,
          subjectId,
          visitName,
          quantityDispensed: parsedQty,
          dispensedDate,
          dispensedBy,
        },
      });

      // 3. Update the stock
      await tx.investigationalProduct.update({
        where: { id: ipId },
        data: {
          quantityAvailable: ip.quantityAvailable - parsedQty,
          quantityDispensed: ip.quantityDispensed + parsedQty,
        }
      });

      return log;
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
