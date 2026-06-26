/*
  PHASE 2 — NARRATIVE SPINE REWRITE
  Section answers: "How is this better than doing it myself?"
  Every line echoes the thesis: brief → verified factories → first email written.
  Headings are outcomes, not labels.
*/

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AlertCircle, XCircle } from 'lucide-react';
import { staggerContainer, fadeUp, sectionHeader, staggerFast, fadeUpFast } from '../lib/motion-variants';

// Each pain point is visceral and specific — the antithesis of what Baze does
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

  const problemOpacity  = useTransform(enemyScroll, [0, 0.5, 1], [1, 0.85, 0.6]);
  const problemScale    = useTransform(enemyScroll, [0, 1], [1, 0.98]);
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

        {/* SECTION LABEL */}
        <motion.p variants={sectionHeader} className="section-label text-center mb-8">
          Why Bazepoint
        </motion.p>

        <div className="max-w-4xl mx-auto bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bz-amber)] to-transparent opacity-50"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            {/* Left: The Problem — specific, visceral */}
            <motion.div style={{ opacity: problemOpacity, scale: problemScale }} className="will-change-transform">
              <motion.div variants={sectionHeader}>
                <div className="flex items-center gap-2 text-[var(--color-bz-amber)] mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-body font-bold uppercase tracking-wider">DIY sourcing</span>
                </div>
                {/* OUTCOME HEADING — the problem stated as a fact, not a label */}
                <h2 id="trap-title" className="text-3xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-4 leading-snug">
                  Most first batches cost weeks and still go wrong.
                </h2>
                <p className="text-base text-[var(--color-bz-text-muted)] font-body leading-relaxed mb-6">
                  First-time founders spend 4–8 weeks chasing factories on Alibaba, WhatsApp groups, and Fiverr agents. Most still end up with a ghosted inbox, a bad sample, or an MOQ they can't afford. You didn't start a company to become a supply chain expert.
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

            {/* Right: Baze contrast — thesis echo */}
            <motion.div
              variants={fadeUp}
              style={{ opacity: solutionOpacity, scale: solutionScale }}
              className="bg-[var(--color-bz-bg)] border border-[var(--color-bz-border)] rounded-xl p-6 md:p-8 will-change-transform"
            >
              {/* OUTCOME HEADING — the direct contrast */}
              <h3 className="text-xl font-display font-[800] tracking-[-0.5px] text-[var(--color-bz-text)] mb-4">
                Brief in. Verified factory and draft email out.
              </h3>
              <p className="text-sm font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-6">
                Describe your product in plain language. Baze searches a private network of audited manufacturers, filters by your budget and MOQ, and writes your first outreach email — personalized and ready to send. No broker fees. No discovery waste.
              </p>
              <div className="flex items-center gap-4 pt-6 border-t border-[var(--color-bz-border)]">
                <div className="flex-1 text-center">
                  <div className="text-2xl font-display font-[800] text-[var(--color-bz-text)] mb-1">0</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Fake Brokers</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-bz-border)]"></div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-display font-[800] text-[var(--color-bz-text)] mb-1">&lt;1min</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Brief to First Email</div>
                </div>
                <div className="w-px h-8 bg-[var(--color-bz-border)]"></div>
                <div className="flex-1 text-center">
                  <div className="text-2xl font-display font-[800] text-[var(--color-bz-teal)] mb-1">100%</div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Vetted Only</div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Social Proof — echoes "How do I know this is real?" */}
        <div className="max-w-2xl mx-auto mt-10 flex flex-col gap-4">
          <motion.div
            variants={fadeUp}
            className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(184,226,242,0.3)] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#4A9EBF] font-body">
                R
              </div>
              <div className="flex-grow min-w-0">
                {/* Quote echoes thesis: brief → verified factories → email written → shipped */}
                <p className="text-base font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-4">
                  "Three weeks on Alibaba. Six ghostings. One Baze brief. Two verified factories in my inbox the same day, email already written. We shipped our first 200 units in 45 days."
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
            variants={fadeUp}
            className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 shadow-sm"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[rgba(184,226,242,0.3)] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#4A9EBF] font-body">
                M
              </div>
              <div className="flex-grow min-w-0">
                {/* Quote echoes thesis: brief → halal-certified UAE lab → email → 48hr reply */}
                <p className="text-base font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-4">
                  "Zero factory connections. I typed a brief — halal-certified UAE supplement lab, MOQ under 500. Baze found one same day, wrote the email. Got a reply in 48 hours. Couldn't have done it without it."
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
