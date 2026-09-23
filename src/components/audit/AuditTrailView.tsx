"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  History,
  Lock,
  RefreshCw,
  Search,
  CheckCircle2,
} from "lucide-react";
import { RoleType } from "../layout/Header";

interface AuditTrailViewProps {
  currentRole: RoleType;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ currentRole }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [verification, setVerification] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [selectedLog, setSelectedLog] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setVerification(data.verification || null);
        if (data.logs?.length > 0 && !selectedLog) {
          setSelectedLog(data.logs[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, []);

  const handleVerifyChain = async () => {
    setVerifying(true);
    await fetchAuditData();
    setTimeout(() => setVerifying(false), 600);
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    return (
      log.tableName.toLowerCase().includes(term) ||
      log.operation.toLowerCase().includes(term) ||
      log.modifiedBy.toLowerCase().includes(term) ||
      log.reasonForChange.toLowerCase().includes(term) ||
      log.recordSignatureHash.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-10 animate-fade-in-up pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-border-subtle pb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-sohne text-text-muted uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary" />
            <span>ALCOA+ Data Integrity</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-signifier font-normal text-text-primary tracking-heading leading-heading-sm">
            Cryptographic Audit Trail
          </h1>
          <p className="text-body text-text-secondary font-sohne max-w-2xl">
            Immutable, append-only ledger with cryptographic SHA-256 hash chaining and mandatory Reason-for-Change enforcement.
          </p>
        </div>

        <button
          onClick={handleVerifyChain}
          disabled={verifying}
          className="steep-pill-filled self-start sm:self-auto shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${verifying ? "animate-spin" : ""}`} />
          <span>{verifying ? "Verifying Hash Chain..." : "Verify Hash Chain Integrity"}</span>
        </button>
      </div>

      {/* Cryptographic Verification Status Banner */}
      {verification && (
        <div
          className={`p-6 rounded-cards border shadow-steep-subtle flex items-center justify-between gap-6 font-sohne ${
            verification.isValid
              ? "bg-background border-border-subtle"
              : "bg-surface-accent border-sienna/20 text-sienna"
          }`}
        >
          <div className="flex items-center gap-4">
            {verification.isValid ? (
              <div className="w-12 h-12 rounded-xl bg-surface-fog text-text-primary flex items-center justify-center flex-shrink-0 border border-border-subtle">
                <ShieldCheck className="w-6 h-6" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-sienna/10 text-sienna flex items-center justify-center flex-shrink-0 border border-sienna/20">
                <ShieldAlert className="w-6 h-6" />
              </div>
            )}
            <div>
              <div className={`font-signifier font-medium text-xl ${verification.isValid ? "text-text-primary" : "text-sienna"}`}>
                {verification.isValid
                  ? "Cryptographic Integrity Verified"
                  : "Audit Chain Integrity Compromised!"}
              </div>
              <div className={`text-sm mt-1 ${verification.isValid ? "text-text-secondary" : "text-sienna/80"}`}>
                {verification.message}
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className={`font-signifier font-medium text-2xl block ${verification.isValid ? "text-text-primary" : "text-sienna"}`}>
              {verification.count}
            </span>
            <div className={`text-xs uppercase tracking-widest font-medium ${verification.isValid ? "text-text-muted" : "text-sienna/60"}`}>
              Chained Blocks
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Log Table (7 cols) & Diff / Payload Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Table of Audit Entries (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by table, actor, change reason, or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border-subtle rounded-inputs py-3 pl-12 pr-4 text-sm font-sohne text-text-primary focus:outline-none focus:border-text-secondary transition-colors shadow-steep-subtle"
            />
          </div>

          <div className="bg-background border border-border-subtle rounded-cards overflow-hidden shadow-steep-subtle font-sohne text-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-fog border-b border-border-subtle text-text-muted text-xs font-medium uppercase tracking-wide">
                  <tr>
                    <th className="p-4">Log ID</th>
                    <th className="p-4">Operation</th>
                    <th className="p-4">Entity</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Reason for Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-text-secondary">
                        No audit records match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const isSelected = selectedLog?.id === log.id;
                      return (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-surface-accent"
                              : "hover:bg-surface-fog"
                          }`}
                        >
                          <td className="p-4">
                            <span className="font-medium text-text-primary">#{log.id}</span>
                            <span className="text-xs text-text-muted block mt-0.5">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                                log.operation === "INSERT"
                                  ? "bg-surface-fog border-border-subtle text-text-secondary"
                                  : log.operation === "SIGN" || log.operation === "VERIFY"
                                  ? "bg-surface-accent border-text-muted/30 text-text-primary"
                                  : "bg-surface-fog border-border-subtle text-text-secondary"
                              }`}
                            >
                              {log.operation}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-medium text-text-primary block">
                              {log.tableName}
                            </span>
                            <span className="text-xs text-text-muted block truncate max-w-[100px] mt-0.5">
                              {log.recordId}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-text-primary font-medium block">{log.modifiedBy}</span>
                            <span className="text-xs text-text-muted block mt-0.5">
                              {log.userRole}
                            </span>
                          </td>
                          <td className="p-4 max-w-[180px] truncate text-text-secondary text-xs" title={log.reasonForChange}>
                            {log.reasonForChange}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Log Cryptographic Deep Dive (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedLog ? (
            <div className="steep-card space-y-6">
              <div className="flex items-start justify-between border-b border-border-subtle pb-5">
                <div>
                  <span className="text-xs uppercase font-sohne text-text-muted font-medium tracking-widest">
                    Cryptographic Block Inspector
                  </span>
                  <h3 className="font-signifier font-medium text-2xl text-text-primary mt-2">
                    Audit Entry #{selectedLog.id}
                  </h3>
                  <p className="text-sm text-text-secondary font-sohne mt-1">
                    Timestamp: {new Date(selectedLog.timestamp).toISOString()}
                  </p>
                </div>
                <span className="steep-tag px-3 py-1 rounded-md bg-surface-fog border border-border-subtle font-medium text-xs">
                  {selectedLog.operation}
                </span>
              </div>

              {/* Mandatory Reason for Change Box */}
              <div className="p-5 bg-background rounded-cards border border-border-subtle space-y-2 font-sohne">
                <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">
                  Mandatory Reason for Change (GCP Justification)
                </span>
                <p className="text-text-primary text-sm leading-relaxed italic">
                  &ldquo;{selectedLog.reasonForChange}&rdquo;
                </p>
              </div>

              {/* Hashes: Chained SHA-256 */}
              <div className="space-y-4 font-sohne text-sm">
                <div className="p-4 bg-surface-fog rounded-cards border border-border-subtle space-y-2">
                  <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">Previous Block Hash (Chained)</span>
                  <div className="text-xs text-text-secondary break-all font-mono">
                    {selectedLog.previousHash}
                  </div>
                </div>

                <div className="p-4 bg-surface-accent rounded-cards border border-border-subtle space-y-2">
                  <span className="text-xs text-text-primary uppercase font-medium tracking-wide block">
                    Record Signature Hash (SHA-256 HMAC)
                  </span>
                  <div className="text-xs text-text-primary break-all font-mono">
                    {selectedLog.recordSignatureHash}
                  </div>
                </div>
              </div>

              {/* Previous vs New Values */}
              <div className="space-y-3 font-sohne text-sm">
                <span className="text-xs text-text-muted uppercase font-medium tracking-wide block">
                  Payload Mutation Diff
                </span>
                <div className="p-4 bg-background rounded-cards border border-border-subtle overflow-x-auto text-xs max-h-64 font-mono leading-relaxed">
                  <div className="text-text-primary font-medium mb-2 opacity-60">// NEW VALUE:</div>
                  <pre className="text-text-primary">{JSON.stringify(JSON.parse(selectedLog.newValue || "{}"), null, 2)}</pre>
                  {selectedLog.previousValue && (
                    <>
                      <div className="text-sienna font-medium mt-4 mb-2 opacity-80">// PREVIOUS VALUE:</div>
                      <pre className="text-sienna">{JSON.stringify(JSON.parse(selectedLog.previousValue || "{}"), null, 2)}</pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="steep-card p-12 text-center text-text-muted font-sohne text-sm flex items-center justify-center min-h-[400px]">
              Select an entry from the ledger to inspect cryptographic hashes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
