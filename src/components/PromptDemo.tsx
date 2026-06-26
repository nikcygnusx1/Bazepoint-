import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { revealVariant, buttonHoverProps } from '../lib/motion-variants';
import { useTypewriterPlaceholder } from '../lib/use-typewriter-placeholder';
import { SearchingState } from './SearchingState';
import { BazeConsole } from './BazeConsole';
import { MANUFACTURERS } from '../lib/console-data';

const SUGGESTIONS = [
  { text: "Premium cotton hoodies · Turkey · MOQ 200", prefix: "🧵" },
  { text: "Skincare packaging, glass · UAE · MOQ 500", prefix: "🧴" },
  { text: "Supplement capsule jars · UAE · halal certified", prefix: "💊" }
];

const EXAMPLE_PROMPTS = [
  "Minimalist leather wallet, India or Turkey, MOQ 100, under $12/unit",
  "Skincare serum packaging, glass bottles, SE Asia, 500 units, $2–3 per unit",
  "Custom ceramic mugs with logo, Vietnam or Indonesia, MOQ 250, under $6",
  "Heavyweight cotton hoodies, private label, Turkey or Portugal, MOQ 150",
  "Supplement capsules, halal certified, UAE or Malaysia, MOQ 1000, $1.50/unit",
];

export function PromptDemo() {
  const [input, setInput] = useState('');
  const [lastSearchBrief, setLastSearchBrief] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [draftOpenId, setDraftOpenId] = useState<string | null>(null);
  const typingInterval = useRef<number | null>(null);

  const { currentIndex, currentPhrase } = useTypewriterPlaceholder(EXAMPLE_PROMPTS, 3500, isFocused || input.length > 0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('demo-focus', { detail: isFocused }));
  }, [isFocused]);

  useEffect(() => {
    if (isProcessing) {
      window.dispatchEvent(new CustomEvent('demo-searching', { detail: true }));
    }
  }, [isProcessing]);

  const handleChipClick = (text: string) => {
    const cleanText = text.replace(/^[^\w]+\s/, '');
    setInput('');
    let i = 0;
    if (typingInterval.current) clearInterval(typingInterval.current);
    
    typingInterval.current = window.setInterval(() => {
      setInput(prev => prev + cleanText.charAt(i));
      i++;
      if (i === cleanText.length) {
        if (typingInterval.current) clearInterval(typingInterval.current);
      }
    }, 30);
  };

  useEffect(() => {
    const handler = (e: CustomEvent) => handleChipClick(e.detail);
    window.addEventListener('populate-demo', handler as EventListener);
    return () => window.removeEventListener('populate-demo', handler as EventListener);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    const trimmedBrief = input.trim();
    setLastSearchBrief(trimmedBrief);
    setIsProcessing(true);
    setResults(false);
    setDraftOpenId(null);

    // Dispatch brief content
    window.dispatchEvent(new CustomEvent('demo-brief', { detail: trimmedBrief }));
    
    setTimeout(() => {
      setIsProcessing(false);
      setResults(true);
      // Dispatch results loaded
      window.dispatchEvent(new CustomEvent('demo-results', { detail: true }));
    }, 2200);
  };

  const consoleState = isProcessing 
    ? 'scanning' 
    : results 
      ? (draftOpenId !== null ? 'draft_ready' : 'results') 
      : 'idle';

  return (
    <motion.section 
      id="demo"
      aria-labelledby="demo-title"
      className="py-24 bg-[var(--color-bz-bg)] border-y border-[var(--color-bz-border)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        
        <motion.div variants={revealVariant} className="text-center mb-12">
          <h2 id="demo-title" className="section-label mb-4">See it work</h2>
          <p className="text-3xl md:text-5xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-3">
            Describe your product. We find the factory.
          </p>
          <p className="text-base text-[var(--color-bz-text-muted)] font-body">
            We’ll search our vetted network, surface manufacturers that fit your brief, and show you what an AI-drafted first email looks like. No sourcing jargon required.
          </p>
        </motion.div>

        {/* Input Terminal */}
        <motion.div variants={revealVariant} className={`group bg-[#FFFFFF] border-[1.5px] border-[rgba(184,226,242,0.5)] rounded-xl transition-all duration-150 ease-out overflow-hidden ${isFocused ? 'border-[#B8E2F2] shadow-[0_4px_24px_rgba(184,226,242,0.25)]' : 'shadow-sm'}`}>
          <form onSubmit={handleSubmit} className="relative flex items-center p-2">
            <div className="relative w-full">
              {!input && (
                <div className="absolute inset-0 px-5 py-4 pointer-events-none flex items-center overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[#9C9C96] whitespace-nowrap overflow-hidden text-ellipsis w-full"
                    >
                      e.g. {currentPhrase}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
              <input 
                type="text"
                aria-label="Describe what you want to make"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-transparent border-none outline-none text-[#1A1A18] font-body text-base px-5 py-4 relative z-10 placeholder:text-[#9C9C96]"
                disabled={isProcessing || results}
              />
            </div>
            
            <AnimatePresence>
              {input.trim() && !results && (
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  {...buttonHoverProps}
                  type="submit"
                  disabled={isProcessing}
                  className={`btn-primary !py-3 !px-5 whitespace-nowrap group/btn flex-shrink-0 mr-1 ${isProcessing ? 'opacity-80 cursor-default' : ''}`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      Matching
                      <span className="w-3 h-3 rounded-full border-2 border-transparent border-t-white border-r-white animate-spin"></span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Find manufacturers
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 group-hover/btn:translate-x-1" />
                    </span>
                  )}
                </motion.button>
              )}
            </AnimatePresence>

          </form>
          
          <SearchingState isProcessing={isProcessing} />
        </motion.div>

        {/* Suggestion Chips */}
        <AnimatePresence mode="wait">
          {!isProcessing && !results && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              {SUGGESTIONS.map((s, i) => (
                <button 
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleChipClick(s.text)}
                  className="bg-[#F5F4F0] border border-[rgba(0,0,0,0.07)] rounded-full py-2.5 px-[18px] text-xs font-body text-[#5C5C57] hover:border-[#B8E2F2] transition-colors flex items-center group cursor-pointer"
                >
                  <span className="mr-2 text-sm">{s.prefix}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results / Interactive BazeConsole Overlay */}
        <AnimatePresence>
          {(results || isProcessing) && (
            <motion.div 
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 overflow-hidden"
            >
              <BazeConsole
                mode="interactive"
                state={consoleState}
                brief={lastSearchBrief}
                manufacturers={MANUFACTURERS}
                activeManufacturerId={draftOpenId}
                onSelectManufacturer={(id) => {
                  setDraftOpenId(id);
                  if (id) {
                    const idx = MANUFACTURERS.findIndex(m => m.id === id);
                    const selectedManufacturer = MANUFACTURERS.find(m => m.id === id);
                    window.dispatchEvent(new CustomEvent('demo-draft-open', { 
                      detail: { 
                        index: idx, 
                        manufacturerId: id, 
                        factoryName: selectedManufacturer?.name 
                      } 
                    }));
                  } else {
                    window.dispatchEvent(new CustomEvent('demo-draft-close'));
                  }
                }}
              />
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => {
                    setInput('');
                    setLastSearchBrief('');
                    setResults(false);
                    setDraftOpenId(null);
                    window.dispatchEvent(new CustomEvent('demo-reset'));
                  }}
                  className="text-xs text-[var(--color-bz-text-muted)] font-body hover:text-[var(--color-bz-text)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  ← Try a different product search
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes pulse-shadow {
          0%, 100% { box-shadow: 0 0 0 transparent; }
          50% { box-shadow: var(--shadow-glow-teal); }
        }
        .animate-pulse-shadow {
          animation: pulse-shadow 2.5s infinite ease-in-out;
        }
      `}</style>
    </motion.section>
  );
}
