import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin } from 'lucide-react';
import { staggerContainer, sectionHeader, scaleUp, staggerSlow, cardItem } from '../lib/motion-variants';
import { useTypewriterPlaceholder } from '../lib/use-typewriter-placeholder';
import { SearchingState } from './SearchingState';

const SUGGESTIONS = [
  { text: "Premium cotton hoodies · Turkey · MOQ 200", prefix: "🧵" },
  { text: "Skincare packaging, glass · Indonesia · MOQ 500", prefix: "🧴" },
  { text: "Supplement capsule jars · UAE · halal certified", prefix: "💊" }
];

const EXAMPLE_PROMPTS = [
  "Minimalist leather wallet, India or Turkey, MOQ 100, under $12/unit",
  "Skincare serum packaging, glass bottles, SE Asia, 500 units, $2–3 per unit",
  "Custom ceramic mugs with logo, Vietnam or Indonesia, MOQ 250, under $6",
  "Heavyweight cotton hoodies, private label, Turkey or Portugal, MOQ 150",
  "Supplement capsules, halal certified, UAE or Malaysia, MOQ 1000, $1.50/unit",
];

const MOCK_RESULTS = [
  {
    name: "Anatolia Apparel Co.",
    location: "Istanbul, Turkey",
    category: "Apparel",
    price: "$7.20/unit",
    moq: "100",
    lead: "18d"
  },
  {
    name: "Pacific Packaging Systems",
    location: "Jakarta, Indonesia",
    category: "Packaging",
    price: "$1.45/unit",
    moq: "500",
    lead: "12d"
  },
  {
    name: "Oasis Health Labs",
    location: "Dubai, UAE",
    category: "Supplements",
    price: "$3.50/unit",
    moq: "1000",
    lead: "24d"
  }
];

export function PromptDemo() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const typingInterval = useRef<number | null>(null);

  const { currentIndex, currentPhrase } = useTypewriterPlaceholder(EXAMPLE_PROMPTS, 3500, isFocused || input.length > 0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('demo-focus', { detail: isFocused }));
  }, [isFocused]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('demo-searching', { detail: isProcessing }));
  }, [isProcessing]);

  const handleChipClick = (text: string) => {
    // Strip prefix if any
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
    
    setIsProcessing(true);
    setResults(false);
    
    setTimeout(() => {
      setIsProcessing(false);
      setResults(true);
    }, 2200);
  };

  return (
    <motion.section 
      id="demo"
      aria-labelledby="demo-title"
      className="py-24 bg-[var(--color-bz-surface)] border-y border-[var(--color-bz-border)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
    >
      {/* Subtle Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <div className="max-w-[900px] mx-auto px-6 relative z-10">
        
        <motion.div variants={sectionHeader} className="text-center mb-12">
          <h2 id="demo-title" className="section-label mb-4">See it work</h2>
          <p className="text-3xl md:text-5xl font-serif font-normal text-[var(--color-bz-text)] mb-3">
            Describe what you want to make.
          </p>
          <p className="text-base text-[var(--color-bz-text-muted)] font-body">
            We'll find your manufacturers and draft your first email. No jargon required.
          </p>
        </motion.div>

        {/* Input Terminal */}
        <motion.div variants={scaleUp} className={`group bg-[var(--color-bz-bg)] border-[1.5px] border-[var(--color-bz-border)] rounded-xl shadow-md transition-all duration-150 ease-out overflow-hidden ${isFocused ? 'prompt-input-focused' : ''}`}>
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
                      className="text-[var(--color-bz-text-muted)] whitespace-nowrap overflow-hidden text-ellipsis w-full"
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
                className="w-full bg-transparent border-none outline-none text-[var(--color-bz-text)] font-body text-base px-5 py-4 relative z-10"
                disabled={isProcessing || results}
              />
            </div>
            
            <AnimatePresence>
              {input.trim() && !results && (
                <motion.button 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.03, transition: { duration: 0.2, ease: [0.34, 1.56, 0.64, 1] } }}
                  whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
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
                  className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-full py-2.5 px-[18px] text-xs font-serif text-[var(--color-bz-text)] hover:border-[var(--color-bz-teal)] hover:bg-[var(--color-bz-teal-light)] transition-colors flex items-center group cursor-pointer"
                >
                  <span className="mr-2 text-sm">{s.prefix}</span>
                  <span>{s.text}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div 
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-8 overflow-hidden"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 mb-4 border-b border-[var(--color-bz-border)] gap-4">
                <span className="text-sm font-body font-semibold text-[var(--color-bz-text)]">3 verified manufacturers found</span>
                <div className="flex gap-2 text-xs font-body text-[var(--color-bz-text-muted)]">
                  <span className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-full px-3 py-1">Region</span>
                  <span className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-full px-3 py-1">Category</span>
                  <span className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-full px-3 py-1">MOQ</span>
                </div>
              </div>
              
              {/* Cards */}
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerSlow}
                className="space-y-4"
              >
                {MOCK_RESULTS.map((m, index) => (
                  <motion.div
                    key={index}
                    variants={cardItem}
                    className="manufacturer-card p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-[var(--color-bz-surface)] group cursor-pointer"
                  >
                    {/* Rank */}
                    <div className="text-xl font-serif text-[var(--color-bz-text-faint)] w-8 flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-grow flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-body font-semibold text-[var(--color-bz-text)]">{m.name}</h4>
                        <span className="verified-chip">✓ Verified</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[var(--color-bz-text-muted)] flex items-center gap-1 font-body">
                          <MapPin className="w-3 h-3" /> {m.location}
                        </span>
                        <span className="bg-[var(--color-bz-amber-light)] text-[var(--color-bz-amber)] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm font-body">
                          {m.category}
                        </span>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-6 md:gap-8 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--color-bz-border)]">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[var(--color-bz-text-faint)] uppercase font-body tracking-wider mb-1">Price/Unit</span>
                        <span className="font-mono text-sm font-bold text-[var(--color-bz-text)]">{m.price}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[var(--color-bz-text-faint)] uppercase font-body tracking-wider mb-1">MOQ</span>
                        <span className="font-mono text-sm font-bold text-[var(--color-bz-text)]">{m.moq}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[var(--color-bz-text-faint)] uppercase font-body tracking-wider mb-1">Lead Time</span>
                        <span className="font-mono text-sm font-bold text-[var(--color-bz-text)]">{m.lead}</span>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button className="btn-ghost flex-1 md:flex-none !text-xs !py-2 !px-3">View profile</button>
                      <button 
                        className={`btn-primary flex-1 md:flex-none !text-xs !py-2 !px-3 ${index === 0 ? 'animate-pulse-shadow' : ''}`}
                      >
                        Draft email →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => { setInput(''); setResults(false); }}
                  className="text-xs text-[var(--color-bz-text-muted)] font-body hover:text-[var(--color-bz-text)] transition-colors"
                >
                  ← Try a different product
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
