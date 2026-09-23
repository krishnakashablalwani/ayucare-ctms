"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { PvSafetyView } from "@/components/pharmacovigilance/PvSafetyView";

export default function SafetySubpage() {
  const { adverseEvents, subjects, trials, currentRole, refreshData } = useDashboard();

  return (
    <PvSafetyView
      adverseEvents={adverseEvents}
      subjects={subjects}
      trials={trials}
      currentRole={currentRole}
      onRefresh={refreshData}
      selectedTrialId={null}
    />
  );
}
