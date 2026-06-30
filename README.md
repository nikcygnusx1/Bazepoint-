# Bazepoint — Sourcing Platform

From idea to your doorstep. The AI sourcing agent that takes a founder from "I have a product idea" to a verified factory and a paid, produced order, with trust built into every transaction.

## Project Overview

Bazepoint reads user intent, searches verified factories across the Middle East, Southeast Asia, and Oceania, and hands back matches you can act on in one click. Founders describe what they want in plain language, and Bazepoint does the rest, end to end.

## Tech Stack
- **React**: v19
- **Vite**: v6
- **Tailwind CSS**: v4
- **Motion (Framer Motion)**: v12 (under `motion/react`)
- **Lenis Scroll**: Smooth momentum scrolling

## How to Run Locally

1. **Clone the Repository**
   ```bash
   git clone https://github.com/nikcygnusx1/Bazepoint-.git
   cd Bazepoint-
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` or `.env.local` file:
   ```env
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your-form-id
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Folder Structure

```
Bazepoint-repo/
├── src/
│   ├── components/       # UI Components (Header, Hero, BazeConsole, Enemy, Mechanism, Supply, FinalPush, Waitlist, Footer)
│   ├── lib/              # Hooks, motion variants, and data configurations
│   ├── App.tsx           # Narrative layout spine
│   ├── index.css         # Typography, global CSS and Tailwind custom theme tokens
│   └── main.tsx          # App bootstrapper
└── package.json          # Dependency definition
```

## Design Token Reference

Our brand design system is strictly locked via custom CSS variables in `src/index.css`:

- **Backdrop Background**: `var(--color-bz-bg)` (`#FAFAF9` - Alabaster / Sand)
- **Component Surface**: `var(--color-bz-surface)` (`#FFFFFF`)
- **Primary Accent (Teal)**: `var(--color-bz-teal)` (`#0D9488` / `#00C8B0` inside Console)
- **Secondary Accent (Amber)**: `var(--color-bz-amber)` (`#D97706` / `#F5A623` inside Console)
- **Typography**: Satoshi (Body), Instrument Serif (Display), JetBrains Mono (Console)

## Roadmap / Current Progress
- [x] Initial design system and component structure
- [x] Comprehensive README
- [x] WordReveal component for headline stagger animations
- [x] useCountUp hook for animating stats/metrics
- [x] Section copy refinements (direct second-person tone)
- [x] Scroll-driven motion enhancements
- [x] Integrated waitlist subscription section with Formspree and modal drawer

## Contact
Nikhil Sharma: nikhil@bazepoint.com
