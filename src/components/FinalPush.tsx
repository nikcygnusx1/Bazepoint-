import { useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { revealVariant, buttonHoverProps } from '../lib/motion-variants';
import { useMagnetic } from '../lib/use-magnetic';

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
      {/* Ambient animated background */}
      <div className="fp-ambient" aria-hidden="true" />
      
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--color-bz-teal-light)] to-transparent opacity-20 blur-3xl pointer-events-none rounded-full z-0"></div>
      
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div variants={revealVariant} className="will-change-transform">
          <p className="text-3xl md:text-5xl font-display font-bold text-[#1A1A18] mb-10 leading-tight tracking-[-1px] max-w-[65ch] mx-auto">
            Describe it once. Talk to a real factory by tomorrow.
          </p>
        </motion.div>
        
        <motion.div variants={revealVariant} className="flex flex-col items-center justify-center will-change-transform">
          <motion.a 
            ref={ctaMagnetic.ref as React.Ref<HTMLAnchorElement>}
            href="#demo"
            onMouseMove={ctaMagnetic.onMouseMove}
            onMouseLeave={ctaMagnetic.onMouseLeave}
            style={{ x: ctaMagnetic.springX, y: ctaMagnetic.springY }}
            {...buttonHoverProps}
            className="btn-primary !px-8 !py-4 text-base group w-full sm:w-auto text-center block"
          >
            Describe your first product
            <ArrowRight className="w-4 h-4 inline-block ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </motion.a>
          <p className="text-xs font-console text-[var(--color-bz-text-faint)] mt-4 text-center tracking-wide">
            No account needed · MOQ from 100 units · Free to describe
          </p>
        </motion.div>

        {/* Testimonials section */}
        <motion.div 
          variants={revealVariant} 
          className="will-change-transform mt-16 pt-12 border-t border-[var(--color-bz-border)] grid grid-cols-1 md:grid-cols-2 gap-8 text-left"
        >
          {/* TESTIMONIAL CARD 1 */}
          <div className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-base font-semibold leading-relaxed text-[var(--color-bz-text)]">
                Found 3 verified Turkish knitwear factories in under a minute. MOQ was 150 units at $8.20 per unit — exactly what I needed to start.
              </p>
              <p className="text-sm italic leading-relaxed mt-3 text-[var(--color-bz-text-muted)]">
                I used to spend entire evenings on Alibaba getting nowhere. Bazepoint gave me actual contacts I could email the same day.
              </p>
            </div>
            <p className="font-mono text-xs mt-6 pt-4 border-t border-[var(--color-bz-border)] text-[var(--color-bz-text-faint)]">
              Maya R. · Founder, activewear brand · Singapore
            </p>
          </div>

          {/* TESTIMONIAL CARD 2 */}
          <div className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-base font-semibold leading-relaxed text-[var(--color-bz-text)]">
                Matched with a glass jar supplier in Indonesia within 60 seconds. Cut my expected lead time by nearly two weeks.
              </p>
              <p className="text-sm italic leading-relaxed mt-3 text-[var(--color-bz-text-muted)]">
                Everyone else spammed me with irrelevant suppliers. This was the first time I felt like someone actually understood what I was looking for.
              </p>
            </div>
            <p className="font-mono text-xs mt-6 pt-4 border-t border-[var(--color-bz-border)] text-[var(--color-bz-text-faint)]">
              Arjun M. · Founder, supplement brand · Bangalore
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
