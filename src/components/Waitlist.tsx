import { motion } from 'motion/react';
import { WaitlistForm } from './WaitlistForm';
import { WordReveal } from './WordReveal';

export function Waitlist() {
  const headlineText = "Your first factory is 3 prompts away.";
  
  return (
    <motion.section
      id="waitlist"
      aria-labelledby="waitlist-title"
      className="py-20 md:py-32 bg-[var(--color-bz-bg)] relative overflow-hidden flex flex-col items-center justify-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {/* Subtle Radial Gradient Background that fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.04 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,var(--color-bz-teal)_0%,transparent_70%)]"
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 w-full relative z-10 flex flex-col items-center text-center">
        
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-label mb-6"
        >
          Waitlist
        </motion.p>

        {/* Headline Word-by-Word Reveal */}
        <h2 id="waitlist-title" className="text-3xl md:text-5xl font-display font-[800] tracking-[-1.5px] text-[var(--color-bz-text)] mb-6 max-w-2xl leading-[1.1]">
          <WordReveal text={headlineText} delay={0.1} />
        </h2>

        {/* Subline Fades in as Block after Headline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-[var(--color-bz-text-muted)] font-body max-w-lg mb-12 leading-relaxed"
        >
          Bazepoint is in private beta. We're letting in 500 founders who are serious about building real products. Get early access before we open to the public.
        </motion.p>

        {/* Form Container Scales from 0.96 with Spring Easing */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: 0.7,
            type: 'spring',
            stiffness: 120,
            damping: 20
          }}
          className="w-full max-w-md bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 shadow-md relative overflow-hidden"
        >
          {/* Top Decorative Border Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bz-teal)] to-transparent opacity-60"></div>
          
          <WaitlistForm />
        </motion.div>

      </div>
    </motion.section>
  );
}
