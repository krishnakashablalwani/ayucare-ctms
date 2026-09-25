"use client";

import React from "react";
import { DashboardProvider, useDashboard } from "@/components/dashboard/DashboardContext";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { TrialSimulatorModal } from "@/components/simulation/TrialSimulatorModal";
import { Loader2 } from "lucide-react";

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const {
    currentRole,
    setCurrentRole,
    showSimulator,
    setShowSimulator,
    trials,
    refreshData,
    loading,
    pendingSaeCount,
    openQueryCount,
  } = useDashboard();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
      {/* Global Dashboard Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onOpenSimulator={() => setShowSimulator(true)}
        activeSaeCount={pendingSaeCount}
      />

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-screen-2xl w-full mx-auto">
        <Sidebar
          openQueryCount={openQueryCount}
          pendingSaeCount={pendingSaeCount}
        />

        <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto min-h-[calc(100vh-80px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 font-sohne text-sm text-text-secondary gap-4">
              <Loader2 className="w-6 h-6 animate-spin text-text-primary" />
              <span>Loading Clinical Ledgers...</span>
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Evaluator Simulation Modal */}
      <TrialSimulatorModal
        isOpen={showSimulator}
        onClose={() => setShowSimulator(false)}
        trials={trials}
        onRefresh={refreshData}
      />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardProvider>
  );
}
