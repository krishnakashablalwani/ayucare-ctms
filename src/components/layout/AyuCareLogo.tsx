"use client";

import React from "react";

export const AyuCareLogo: React.FC<{ className?: string; alt?: string }> = ({
  className = "w-8 h-8",
  alt = "AyuCare Logo",
}) => {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`object-contain inline-block shrink-0 ${className}`}
    />
  );
};

