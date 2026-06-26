/*
═══════════════════════════════════════════════════════════════
  BAZEPOINT — PHASE 3 PRODUCTION AUDIT CONCLUSIONS
═══════════════════════════════════════════════════════════════
*/

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AlertCircle, XCircle, Shield, CheckCircle2 } from 'lucide-react';
import { revealVariant, cardHoverProps } from '../lib/motion-variants';

const PAIN_POINTS = [
  "Factories ghost you after 3 weeks of emails",
  "Samples look great; production batch looks nothing like it",
  "Agent says MOQ is 200. It quietly becomes 1,000.",
  "Every lead time is 'around 4 weeks' — never actually 4 weeks",
  "You don't know if the factory is real until you've already paid"
];

export function Enemy() {
  const enemyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: enemyScroll } = useScroll({
    target: enemyRef,
    offset: ["start 0.7", "end 0.4"],
  });

  // Problem side: starts full, dims as you scroll (opacity/scale transition, no filter for cross-browser stability)
  const problemOpacity  = useTransform(enemyScroll, [0, 0.5, 1], [1, 0.85, 0.6]);
  const problemScale    = useTransform(enemyScroll, [0, 1], [1, 0.98]);

  // Solution side: starts dimmer, comes to full as you scroll
  const solutionOpacity = useTransform(enemyScroll, [0, 0.4, 1], [0.7, 0.85, 1]);
  const solutionScale   = useTransform(enemyScroll, [0, 1], [0.97, 1]);

  return (
    <motion.section 
      id="trap"
      aria-labelledby="trap-title"
      ref={enemyRef}
      className="py-24 bg-[var(--color-bz-bg)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        <p className="section-label text-center mb-8">
          Why Bazepoint
        </p>
        
        <div className="max-w-4xl mx-auto bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          
          {/* Subtle Warning Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bz-amber)] to-transparent opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: The Problem */}
            <motion.div style={{ opacity: problemOpacity, scale: problemScale }} className="will-change-transform">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-bz-amber)] mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-body font-bold uppercase tracking-wider">The Reality</span>
                </div>
                <h2 id="trap-title" className="text-3xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-4 leading-snug">
                  This is what sourcing actually looks like.
                </h2>
                <p className="text-base text-[var(--color-bz-text-muted)] font-body leading-relaxed mb-6">
                  Most first-time founders spend 4–8 weeks chasing factories on Alibaba, random WhatsApp groups, and Fiverr agents — and still end up with a bad sample or a ghosted inbox. You didn't start a company to become a supply chain expert.
                </p>
              </div>
              
              <motion.ul variants={revealVariant} className="space-y-3">
                {PAIN_POINTS.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-[var(--color-bz-border-strong)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-body text-[var(--color-bz-text-muted)]">{point}</span>
                  </li>
                ))}
              </motion.ul>
            </motion.div>
            
            {/* Right: The Solution Contrast */}
            <motion.div style={{ opacity: solutionOpacity, scale: solutionScale }} className="bg-[var(--color-bz-bg)] border border-[var(--color-bz-border)] rounded-xl p-6 md:p-8 will-change-transform flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-[800] tracking-[-0.5px] text-[var(--color-bz-text)] mb-4">
                  Baze does the hard part for you.
                </h3>
                <p className="text-sm font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-6">
                  Describe what you want to make in plain language. Baze finds verified factories, filters by your MOQ and budget, and writes your first outreach email. From brief to factory inbox in under a minute.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4 pt-6 border-t border-[var(--color-bz-border)] w-full">
                <div className="flex-1 min-w-[70px] text-center">
                  <div className="text-xl sm:text-2xl font-display font-[800] text-[var(--color-bz-text)] mb-1 tabular-nums whitespace-nowrap">0</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body leading-tight">Fake Brokers</div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[var(--color-bz-border)] flex-shrink-0"></div>
                <div className="flex-1 min-w-[90px] text-center">
                  <div className="text-xl sm:text-2xl font-display font-[800] text-[var(--color-bz-text)] mb-1 tabular-nums whitespace-nowrap">&lt;1min</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body leading-tight">Brief to First Email</div>
                </div>
                <div className="hidden sm:block w-px h-8 bg-[var(--color-bz-border)] flex-shrink-0"></div>
                <div className="flex-1 min-w-[70px] text-center">
                  <div className="text-xl sm:text-2xl font-display font-[800] text-[var(--color-bz-teal)] mb-1 tabular-nums whitespace-nowrap">100%</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body leading-tight">Vetted Only</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Safeguards Horizontal 3-column Grid */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div 
            variants={revealVariant}
            className="bg-[var(--color-bz-surface)] p-6 rounded-xl border border-[var(--color-bz-border)] shadow-sm"
          >
            <Shield className="w-5 h-5 text-[var(--color-bz-teal-dark)] mb-3" />
            <h3 className="text-base font-body font-bold text-[var(--color-bz-text)] mb-2">Verified Identity</h3>
            <p className="text-xs text-[var(--color-bz-text-muted)] leading-relaxed">
              Every factory undergoes strict business license and identity verification before joining our network.
            </p>
          </motion.div>
          <motion.div 
            variants={revealVariant}
            className="bg-[var(--color-bz-surface)] p-6 rounded-xl border border-[var(--color-bz-border)] shadow-sm"
          >
            <CheckCircle2 className="w-5 h-5 text-[var(--color-bz-teal-dark)] mb-3" />
            <h3 className="text-base font-body font-bold text-[var(--color-bz-text)] mb-2">Facility Audits</h3>
            <p className="text-xs text-[var(--color-bz-text-muted)] leading-relaxed">
              We review on-site facility photos, capacity claims, and ISO certifications to ensure reality matches spec.
            </p>
          </motion.div>
          <motion.div 
            variants={revealVariant}
            className="bg-[var(--color-bz-surface)] p-6 rounded-xl border border-[var(--color-bz-border)] shadow-sm"
          >
            <AlertCircle className="w-5 h-5 text-[var(--color-bz-teal-dark)] mb-3" />
            <h3 className="text-base font-body font-bold text-[var(--color-bz-text)] mb-2">Quality & Escrow</h3>
            <p className="text-xs text-[var(--color-bz-text-muted)] leading-relaxed">
              Past performance, response rates, and production defect history are tracked. Only vetted factories stay in the network.
            </p>
          </motion.div>
        </div>

        {/* Double-stacked Social Proof Cards */}
        <div className="max-w-2xl mx-auto mt-16 flex flex-col gap-4">
          <motion.div
            variants={revealVariant}
            {...cardHoverProps}
            className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 shadow-sm cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(184,226,242,0.3)] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#4A9EBF] font-body">
                R
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-base font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-4">
                  "I spent 3 weeks trying to find a reliable hoodie manufacturer through Alibaba — got ghosted 6 times. Tried Bazepoint, had 2 verified factories in my inbox the same day and my first email was already written. We shipped our first 200 units within 45 days."
                </p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-body font-semibold text-[var(--color-bz-text)]">Riya S.</p>
                    <p className="text-xs font-body text-[var(--color-bz-text-faint)]">DTC Apparel Brand, Bangalore</p>
                  </div>
                  <div className="bg-[rgba(184,226,242,0.2)] text-[#4A9EBF] border border-[rgba(184,226,242,0.4)] rounded-full px-3 py-1 text-[11px] font-body font-semibold uppercase tracking-wider">
                    Early Access
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={revealVariant}
            {...cardHoverProps}
            className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 shadow-sm cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(184,226,242,0.3)] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#4A9EBF] font-body">
                M
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-base font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-4">
                  "We were launching a private label supplement line and had zero factory connections. Bazepoint found us a halal-certified UAE lab in the same day. The draft email they wrote got a reply within 48 hours. Couldn't have done it without it."
                </p>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    <p className="text-sm font-body font-semibold text-[var(--color-bz-text)]">Marco T.</p>
                    <p className="text-xs font-body text-[var(--color-bz-text-faint)]">Wellness Brand, Dubai</p>
                  </div>
                  <div className="bg-[rgba(184,226,242,0.2)] text-[#4A9EBF] border border-[rgba(184,226,242,0.4)] rounded-full px-3 py-1 text-[11px] font-body font-semibold uppercase tracking-wider">
                    Early Access
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.section>
  );
}
