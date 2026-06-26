import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { revealVariant } from '../lib/motion-variants';
import { BazeConsole } from './BazeConsole';

const STEPS = [
  {
    id: 1,
    title: "Describe your product",
    icon: Search,
    description: "Type what you need in plain language. Baze maps it to 847 verified suppliers in under 60 seconds.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="brief" />
      </div>
    )
  },
  {
    id: 2,
    title: "AI filters the verified network",
    icon: Filter,
    description: "Baze searches verified MENA and SEA manufacturing networks — filtered by your exact MOQ, budget, and category.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="list" highlightRow={0} />
      </div>
    )
  },
  {
    id: 3,
    title: "Email drafted, ready to send",
    icon: MessageSquare,
    description: "Your first factory intro email is personalized to each supplier's specs and ready to send in one click.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="email" />
      </div>
    )
  }
];

export function Mechanism() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <motion.section 
      id="mechanism"
      aria-labelledby="mechanism-title"
      className="py-24 bg-[var(--color-bz-bg)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="mechanism-title" className="section-label justify-center mb-4">How it works</h2>
          <p className="text-3xl md:text-4xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)]">
            Stop searching Alibaba.<br />Start building.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Steps Navigation */}
          <motion.div 
            variants={revealVariant}
            className="flex flex-row md:flex-col gap-4 md:gap-2 relative overflow-x-auto md:overflow-visible pb-4 md:pb-0" 
            style={{ scrollbarWidth: 'none' }}
          >
            {/* Static vertical spine */}
            <div className="absolute left-[23px] top-8 bottom-8 hidden md:block border-l border-[var(--color-bz-border)]" style={{ width: 1 }} />
            
            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;
              
              return (
                <div 
                  key={step.id}
                  role="button"
                  tabIndex={0}
                  className={`group relative flex flex-col md:flex-row items-start gap-4 md:gap-6 p-5 md:p-6 rounded-xl cursor-pointer transition-all duration-300 min-w-[260px] md:min-w-0 flex-shrink-0 ${isActive ? 'bg-[var(--color-bz-surface-2)] shadow-sm border border-[var(--color-bz-border)]' : 'hover:bg-[var(--color-bz-surface)] border border-transparent'}`}
                  onClick={() => setActiveStep(step.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveStep(step.id); }}
                >
                  {/* Indicator Line (Mobile) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeStepLine"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-bz-teal-dark)] rounded-l-xl md:hidden"
                    />
                  )}

                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[var(--color-bz-teal-dark)] text-white' : 'bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] text-[var(--color-bz-text-muted)] group-hover:text-[var(--color-bz-text)] group-hover:border-[var(--color-bz-border-strong)]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-col pt-1">
                    <h3 className={`text-xl font-display font-[800] tracking-[-0.5px] mb-2 transition-colors duration-300 ${isActive ? 'text-[var(--color-bz-text)]' : 'text-[var(--color-bz-text-muted)] group-hover:text-[var(--color-bz-text)]'}`}>
                      {step.id}. {step.title}
                    </h3>
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="text-[var(--color-bz-text-muted)] font-body text-base leading-relaxed overflow-hidden"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Right: Dynamic Visual Display */}
          <motion.div 
            variants={revealVariant}
            className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-2xl h-[440px] flex items-center justify-center p-6 md:p-8 relative overflow-hidden"
          >
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-bz-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-bz-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2]"></div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
                variants={revealVariant}
                className="w-full relative z-10"
              >
                {STEPS.find(s => s.id === activeStep)?.visual}
              </motion.div>
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
