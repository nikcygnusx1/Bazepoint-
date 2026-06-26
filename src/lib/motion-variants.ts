// src/lib/motion-variants.ts
// Central motion variant library for Bazepoint
// Import these in components instead of defining inline variants

import type { Variants } from "motion/react";

// ─── EASING CURVES ───────────────────────────────────────────────────────────
// Named easing arrays matching the design system tokens

export const EASE_OUT_EXPO  = [0.16, 1, 0.3, 1]    as const;
export const EASE_SPRING    = [0.34, 1.56, 0.64, 1] as const;
export const EASE_SMOOTH    = [0.37, 0, 0.63, 1]    as const;
export const EASE_IN_QUART  = [0.76, 0, 0.24, 1]    as const;

// ─── FADE & SLIDE VARIANTS ──────────────────────────────────────────────────

/** Simple fade in — for background elements, overlays */
export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

/** Fade up — the default reveal for most content blocks */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

/** Fade up — faster, for small UI elements like chips, labels, badges */
export const fadeUpFast: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
};

/** Fade in from left — for step titles, left-column content */
export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5,  ease: EASE_OUT_EXPO } },
};

/** Fade in from right — for step visual cards, right-column content */
export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.5,  ease: EASE_OUT_EXPO } },
};

/** Fade down — for nav items, dropdowns entering from above */
export const fadeDown: Variants = {
  hidden:  { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.4,  ease: EASE_OUT_EXPO } },
};

// ─── SCALE VARIANTS ──────────────────────────────────────────────────────────

/** Scale up from 95% — for cards, panels, modals */
export const scaleUp: Variants = {
  hidden:  { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
};

/** Scale spring — for interactive feedback (button press, card pop) */
export const scaleSpring: Variants = {
  hidden:  { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5,  ease: EASE_SPRING } },
};

// ─── CONTAINER / STAGGER VARIANTS ──────────────────────────────────────────

/** Default stagger container — wraps a list of children that fadeUp in sequence */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Faster stagger — for small chips, tags, icon rows */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

/** Slower stagger — for large cards, image grids */
export const staggerSlow: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// ─── HERO-SPECIFIC VARIANTS ──────────────────────────────────────────────────

/** Hero container — orchestrates the entire hero section entry */
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,  // slight page-load delay before hero animates
    },
  },
};

/** Hero eyebrow label above headline */
export const heroLabel: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
};

/** Hero headline — each line if split, or the h1 block */
export const heroHeadline: Variants = {
  hidden:  { opacity: 0, y: 32, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

/** Hero subtext / description line */
export const heroSubtext: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT_EXPO } },
};

/** Hero CTA button / prompt card entry */
export const heroCta: Variants = {
  hidden:  { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

/** Hero social proof / stats bar below the CTA */
export const heroStats: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

// ─── SECTION-SPECIFIC VARIANTS ──────────────────────────────────────────────

/** Section header block (label + headline + subline together) */
export const sectionHeader: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
};

/** Card item — used in Supply (manufacturer cards), PromptDemo result cards */
export const cardItem: Variants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

/** Step band — used in Mechanism for each horizontal step row */
export const stepBand: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

/** Step visual card (right column in Mechanism) — offset reveal */
export const stepVisual: Variants = {
  hidden:  { opacity: 0, x: 16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO, delay: 0.15 },
  },
};

// ─── NAV VARIANTS ────────────────────────────────────────────────────────────

/** Nav container — orchestrates nav item entrance on load */
export const navContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

/** Individual nav link */
export const navItem: Variants = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT_EXPO } },
};

// ─── UTILITY VARIANTS ──────────────────────────────────────────────────────

/** Clip reveal from bottom — for lines, underlines, dividers */
export const clipRevealBottom: Variants = {
  hidden:  { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

/** Width expand — for underline animations, progress fills */
export const expandWidth: Variants = {
  hidden:  { scaleX: 0, transformOrigin: "left center" },
  visible: {
    scaleX: 1,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

/** Number count-up — use with a useMotionValue + useTransform for counting  */
export const numberReveal: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
};
