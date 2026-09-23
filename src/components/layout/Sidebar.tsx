"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShieldAlert,
  ClipboardCheck,
  History,
  FileSpreadsheet,
} from "lucide-react";

interface SidebarProps {
  openQueryCount?: number;
  pendingSaeCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  openQueryCount = 0,
  pendingSaeCount = 0,
}) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Portfolio KPIs",
      description: "Recruitment velocity & portfolio health",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard",
    },
    {
      href: "/dashboard/protocols",
      label: "Clinical Protocols",
      description: "CTRI, NDCT 2019 & Ethics milestones",
      icon: FileText,
      isActive: pathname === "/dashboard/protocols",
    },
    {
      href: "/dashboard/ecrf",
      label: "eCRFs & Subjects",
      description: "Prakriti intake & visit timeline",
      icon: Users,
      isActive: pathname === "/dashboard/ecrf",
    },
    {
      href: "/dashboard/safety",
      label: "NPvCC Safety & SAEs",
      description: "24h regulatory countdown & CTCAE",
      icon: ShieldAlert,
      badge: pendingSaeCount > 0 ? pendingSaeCount : undefined,
      badgeColor: "bg-surface-accent text-sienna",
      isActive: pathname === "/dashboard/safety",
    },
    {
      href: "/dashboard/monitoring",
      label: "Site Monitoring",
      description: "SDV Verification & query resolution",
      icon: ClipboardCheck,
      badge: openQueryCount > 0 ? openQueryCount : undefined,
      badgeColor: "bg-text-primary text-background",
      isActive: pathname === "/dashboard/monitoring",
    },
    {
      href: "/dashboard/audit",
      label: "21 CFR Part 11 Audit",
      description: "Chained hash log & verification",
      icon: History,
      isActive: pathname === "/dashboard/audit",
    },
    {
      href: "/dashboard/interoperability",
      label: "FHIR & CDISC Hub",
      description: "NAMASTE codes, ODM & SDTM export",
      icon: FileSpreadsheet,
      isActive: pathname === "/dashboard/interoperability",
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 bg-transparent flex-shrink-0 min-h-[calc(100vh-80px)] py-8 pr-6 flex flex-col justify-between border-r border-border-subtle">
      <div className="space-y-1">
        <div className="px-3 pb-4 text-xs font-sohne text-text-muted font-medium tracking-wide">
          Clinical Workstations
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group w-full text-left p-3 rounded-2xl transition-all flex items-start justify-between gap-3 decoration-transparent ${
                item.isActive
                  ? "bg-surface-card text-text-primary"
                  : "bg-transparent text-text-secondary hover:bg-surface-fog hover:text-text-primary"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-1.5 rounded-lg mt-0.5 transition-colors ${
                    item.isActive
                      ? "text-text-primary bg-background shadow-steep-subtle"
                      : "text-text-muted group-hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium font-sohne flex items-center gap-2">
                    <span>{item.label}</span>
                  </div>
                  <div
                    className={`text-xs mt-0.5 line-clamp-1 font-sohne ${
                      item.isActive ? "text-text-secondary" : "text-text-muted"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-xs font-sohne px-2 py-0.5 rounded-full font-medium ${
                    item.badgeColor || "bg-surface-card text-text-primary"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer Info Pod */}
      <div className="mt-8 p-5 steep-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sohne text-xs text-text-secondary font-medium">Data Integrity</span>
          <span className="text-text-primary font-medium text-xs font-sohne px-2 py-0.5 rounded-full bg-background border border-border-subtle shadow-steep-subtle">ALCOA+</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary text-xs font-sohne">
          <span>Standard</span>
          <span className="text-text-primary font-medium">NDCT Rules 2019</span>
        </div>
        <div className="flex items-center justify-between text-text-secondary text-xs font-sohne">
          <span>Interoperability</span>
          <span className="text-text-primary font-medium">FHIR R4 / CDISC</span>
        </div>
        <div className="pt-3 border-t border-border-subtle text-xs font-sohne text-text-muted leading-relaxed">
          CERT-In &amp; ISO/IEC 27001 secure cloud research node.
        </div>
      </div>
    </aside>
  );
};
