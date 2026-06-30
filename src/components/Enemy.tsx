import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { AlertCircle, XCircle } from 'lucide-react';
import { revealVariant } from '../lib/motion-variants';

const PAIN_POINTS = [
  "Brokers masquerading as real factories with stolen photo sheets",
  "Samples arrive flawless; the production batch is completely unusable",
  "The 'trusted agent' quietly bumps your MOQ from 200 to 1,000",
  "Lead times stretch from 'around 3 weeks' to a blind 3 months",
  "You send $5,000 wire transfers hoping the factory actually exists"
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
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        <p className="section-label text-center mb-8">
          Why Bazepoint
        </p>
        
        <div className="max-w-4xl mx-auto bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--color-bz-amber)] to-transparent opacity-50"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <motion.div style={{ opacity: problemOpacity, scale: problemScale }} className="will-change-transform">
              <div>
                <div className="flex items-center gap-2 text-[var(--color-bz-amber)] mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm font-body font-bold uppercase tracking-wider">The Sourcing Trap</span>
                </div>
                <h2 id="trap-title" className="text-3xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-4 leading-snug">
                  You spent 6 hours on Alibaba. You have nothing to show for it.
                </h2>
                <p className="text-base text-[var(--color-bz-text-muted)] font-body leading-relaxed mb-6">
                  You got 140 identical automated responses. 120 were spam. Sourcing agents took $1,500 only to hand you two broken links. Meanwhile, your competitors are shipping. You didn't start a company to spend your life in translation tools and WeChat groups.
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
            
            <motion.div style={{ opacity: solutionOpacity, scale: solutionScale }} className="bg-[var(--color-bz-bg)] border border-[var(--color-bz-border)] rounded-xl p-6 md:p-8 will-change-transform flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-[800] tracking-[-0.5px] text-[var(--color-bz-text)] mb-4">
                  Baze does the hard part for you.
                </h3>
                <p className="text-sm font-body text-[var(--color-bz-text-muted)] leading-relaxed mb-6">
                  Describe what you want to make in plain language. Baze surfaces matches from verified networks, filtered by your exact MOQ and budget, and writes your first outreach email. From brief to factory inbox in under a minute.
                </p>
              </div>
              <div className="grid grid-cols-3 divide-x divide-[var(--color-bz-border)] pt-6 border-t border-[var(--color-bz-border)] w-full">
                <div className="text-center px-1">
                  <div className="text-[20px] sm:text-[24px] md:text-[28px] font-display font-[800] text-[var(--color-bz-text)] mb-1 tabular-nums leading-none">0</div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body leading-tight">Fake Brokers</div>
                </div>
                <div className="text-center px-1">
                  <div className="text-[20px] sm:text-[24px] md:text-[28px] font-display font-[800] text-[var(--color-bz-text)] mb-1 tabular-nums leading-none">&lt;1min</div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body leading-tight">Match Time</div>
                </div>
                <div className="text-center px-1">
                  <div className="text-[20px] sm:text-[24px] md:text-[28px] font-display font-[800] text-[var(--color-bz-text)] mb-1 tabular-nums leading-none">100%</div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body leading-tight">Verified</div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </div>
    </motion.section>
  );
}
