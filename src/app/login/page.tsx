"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROLE_DEFINITIONS, RoleType } from "@/components/layout/Header";
import { AyuCareLogo } from "@/components/layout/AyuCareLogo";

export default function LoginPage() {
  const router = useRouter();

  // Clear any existing role on mount so they have to "login"
  useEffect(() => {
    localStorage.removeItem("ayucare_role");
  }, []);

  const handleLogin = (role: string) => {
    localStorage.setItem("ayucare_role", role);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-4xl w-full mx-auto space-y-12 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-surface-card border border-border-subtle flex items-center justify-center shadow-steep-subtle">
            <AyuCareLogo className="w-8 h-8 text-text-primary" />
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-signifier font-medium tracking-tight text-text-primary">
              Welcome to AyuCare
            </h1>
            <p className="text-body-lg text-text-secondary font-sohne mt-3 max-w-lg mx-auto">
              Please select your designated clinical role to access the workspace.
            </p>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(ROLE_DEFINITIONS).map(([roleKey, def]) => (
            <button
              key={roleKey}
              onClick={() => handleLogin(roleKey)}
              className="steep-card bg-surface-card border-border-subtle hover:border-text-primary hover:shadow-steep-subtle-2 transition-all duration-300 group text-left flex flex-col justify-between"
            >
              <div>
                <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full ${def.color}`}>
                  {def.badge}
                </span>
                <h2 className="text-xl font-signifier text-text-primary mt-4 group-hover:text-sienna transition-colors">
                  {def.label}
                </h2>
                <p className="text-sm font-sohne text-text-secondary mt-1">
                  {def.name}
                </p>
              </div>
              <div className="pt-6 border-t border-border-subtle mt-6 flex items-center justify-between text-xs font-sohne text-text-muted group-hover:text-text-primary transition-colors">
                <span>Click to Login &rarr;</span>
                <span>{roleKey}</span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-center text-xs font-sohne text-text-muted mt-12">
          Demo Mode: Authentication is bypassed for review purposes.
        </div>
      </div>
    </div>
  );
}
