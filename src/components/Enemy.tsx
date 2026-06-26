import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'motion/react';
import { AlertCircle, XCircle } from 'lucide-react';
import { staggerContainer, fadeUp, sectionHeader, staggerFast, fadeUpFast } from '../lib/motion-variants';

const PAIN_POINTS = [
  "Fake factories acting as middlemen",
  "Zero transparency on actual production lead times",
  "Bait-and-switch sampling quality",
  "Communication barriers causing costly errors",
  "Hidden fees and sudden MOQ increases"
];

export function Enemy() {
  const enemyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: enemyScroll } = useScroll({
    target: enemyRef,
    offset: ["start 0.7", "end 0.4"],
  });

  // Problem side: starts full, dims as you scroll
  const problemOpacity  = useTransform(enemyScroll, [0, 0.5, 1], [1, 0.85, 0.6]);
  const problemScale    = useTransform(enemyScroll, [0, 1], [1, 0.98]);
  const problemGrayscale = useTransform(enemyScroll, [0, 1], [0, 100]); // % grayscale filter
  const problemFilter = useMotionTemplate`grayscale(${problemGrayscale}%)`;

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
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        <motion.p variants={sectionHeader} className="section-label text-center mb-8">
          Why Bazepoint
        </motion.p>
        
        <div className="max-w-4xl mx-auto bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          
          {/* Subtle Warning Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bz-amber)] to-transparent opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: The Problem */}
            <motion.div style={{ opacity: problemOpacity, scale: problemScale, filter: problemFilter }} className="will-change-transform">
              <motion.div variants={sectionHeader}>
                <div className="flex items-center gap-2 text-[var(--color-bz-amber)] mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-body font-bold uppercase tracking-wider">The Reality</span>
                </div>
                <h2 id="trap-title" className="text-3xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-4 leading-snug">
                  The reality of unassisted sourcing.
                </h2>
                <p className="text-base text-[var(--color-bz-text-muted)] font-body leading-relaxed mb-6">
                  Most founders spend 4–8 weeks on Alibaba, WhatsApp groups, and cold emails before getting a single real quote. Half never get a quality sample. You didn't start a business to become a sourcing expert.
                </p>
              </motion.div>
              
              <motion.ul variants={staggerFast} className="space-y-3">
                {PAIN_POINTS.map((point, i) => (
                  <motion.li key={i} variants={fadeUpFast} className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-[var(--color-bz-border-strong)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-body text-[var(--color-bz-text-muted)]">{point}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
            
            {/* Right: The Solution Contrast */}
            <motion.div variants={fadeUp} style={{ opacity: solutionOpacity, scale: solutionScale }} className="bg-[var(--color-bz-bg)] border border-[var(--color-bz-border)] rounded-xl p-6 md:p-8 will-change-transform">
              <h3 className="text-xl font-display font-[800] tracking-[-0.5px] text-[var(--color-bz-text)] mb-4">
                Founders move faster with Baze.
              </h3>
              <p className="text-sm font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-6">
                Describe what you want to make in plain language. Baze searches a network of audited factories, filters by your MOQ and budget, and hands you a pre-written first email — ready to send in under a minute.
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-bz-border)]">
                <div className="flex-1 text-center">
                  <div className="text-2xl font-display font-[800] text-[var(--color-bz-text)] mb-1">0</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Fake Brokers</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-bz-border)]"></div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-display font-[800] text-[var(--color-bz-text)] mb-1">&lt;1min</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">To First Email</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-bz-border)]"></div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-display font-[800] text-[var(--color-bz-teal)] mb-1">100%</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Verified Capacity</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        <motion.div
          variants={fadeUp}
          className="max-w-2xl mx-auto mt-10 bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[rgba(184,226,242,0.3)] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#4A9EBF] font-body">
              R
            </div>
            <div>
              <p className="text-base font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-4">
                "I spent 3 weeks trying to find a reliable hoodie manufacturer through Alibaba — got ghosted 6 times. Tried Bazepoint, had 2 verified factories in my inbox the same day and my first email was already written. We shipped our first 200 units within 45 days."
              </p>
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-sm font-body font-semibold text-[var(--color-bz-text)]">Riya S.</p>
                  <p className="text-xs font-body text-[var(--color-bz-text-faint)]">DTC Apparel Brand, Bangalore</p>
                </div>
                <div className="ml-auto bg-[rgba(184,226,242,0.2)] text-[#4A9EBF] border border-[rgba(184,226,242,0.4)] rounded-full px-3 py-1 text-[11px] font-body font-semibold uppercase tracking-wider">
                  Early Access
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </motion.section>
  );
}
