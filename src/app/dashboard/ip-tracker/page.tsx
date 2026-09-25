"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { IpTrackerView } from "@/components/dashboard/IpTrackerView";

export default function IpTrackerPage() {
  const { currentRole, selectedTrialId, trials } = useDashboard();
  
  // Find subjects for the currently selected trial for the dispense dropdown
  const currentTrial = trials.find(t => t.id === selectedTrialId);
  const subjects = currentTrial?.subjects || [];

  return (
    <IpTrackerView
      currentRole={currentRole}
      selectedTrialId={selectedTrialId}
      subjects={subjects}
    />
  );
}
