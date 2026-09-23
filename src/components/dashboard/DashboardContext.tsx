"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { RoleType } from "@/components/layout/Header";

interface DashboardContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  selectedTrialId: string | null;
  setSelectedTrialId: (id: string) => void;
  trials: any[];
  subjects: any[];
  adverseEvents: any[];
  queries: any[];
  loading: boolean;
  refreshData: () => Promise<void>;
  showSimulator: boolean;
  setShowSimulator: (show: boolean) => void;
  pendingSaeCount: number;
  openQueryCount: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleType>("ROLE_PI");
  const [selectedTrialId, setSelectedTrialId] = useState<string | null>(null);
  const [showSimulator, setShowSimulator] = useState(false);

  const [trials, setTrials] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [adverseEvents, setAdverseEvents] = useState<any[]>([]);
  const [queries, setQueries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [trialsRes, subjectsRes, safetyRes, queriesRes] = await Promise.all([
        fetch("/api/trials").then((r) => r.json()),
        fetch("/api/subjects").then((r) => r.json()),
        fetch("/api/safety").then((r) => r.json()),
        fetch("/api/queries").then((r) => r.json()),
      ]);

      if (trialsRes.success) {
        setTrials(trialsRes.trials || []);
        if (!selectedTrialId && trialsRes.trials?.length > 0) {
          setSelectedTrialId(trialsRes.trials[0].id);
        }
      }
      if (subjectsRes.success) {
        setSubjects(subjectsRes.subjects || []);
      }
      if (safetyRes.success) {
        setAdverseEvents(safetyRes.adverseEvents || []);
      }
      if (queriesRes.success) {
        setQueries(queriesRes.queries || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const pendingSaeCount = adverseEvents.filter(
    (ae) => ae.isSeriousnessSae && (!ae.reportedToEthics || !ae.reportedToDcgi)
  ).length;

  const openQueryCount = queries.filter((q) => q.status === "Open").length;

  return (
    <DashboardContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedTrialId,
        setSelectedTrialId,
        trials,
        subjects,
        adverseEvents,
        queries,
        loading,
        refreshData,
        showSimulator,
        setShowSimulator,
        pendingSaeCount,
        openQueryCount,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
