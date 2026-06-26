import type { Variants } from "motion/react";

// The one easing curve used for all hero and console animations
export const EASE_HERO = [0.16, 1, 0.3, 1] as [number, number, number, number];

// The one reveal variant used for every below-fold section and content block
export const revealVariant: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_HERO },
  },
};

// The one button hover pattern — spread onto every <motion.button> and <motion.a> CTA
export const buttonHoverProps = {
  whileHover: { scale: 1.03, transition: { duration: 0.18, ease: EASE_HERO } },
  whileTap:   { scale: 0.97, transition: { duration: 0.1 } },
};

// The one card hover pattern — spread onto every factory card, region pin, social proof card
export const cardHoverProps = {
  whileHover: { y: -3, transition: { duration: 0.22, ease: EASE_HERO } },
};

// Keep existing navContainer and navItem exports exactly as they are — do not remove them
export const navContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

export const navItem: Variants = {
  hidden:  { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_HERO } },
};

// Hero structural variants for choreography
export const heroContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const heroLabel: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_HERO } }
};

export const heroHeadline: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_HERO } }
};

export const heroSubtext: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_HERO } }
};

export const heroCta: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_HERO } }
};

export const heroStats: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_HERO } }
};
