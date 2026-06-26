import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MessageSquare, CheckCircle2 } from 'lucide-react';
import { sectionHeader, staggerContainer, fadeUp } from '../lib/motion-variants';

const STEPS = [
  {
    id: 1,
    title: "Describe your product",
    icon: Search,
    description: "Tell Baze what you're making in plain English. No factory jargon required.",
    visual: (
      <div className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-lg p-6 w-full max-w-sm mx-auto shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-bz-teal)]"></div>
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-[var(--color-bz-surface-2)] flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-serif">You</span>
          </div>
          <div className="bg-[var(--color-bz-surface-2)] rounded-lg p-4 text-sm font-body text-[var(--color-bz-text)] leading-relaxed">
            "I need a factory in Turkey or Portugal for heavyweight cotton hoodies. Blank, no logo. MOQ under 300. Target price is $12/unit."
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2,
    title: "AI filters the verified network",
    icon: Filter,
    description: "Baze scans our private database of verified manufacturers across MENA, SE Asia, and Oceania.",
    visual: (
      <div className="w-full max-w-sm mx-auto space-y-3">
        {[
          { text: "Filtering by region (MENA, Europe)", active: true },
          { text: "Checking capacity & MOQ (300)", active: true },
          { text: "Verifying quality certifications", active: true },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}
            className="flex items-center gap-3 bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-lg p-3 shadow-sm"
          >
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.active ? 'bg-[var(--color-bz-teal-light)] text-[var(--color-bz-teal)]' : 'bg-[var(--color-bz-surface-2)] text-[var(--color-bz-border)]'}`}>
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <span className="text-xs font-mono text-[var(--color-bz-text-muted)]">{item.text}</span>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 3,
    title: "Email drafted, ready to send",
    icon: MessageSquare,
    description: "Get a curated list of top matches, complete with a drafted outreach email designed to get a response.",
    visual: (
      <div className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-lg w-full max-w-sm mx-auto shadow-sm overflow-hidden flex flex-col">
        <div className="bg-[var(--color-bz-surface-2)] border-b border-[var(--color-bz-border)] p-3 flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-bz-border-soft)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-bz-border-soft)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-bz-border-soft)]"></div>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="h-3 w-1/3 bg-[var(--color-bz-surface-2)] rounded"></div>
          <div className="space-y-2 mt-2">
            <div className="h-2 w-full bg-[var(--color-bz-surface-2)] rounded"></div>
            <div className="h-2 w-5/6 bg-[var(--color-bz-surface-2)] rounded"></div>
            <div className="h-2 w-full bg-[var(--color-bz-surface-2)] rounded"></div>
            <div className="h-2 w-4/5 bg-[var(--color-bz-surface-2)] rounded"></div>
          </div>
          <div className="mt-4 inline-flex self-start bg-[var(--color-bz-teal)] text-[var(--color-bz-bg)] text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 rounded-sm">
            Send Inquiry
          </div>
        </div>
      </div>
    )
  }
];

export function Mechanism() {
  const [activeStep, setActiveStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.section 
      id="mechanism"
      ref={containerRef}
      className="py-24 bg-[var(--color-bz-bg)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        <motion.div variants={sectionHeader} className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="section-label justify-center mb-4">How it works</h2>
          <p className="text-3xl md:text-4xl font-serif font-normal text-[var(--color-bz-text)]">
            Stop searching Alibaba.<br />Start building.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Steps Navigation */}
          <div className="flex flex-col gap-2 relative">
            <div className="absolute left-[23px] top-8 bottom-8 w-px bg-[var(--color-bz-border)] hidden md:block"></div>
            
            {STEPS.map((step, index) => {
              const isActive = activeStep === step.id;
              const Icon = step.icon;
              
              return (
                <motion.div 
                  key={step.id}
                  variants={fadeUp}
                  className={`group relative flex items-start gap-6 p-6 rounded-xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-[var(--color-bz-surface-2)] shadow-sm border border-[var(--color-bz-border)]' : 'hover:bg-[var(--color-bz-surface)] border border-transparent'}`}
                  onClick={() => setActiveStep(step.id)}
                >
                  {/* Indicator Line (Mobile) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeStepLine"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-bz-teal)] rounded-l-xl md:hidden"
                    />
                  )}

                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${isActive ? 'bg-[var(--color-bz-teal)] text-[var(--color-bz-bg)]' : 'bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] text-[var(--color-bz-text-muted)] group-hover:text-[var(--color-bz-text)] group-hover:border-[var(--color-bz-border-strong)]'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex flex-col pt-1">
                    <h3 className={`text-xl font-serif mb-2 transition-colors duration-300 ${isActive ? 'text-[var(--color-bz-text)]' : 'text-[var(--color-bz-text-muted)] group-hover:text-[var(--color-bz-text)]'}`}>
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

          {/* Right: Dynamic Visual Display */}
          <motion.div 
            variants={fadeUp}
            className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-2xl h-[400px] flex items-center justify-center p-8 relative overflow-hidden"
          >
            {/* Subtle Grid Background */}
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
