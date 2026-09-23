"use client";

import React from "react";

export const AyuCareLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Stylized Serif 'A' */}
      <path 
        d="M49 18L26 80H38L42 67H61L65 80H77L55 18H49ZM45 55L51.5 33L58 55H45Z" 
        fill="currentColor" 
      />
      
      {/* Leaf Motif */}
      <path 
        d="M27 63 C 27 40, 55 35, 80 25 C 80 25, 80 50, 60 65 C 40 75, 27 63, 27 63 Z" 
        fill="var(--bg-primary)" 
        stroke="currentColor" 
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Leaf Vein */}
      <path 
        d="M27 63 C 45 55, 65 42, 80 25" 
        stroke="currentColor" 
        strokeWidth="3.5" 
        strokeLinecap="round"
      />
    </svg>
  );
};
