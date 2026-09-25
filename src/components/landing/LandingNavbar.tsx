"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "../theme/ThemeToggle";
import { AyuCareLogo } from "../layout/AyuCareLogo";

export const LandingNavbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border-subtle py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-steep mx-auto px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo — Left */}
        <Link href="/" className="flex items-center gap-3 group decoration-transparent">
          <AyuCareLogo className="w-9 h-9 text-text-primary transition-transform group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="font-signifier text-[22px] tracking-tight text-text-primary leading-none">
              AyuCare
            </span>
          </div>
        </Link>

        {/* Nav — Center */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#overview" className="steep-nav-link text-sm">
            Platform
          </a>
          <a href="#features" className="steep-nav-link text-sm">
            Features
          </a>
          <a href="#workflow" className="steep-nav-link text-sm">
            Workflow
          </a>
          <a href="#compliance" className="steep-nav-link text-sm">
            Compliance
          </a>
        </nav>

        {/* Actions — Right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <Link
            href="/login"
            className="steep-text-link hidden sm:inline-flex text-sm text-text-secondary"
          >
            Sign in
          </Link>

          <Link
            href="/login"
            className="steep-pill-filled text-sm py-2 px-5"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};
