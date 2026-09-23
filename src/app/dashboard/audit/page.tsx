"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { AuditTrailView } from "@/components/audit/AuditTrailView";

export default function AuditSubpage() {
  const { currentRole } = useDashboard();

  return <AuditTrailView currentRole={currentRole} />;
}
