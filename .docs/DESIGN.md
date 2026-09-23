---
name: Obsidian Telemetry Clinical Command
colors:
  surface: '#0f141b'
  surface-dim: '#0f141b'
  surface-bright: '#353941'
  surface-container-lowest: '#070b12'
  surface-container-low: '#0b1120'
  surface-container: '#111827'
  surface-container-high: '#1e293b'
  surface-container-highest: '#334155'
  on-surface: '#f8fafc'
  on-surface-variant: '#94a3b8'
  inverse-surface: '#f8fafc'
  inverse-on-surface: '#0f172a'
  outline: '#334155'
  outline-variant: 'rgba(255, 255, 255, 0.08)'
  surface-tint: '#06b6d4'
  primary: '#06b6d4'
  on-primary: '#070b12'
  primary-container: '#0891b2'
  on-primary-container: '#ecfeff'
  inverse-primary: '#00687a'
  secondary: '#10b981'
  on-secondary: '#070b12'
  secondary-container: '#059669'
  on-secondary-container: '#ecfdf5'
  tertiary: '#f59e0b'
  on-tertiary: '#070b12'
  tertiary-container: '#d97706'
  on-tertiary-container: '#fffbeb'
  error: '#ef4444'
  on-error: '#ffffff'
  error-container: '#991b1b'
  on-error-container: '#fef2f2'
  background: '#070b12'
  on-background: '#f8fafc'
  surface-variant: '#1e293b'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  telemetry-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0.02em
  telemetry-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
  telemetry-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 15px
    letterSpacing: 0.05em
rounded:
  sm: 4px
  DEFAULT: 6px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
---

# Design System: Obsidian Telemetry Clinical Command
**Stitch Project ID:** `9421764832807818493`  
**Asset ID:** `assets/08b0904b212342c6a15e07a96a658cc5`  
**System Designation:** AyuCare-CTMS (All India Institute of Ayurveda & Ministry of Ayush, Govt. of India)

---

## 1. Visual Theme & Atmosphere
The design system establishes a clinical-grade, institutional command center tailored for clinical trial management systems (CTMS) and statutory regulatory bodies (CDSCO, FDA 21 CFR Part 11, CDISC ODM, ICH-GCP).

The aesthetic merges **Glassmorphic Tactical HUD** structures with **High-Density Technical Functionalism**. The UI eliminates decorative fluff in favor of tactical data projection: razor-sharp translucent containment fields, 24px micro-grid overlay, luminescent signal vectors, and status-driven chromatic state changes. The target emotional response is total command clarity, sovereign cryptographic integrity, and effortless cognitive parsing under life-critical clinical monitoring demands.

---

## 2. Color Palette & Roles

| Token Name | Hex Value | Role & Clinical Assignment |
|------------|-----------|----------------------------|
| **Obsidian Canvas** | `#070b12` | Main page ground with 24px micro-grid overlay; infinite depth without muddy tint |
| **HUD Panel Surface** | `#0b1120` | Translucent container cards (75% opacity, 16px backdrop blur, 1px border) |
| **Elevated Module** | `#0f172a` | Elevated modal drawers, dropdown flyouts, active tab highlights |
| **Surgical Bio-Cyan** | `#06b6d4` | Primary action beacon, active telemetry streams, primary CTAs, active protocol links |
| **Cyan Glow** | `#22d3ee` | Interactive hover highlights, focus rings, beacon halos |
| **Certified Bio-Emerald** | `#10b981` | ICH-GCP certifications, ALCOA+ status, valid cryptographic hashes, nominal telemetry |
| **Safety Amber** | `#f59e0b` | Pharmacovigilance watches, pending ethics committee reviews, minor adverse reactions |
| **Emergency Crimson** | `#ef4444` | Unblinded SAE escalations, protocol violations, critical audit discrepancies |
| **Pure White** | `#ffffff` | Primary text and crisp contrast in light mode surfaces |
| **Ghost Slate Border** | `rgba(255,255,255,0.08)` | Razor-thin structural segmentation lines (replaces heavy default borders) |

---

## 3. Typography Rules
Three distinct typographical pillars, rigorously applied without mixing or serif contamination:

1. **Display & Headers (`Sora`)**:
   - Geometrically disciplined, authoritative, clinical presence.
   - Tight letter-spacing (`-0.02em` to `-0.025em`).
   - Used exclusively for institutional brand titles, section headings, and module titles.
   - **Strict Rule:** Never use serif fonts (Times New Roman, Georgia) anywhere in the application.

2. **Prose & Interface (`Inter`)**:
   - Crystal-clear neutral legibility for clinical trial protocols, subject data, form fields, and documentation.
   - Consistent line-heights (`1.5` to `1.6`) for rapid scanning during monitoring audits.

3. **Telemetry & Data (`JetBrains Mono`)**:
   - Monospaced tabular alignment for CTRI registration identifiers (`CTRI/2025/03/084129`), Subject IDs (`SUBJ-AIIA-0042`), SHA-256 validation blocks, Dosha ratios (Vata 38%, Pitta 44%, Kapha 18%), and dosage timers.

---

## 4. Component Stylings

### Tactical Buttons
- **Primary Execution Button (`.btn-hud-primary`)**:
  - Background: Solid Surgical Bio-Cyan (`#06b6d4`)
  - Text: Dark Obsidian (`#070b12`), 600 weight, uppercase tracking
  - Border: None
  - Hover: Illuminates to `#22d3ee` with cyan ambient glow `0 0 14px rgba(6, 182, 212, 0.4)`
- **Secondary Instrument Button (`.btn-hud-secondary`)**:
  - Background: Translucent Slate (`rgba(15, 23, 42, 0.6)`)
  - Border: 1px `rgba(255, 255, 255, 0.12)` (transitions to Cyan on hover)
  - Text: `#f8fafc`

### HUD Telemetry Cards (`.hud-card`)
- Background: `rgba(11, 17, 32, 0.75)` (dark) / `#ffffff` with subtle border (light)
- Backdrop Blur: `16px`
- Border: `1px solid rgba(255, 255, 255, 0.08)` (dark) / `1px solid #e2e8f0` (light)
- Radius: `8px` to `12px`
- Headers: Micro section tag in upper-left corner (e.g. `SEC-02 // eCRF & PRAKRITI`)

### Status Pips & Beacons (`.pulse-beacon`)
- Active telemetry indicator: 6px circular pip in Bio-Emerald (`#10b981`) or Bio-Cyan (`#06b6d4`)
- Infinite subtle scale animation: `0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.15); }`

---

## 5. Layout Principles
- **12-Column Grid**: Engineered for clinical command centers and multi-site monitoring displays.
- **Micro-Grid Backdrop**: 24px subtle coordinate grid (`rgba(255, 255, 255, 0.02)`) providing spatial reference.
- **Zero Muddy Canvas**: Absolute elimination of dingy grey/beige `#ecece9` backgrounds. Surfaces are either deep obsidian blue-black or crisp pearlescent white.
