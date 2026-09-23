import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Steep Core Palette — via CSS custom properties for theme switching */
        ink: "var(--color-ink-black)",
        paper: "var(--color-paper-white)",
        mist: "var(--color-mist-gray)",
        fog: "var(--color-fog-white)",
        "slate-gray": "var(--color-slate-gray)",
        ash: "var(--color-ash-gray)",
        smoke: "var(--color-smoke-gray)",
        blush: "var(--color-blush-peach)",
        sienna: "var(--color-sienna-brown)",

        /* Semantic */
        background: "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",
        "bg-floating": "var(--bg-floating)",
        foreground: "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-muted": "var(--text-muted)",
        "border-subtle": "var(--border-subtle)",
        "border-hairline": "var(--border-hairline)",

        /* Surfaces */
        "surface-canvas": "var(--surface-canvas)",
        "surface-card": "var(--surface-card-mist)",
        "surface-fog": "var(--surface-section-fog)",
        "surface-accent": "var(--surface-accent-blush)",
        "surface-elevated": "var(--surface-elevated-white)",
      },
      fontFamily: {
        signifier: [
          "'Source Serif 4'",
          "Georgia",
          "'Times New Roman'",
          "ui-serif",
          "serif",
        ],
        sohne: [
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        caption: ["15px", { lineHeight: "1.5" }],
        body: ["17px", { lineHeight: "1.35" }],
        "body-lg": ["20px", { lineHeight: "1.35" }],
        subheading: ["22px", { lineHeight: "1.5" }],
        "heading-sm": [
          "26px",
          { lineHeight: "1.18", letterSpacing: "-0.23px" },
        ],
        heading: ["44px", { lineHeight: "1.3", letterSpacing: "-0.66px" }],
        "heading-lg": [
          "64px",
          { lineHeight: "1.3", letterSpacing: "-0.96px" },
        ],
        display: ["90px", { lineHeight: "1.3", letterSpacing: "-2.25px" }],
      },
      borderRadius: {
        cards: "24px",
        images: "12px",
        inputs: "16px",
        buttons: "9999px",
        smallcards: "16px",
        elevatedcards: "20px",
      },
      spacing: {
        "steep-4": "4px",
        "steep-8": "8px",
        "steep-12": "12px",
        "steep-16": "16px",
        "steep-20": "20px",
        "steep-24": "24px",
        "steep-28": "28px",
        "steep-32": "32px",
        "steep-40": "40px",
        "steep-64": "64px",
        "steep-80": "80px",
        "steep-96": "96px",
        "steep-124": "124px",
        "steep-128": "128px",
        "steep-160": "160px",
      },
      maxWidth: {
        steep: "1200px",
      },
      boxShadow: {
        "steep-subtle": "var(--shadow-subtle)",
        "steep-subtle-2": "var(--shadow-subtle-2)",
        "steep-subtle-3": "var(--shadow-subtle-3)",
      },
    },
  },
  plugins: [],
};

export default config;
