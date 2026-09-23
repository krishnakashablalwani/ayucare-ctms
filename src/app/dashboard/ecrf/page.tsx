"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { SubjectsEcrfView } from "@/components/subjects/SubjectsEcrfView";

export default function EcrfSubpage() {
  const { subjects, trials, currentRole, refreshData, selectedTrialId } = useDashboard();

  return (
    <SubjectsEcrfView
      subjects={subjects}
      trials={trials}
      currentRole={currentRole}
      onRefresh={refreshData}
      selectedTrialId={selectedTrialId}
    />
  );
}
