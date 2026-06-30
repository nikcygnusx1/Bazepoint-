import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { revealVariant, buttonHoverProps } from '../lib/motion-variants';
import { useMagnetic } from '../lib/use-magnetic';

const TESTIMONIALS = [
  {
    name: "[Sarah Chen]",
    role: "[DTC apparel founder]",
    location: "[Singapore]",
    outcome: "[Surfaced 3 verified Turkish knitwear suppliers in 45 seconds, with MOQ of 150 units at $8.20/unit.]",
    feeling: "[It felt like having a senior sourcing director in my pocket. I skipped three weeks of broken WhatsApp translations.]"
  },
  {
    name: "[Arjun Mehta]",
    role: "[supplements founder]",
    location: "[Bangalore]",
    outcome: "[Matched with a family-owned glass jar supplier in Indonesia within a minute, cutting lead time by 12 days.]",
    feeling: "[I spent two weeks getting spammed on directories. Baze gave me three real, audited contacts in one session.]"
  }
];

export function FinalPush() {
  const ctaMagnetic = useMagnetic(0.4);

  return (
    <motion.section 
      aria-labelledby="final-title"
      className="py-32 bg-[#B8E2F2] border-y border-[var(--color-bz-border)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      <div className="fp-ambient" aria-hidden="true" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--color-bz-teal-light)] to-transparent opacity-20 blur-3xl pointer-events-none rounded-full z-0"></div>
      
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div variants={revealVariant} className="will-change-transform">
            <p className="text-3xl md:text-5xl font-display font-bold text-[#1A1A18] mb-8 leading-tight tracking-[-1px] max-w-[65ch] mx-auto">
              Your first factory relationship is three prompts away.
            </p>
          </motion.div>
          
          <motion.div variants={revealVariant} className="flex flex-col items-center justify-center will-change-transform">
            <motion.button 
              ref={ctaMagnetic.ref as React.Ref<HTMLButtonElement>}
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseMove={ctaMagnetic.onMouseMove}
              onMouseLeave={ctaMagnetic.onMouseLeave}
              style={{ x: ctaMagnetic.springX, y: ctaMagnetic.springY }}
              {...buttonHoverProps}
              className="btn-primary !px-8 !py-4 text-base group w-full sm:w-auto text-center block"
            >
              Describe your first product
              <ArrowRight className="w-4 h-4 inline-block ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
            </motion.button>
            <p className="text-xs font-console text-[#1A1A18]/60 mt-4 text-center tracking-wide">
              No account needed · Verified factories only · Free to describe
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 pt-12 border-t border-[#1A1A18]/10 text-left">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              variants={revealVariant}
              className="flex flex-col justify-between bg-white/40 border border-white/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-sm"
            >
              <div className="space-y-4">
                <p className="text-[#1A1A18] font-body text-base leading-relaxed font-semibold">
                  {t.outcome}
                </p>
                <p className="text-[#1A1A18]/80 font-body text-sm leading-relaxed italic">
                  {t.feeling}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1A1A18]/5 text-xs font-console text-[#1A1A18]/70">
                <span className="font-bold">{t.name}</span>, {t.role}, {t.location}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
