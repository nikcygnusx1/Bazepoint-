import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function FinalPush() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-32 md:py-48 bg-bz-teal relative overflow-hidden flex items-center justify-center">
      {/* Decorative subtle ring */}
      <div 
        className="absolute top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full border border-white opacity-10 pointer-events-none" 
        aria-hidden="true"
      ></div>

      <motion.div 
        className="max-w-[680px] mx-auto px-6 text-center relative z-10 flex flex-col items-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={shouldReduceMotion ? {} : containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="bg-white/10 border border-white/25 rounded-full px-4 py-1.5 font-body text-xs font-medium text-white inline-block">
            Free to start
          </span>
        </motion.div>

        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-serif font-normal text-white mb-6 leading-[1.1]">
          Your first manufacturer is one prompt away.
        </motion.h2>

        <motion.p variants={itemVariants} className="font-body text-base text-white/75 max-w-[520px] mb-10 leading-[1.65]">
          Describe your product in plain language. Baze finds your manufacturers, filters by your constraints, and drafts your first email — free, in under 3 minutes.
        </motion.p>
        
        <motion.div variants={itemVariants} className="w-full sm:w-auto">
          <motion.a 
            href="#demo"
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', backgroundColor: 'var(--color-bz-surface)' }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto bg-white text-bz-teal font-body text-sm font-bold py-4 px-9 rounded-lg inline-flex justify-center items-center group transition-colors"
          >
            Describe your product
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" aria-hidden="true" />
          </motion.a>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-4">
          <p className="font-body text-xs text-white/50">
            No credit card. No sourcing experience needed. Start with any product idea.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12 flex flex-wrap justify-center items-center gap-3 font-body text-xs text-white/65">
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-white/90" aria-hidden="true">✓</span> Verified manufacturers only</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-white/90" aria-hidden="true">✓</span> AI-drafted first email included</span>
          <span className="hidden sm:inline" aria-hidden="true">·</span>
          <span className="flex items-center gap-1.5 whitespace-nowrap"><span className="text-white/90" aria-hidden="true">✓</span> Southeast Asia, MENA & Oceania</span>
        </motion.div>
        
      </motion.div>
    </section>
  );
}
