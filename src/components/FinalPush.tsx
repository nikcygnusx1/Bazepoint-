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
            Your next factory relationship is one description away.
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
            No account needed · Verified factories only · Free to describe
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
