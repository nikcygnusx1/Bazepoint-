import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { sectionHeader, staggerContainer, fadeUp } from '../lib/motion-variants';
import { BazeConsole } from './BazeConsole';

// Each step answers: "What exactly happens when I talk to Baze?"
const STEPS = [
  {
    id: 1,
    // OUTCOME heading — not a label
    title: "Your brief becomes a search in seconds",
    icon: Search,
    description: "Type what you're making in plain English — product type, material, budget, MOQ. No factory jargon. Baze reads it exactly as a founder would say it.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="brief" />
      </div>
    )
  },
  {
    id: 2,
    title: "Only verified factories reach your shortlist",
    icon: Filter,
    description: "Baze filters a private network of audited manufacturers across Turkey, UAE, Indonesia, and beyond. Every factory passed a compliance, MOQ, and comms check before entering the network.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="list" highlightRow={0} />
      </div>
    )
  },
  {
    id: 3,
    title: "Your first email is written and ready to send",
    icon: MessageSquare,
    description: "Baze drafts a personalized outreach email for each matched factory — specific to your product, budget, and MOQ. Copy it, edit it, or send it directly from Baze.",
    visual: (
      <div className="w-full max-w-md mx-auto">
        <BazeConsole mode="fragment" zone="email" />
      </div>
    )
  }
];

export function Mechanism() {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ["start 0.8", "end 0.3"],
  });

  const dot0Opacity = useTransform(scrollYProgress, [0/3, 0/3 + 0.15], [0, 1]);
  const dot1Opacity = useTransform(scrollYProgress, [1/3, 1/3 + 0.15], [0, 1]);
  const dot2Opacity = useTransform(scrollYProgress, [2/3, 2/3 + 0.15], [0, 1]);
  const dotOpacities = [dot0Opacity, dot1Opacity, dot2Opacity];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) setActiveStep(1);
    else if (latest < 0.66) setActiveStep(2);
    else setActiveStep(3);
  });

  return (
    <motion.section
      id="mechanism"
      aria-labelledby="mechanism-title"
      ref={containerRef}
      className="py-24 bg-[var(--color-bz-bg)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        {/* HEADING answers "What happens when I talk to Baze?" */}
        <motion.div variants={sectionHeader} className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="mechanism-title" className="section-label justify-center mb-4">How it works</h2>
          <p className="text-3xl md:text-4xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)]">
            From brief to factory email — in under a minute.
          </p>
          <p className="mt-4 text-base text-[var(--color-bz-text-muted)] font-body max-w-[480px] mx-auto">
            Three steps. No sourcing experience needed. The same console you see in the demo — this is exactly what runs when you submit a brief.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Steps Navigation */}
          <div className="flex flex-row md:flex-col gap-4 md:gap-2 relative overflow-x-auto md:overflow-visible pb-4 md:pb-0" style={{ scrollbarWidth: 'none' }}>
            <div ref={spineRef} className="absolute left-[23px] top-8 bottom-8 hidden md:block" style={{ width: 1 }}>
              <svg width="1" height="100%" viewBox="0 0 1 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <line x1="0.5" y1="0" x2="0.5" y2="100" stroke="var(--color-bz-border)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
                <motion.line
                  x1="0.5" y1="0" x2="0.5" y2="100"
                  stroke="var(--color-bz-teal-dark)" strokeWidth="1.5" vectorEffect="non-scaling-stroke"
                  style={{ pathLength: scrollYProgress, opacity: useTransform(scrollYProgress, [0, 0.1], [0, 1]) }}
                />
              </svg>
              {[0, 1, 2].map((i) => {
                const dotProgress = dotOpacities[i];
                return (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 -translate-x-1/2 w-[10px] h-[10px] rounded-full border-2 border-[var(--color-bz-teal-dark)] bg-[var(--color-bz-bg)] will-change-transform"
                    style={{ top: `${(i / 2) * 100}%`, scale: dotProgress, opacity: dotProgress }}
                  />
                );
              })}
            </div>

            {STEPS.map((step) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.id}
                  role="button"
                  tabIndex={0}
                  variants={fadeUp}
                  className={`group relative flex flex-col md:flex-row items-start gap-4 md:gap-6 p-5 md:p-6 rounded-xl cursor-pointer transition-all duration-300 min-w-[260px] md:min-w-0 flex-shrink-0 ${isActive ? 'bg-[var(--color-bz-surface-2)] shadow-sm border border-[var(--color-bz-border)]' : 'hover:bg-[var(--color-bz-surface)] border border-transparent'}`}
                  onClick={() => setActiveStep(step.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveStep(step.id); }}
                >
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
                </motion.div>
              );
            })}
          </div>

          {/* Right: Dynamic Visual */}
          <motion.div
            variants={fadeUp}
            className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-2xl h-[440px] flex items-center justify-center p-6 md:p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-bz-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-bz-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.2]"></div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
