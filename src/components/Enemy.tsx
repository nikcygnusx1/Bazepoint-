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
      ref={enemyRef}
      className="py-24 bg-[var(--color-bz-bg)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        <div className="max-w-4xl mx-auto bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          
          {/* Subtle Warning Accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bz-amber)] to-transparent opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: The Problem */}
            <motion.div style={{ opacity: problemOpacity, scale: problemScale, filter: problemFilter }} className="will-change-transform">
              <motion.div variants={sectionHeader}>
                <div className="flex items-center gap-2 text-[var(--color-bz-amber)] mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-body font-bold uppercase tracking-wider">The Status Quo</span>
                </div>
                <h2 className="text-3xl font-serif text-[var(--color-bz-text)] mb-4 leading-snug">
                  Sourcing platforms are designed for traders, not founders.
                </h2>
                <p className="text-base text-[var(--color-bz-text-muted)] font-body leading-relaxed mb-6">
                  Legacy directories are flooded with brokers pretending to be factories. You waste weeks filtering through noise, only to end up with unverified suppliers and poor quality control.
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
              <h3 className="text-xl font-serif text-[var(--color-bz-text)] mb-4">
                Bazepoint changes the equation.
              </h3>
              <p className="text-sm font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-6">
                We replace the directory with an intelligent agent. You describe your product, and our AI matches you exclusively with audited, founder-friendly manufacturers.
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-bz-border)]">
                <div className="flex-1 text-center">
                  <div className="text-2xl font-serif text-[var(--color-bz-text)] mb-1">0</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Fake Brokers</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-bz-border)]"></div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-serif text-[var(--color-bz-teal)] mb-1">100%</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Verified Capacity</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </motion.section>
  );
}
