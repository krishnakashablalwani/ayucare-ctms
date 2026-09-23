"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { SiteMonitoringView } from "@/components/monitoring/SiteMonitoringView";

export default function MonitoringSubpage() {
  const { queries, subjects, trials, currentRole, refreshData } = useDashboard();

  return (
    <SiteMonitoringView
      queries={queries}
      subjects={subjects}
      trials={trials}
      currentRole={currentRole}
      onRefresh={refreshData}
      selectedTrialId={null}
    />
  );
}
