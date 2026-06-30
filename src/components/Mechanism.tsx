import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MessageSquare, HelpCircle } from 'lucide-react';
import { revealVariant } from '../lib/motion-variants';
import { BazeConsole } from './BazeConsole';

const STEPS = [
  {
    id: 1,
    title: "Tell Baze what you want to make",
    icon: Search,
    description: "Type your product brief in plain language — category, region, MOQ, budget. No procurement jargon required. Baze maps your intent to 847 verified factories in under 60 seconds.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="brief" />
      </div>
    )
  },
  {
    id: 2,
    title: "AI surfaces verified matches only",
    icon: Filter,
    description: "Baze searches verified MENA and SEA manufacturing networks and filters by your exact MOQ, budget ceiling, and product category. Every result has passed direct contact confirmation, product validation, and audit scoring.",
    verifiedTooltip: true,
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="list" highlightRow={0} />
      </div>
    )
  },
  {
    id: 3,
    title: "First email drafted, ready to send",
    icon: MessageSquare,
    description: "Your outreach email uses each factory's actual product categories, MOQ, and lead time — not a template. One click copies it to your clipboard. The factory gets something worth reading.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="email" />
      </div>
    )
  }
];

function VerifiedTooltip() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        className="flex items-center gap-1 text-xs text-[var(--color-bz-teal)] font-body mt-2 group focus:outline-none"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label="What does verified mean?"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span className="underline underline-offset-2">What does "verified" actually mean?</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 left-0 mt-2 w-72 bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-xl p-4 shadow-lg text-left"
          >
            <p className="text-xs font-body font-semibold text-[var(--color-bz-text)] mb-2">Every factory in Bazepoint has passed:</p>
            <ul className="space-y-1.5">
              {[
                "Direct contact confirmation — a real person picked up",
                "Product category validation — they actually make what they claim",
                "Minimum sample availability check",
                "At least one successful founder introduction on record",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-bz-text-muted)] font-body">
                  <span className="text-[var(--color-bz-teal)] mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
            Three prompts.<br />Your first factory, ready to talk.
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
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-[var(--color-bz-text-muted)] font-body text-base leading-relaxed">
                            {step.description}
                          </p>
                          {step.verifiedTooltip && <VerifiedTooltip />}
                        </motion.div>
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
