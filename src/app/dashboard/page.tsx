"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDashboard } from "@/components/dashboard/DashboardContext";
import { ExecutiveKpiView } from "@/components/dashboard/ExecutiveKpiView";

export default function DashboardPortfolioPage() {
  const router = useRouter();
  const { trials, currentRole, selectedTrialId, setSelectedTrialId } = useDashboard();

  return (
    <ExecutiveKpiView
      trials={trials}
      currentRole={currentRole}
      selectedTrialId={selectedTrialId}
      onSelectTrial={(id) => {
        setSelectedTrialId(id);
        router.push("/dashboard/protocols");
      }}
      onNavigateTab={(tab) => {
        const routeMap: Record<string, string> = {
          protocols: "/dashboard/protocols",
          subjects: "/dashboard/ecrf",
          pharmacovigilance: "/dashboard/safety",
          monitoring: "/dashboard/monitoring",
          audit: "/dashboard/audit",
          interoperability: "/dashboard/interoperability",
        };
        router.push(routeMap[tab] || "/dashboard");
      }}
    />
  );
}
