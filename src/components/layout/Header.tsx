"use client";

import React from "react";
import Link from "next/link";
import { UserCheck, Zap } from "lucide-react";
import { ThemeToggle } from "../theme/ThemeToggle";
import { AyuCareLogo } from "./AyuCareLogo";

export type RoleType =
  | "ROLE_PI"
  | "ROLE_CRC"
  | "ROLE_MONITOR"
  | "ROLE_ETHICS"
  | "ROLE_NPVCC"
  | "ROLE_AUDITOR";

export const ROLE_DEFINITIONS: Record<
  RoleType,
  { label: string; name: string; badge: string; color: string }
> = {
  ROLE_PI: {
    label: "Principal Investigator",
    name: "Prof. (Dr.) Tanuja Nesari",
    badge: "PI OVERSIGHT",
    color: "bg-surface-elevated text-text-primary border border-border-subtle",
  },
  ROLE_CRC: {
    label: "Study Coordinator",
    name: "Dr. Rajiv Verma",
    badge: "CLINICAL INTAKE",
    color: "bg-surface-elevated text-text-primary border border-border-subtle",
  },
  ROLE_MONITOR: {
    label: "Clinical Monitor",
    name: "Dr. Ananya Mishra",
    badge: "100% SDV MONITOR",
    color: "bg-surface-elevated text-text-primary border border-border-subtle",
  },
  ROLE_ETHICS: {
    label: "Ethics Committee",
    name: "Institutional Ethics Board",
    badge: "REGULATORY GOVERNANCE",
    color: "bg-surface-elevated text-text-primary border border-border-subtle",
  },
  ROLE_NPVCC: {
    label: "Pharmacovigilance",
    name: "Dr. Sunita Pathak",
    badge: "SAFETY SURVEILLANCE",
    color: "bg-surface-accent text-sienna border border-sienna/20",
  },
  ROLE_AUDITOR: {
    label: "Regulatory Auditor",
    name: "CDSCO Inspection Office",
    badge: "21 CFR 11 INSPECTION",
    color: "bg-surface-elevated text-text-primary border border-border-subtle",
  },
};

interface HeaderProps {
  currentRole: RoleType;
  onRoleChange: (role: RoleType) => void;
  onOpenSimulator: () => void;
  activeSaeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenSimulator,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border-subtle transition-colors duration-200">
      <div className="max-w-steep mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          title="Return to Landing Page"
          className="group flex items-center gap-3 decoration-transparent"
        >
          <AyuCareLogo className="w-8 h-8 text-text-primary transition-transform group-hover:scale-105" />
          <span className="font-signifier text-xl font-medium tracking-tight text-text-primary hidden sm:block">
            AyuCare<span className="text-text-secondary italic">CTMS</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          <button
            onClick={onOpenSimulator}
            className="steep-text-link text-sm hidden sm:inline-flex"
            title="Simulation Lab"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Sim Lab</span>
          </button>

          <ThemeToggle />

          <div className="h-4 w-px bg-border-subtle hidden sm:block" />

          <div className="relative flex items-center gap-2 text-text-primary hover:text-text-secondary transition-colors">
            <UserCheck className="w-4 h-4 hidden sm:block" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value as RoleType)}
              className="bg-transparent text-sm font-sohne font-medium focus:outline-none cursor-pointer appearance-none pr-4"
            >
              {Object.entries(ROLE_DEFINITIONS).map(([key, def]) => (
                <option key={key} value={key} className="bg-background text-text-primary">
                  {def.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
