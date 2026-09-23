"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { ProtocolsView } from "@/components/protocols/ProtocolsView";

export default function ProtocolsSubpage() {
  const { trials, selectedTrialId, setSelectedTrialId } = useDashboard();

  return (
    <ProtocolsView
      trials={trials}
      selectedTrialId={selectedTrialId}
      onSelectTrial={setSelectedTrialId}
    />
  );
}
