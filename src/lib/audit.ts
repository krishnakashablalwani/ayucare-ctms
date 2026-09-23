import crypto from "crypto";
import { prisma } from "./prisma";

export interface LogAuditParams {
  tableName: string;
  recordId: string;
  operation: "INSERT" | "UPDATE" | "DELETE" | "SIGN" | "VERIFY";
  previousValue?: any;
  newValue?: any;
  modifiedBy: string;
  userRole: string;
  reasonForChange: string;
}

export async function createAuditLog({
  tableName,
  recordId,
  operation,
  previousValue,
  newValue,
  modifiedBy,
  userRole,
  reasonForChange,
}: LogAuditParams) {
  // 1. Fetch the most recent audit log to get previousHash for cryptographic chaining
  const lastLog = await prisma.auditLog.findFirst({
    orderBy: { id: "desc" },
  });

  const previousHash = lastLog
    ? lastLog.recordSignatureHash
    : "0000000000000000000000000000000000000000000000000000000000000000_GENESIS";

  const prevStr = previousValue ? JSON.stringify(previousValue) : "";
  const newStr = newValue ? JSON.stringify(newValue) : "";
  const timestamp = new Date();

  // 2. Chained SHA-256 signature
  const payloadToHash = `${previousHash}|${tableName}|${recordId}|${operation}|${prevStr}|${newStr}|${modifiedBy}|${userRole}|${reasonForChange}|${timestamp.toISOString()}`;
  const recordSignatureHash = crypto
    .createHash("sha256")
    .update(payloadToHash)
    .digest("hex");

  // 3. Persist append-only audit record
  return await prisma.auditLog.create({
    data: {
      tableName,
      recordId,
      operation,
      previousValue: prevStr || null,
      newValue: newStr || null,
      modifiedBy,
      userRole,
      reasonForChange,
      timestamp,
      previousHash,
      recordSignatureHash,
    },
  });
}

export async function verifyAuditChainIntegrity() {
  const allLogs = await prisma.auditLog.findMany({
    orderBy: { id: "asc" },
  });

  if (allLogs.length === 0) {
    return { isValid: true, count: 0, message: "Audit log is empty (Genesis state)." };
  }

  let expectedPrevHash =
    "0000000000000000000000000000000000000000000000000000000000000000_GENESIS";

  for (let i = 0; i < allLogs.length; i++) {
    const log = allLogs[i];

    if (log.previousHash !== expectedPrevHash) {
      return {
        isValid: false,
        brokenAtId: log.id,
        count: allLogs.length,
        message: `Hash chain broken at log ID ${log.id}. Expected prev hash ${expectedPrevHash.slice(0, 16)}... but found ${log.previousHash.slice(0, 16)}...`,
      };
    }

    const prevStr = log.previousValue || "";
    const newStr = log.newValue || "";
    const payloadToHash = `${log.previousHash}|${log.tableName}|${log.recordId}|${log.operation}|${prevStr}|${newStr}|${log.modifiedBy}|${log.userRole}|${log.reasonForChange}|${log.timestamp.toISOString()}`;
    const calculatedHash = crypto
      .createHash("sha256")
      .update(payloadToHash)
      .digest("hex");

    if (calculatedHash !== log.recordSignatureHash) {
      return {
        isValid: false,
        brokenAtId: log.id,
        count: allLogs.length,
        message: `Tampering detected at log ID ${log.id}. Stored hash does not match computed SHA-256 payload.`,
      };
    }

    expectedPrevHash = log.recordSignatureHash;
  }

  return {
    isValid: true,
    count: allLogs.length,
    message: `All ${allLogs.length} audit entries verified mathematically. Cryptographic chain is intact.`,
  };
}
