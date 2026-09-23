"use client";

import React from "react";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { InteroperabilityView } from "@/components/interoperability/InteroperabilityView";

export default function InteroperabilitySubpage() {
  const { trials, currentRole } = useDashboard();

  return (
    <InteroperabilityView
      trials={trials}
      currentRole={currentRole}
    />
  );
}
