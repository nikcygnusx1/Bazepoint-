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
  const [draftOpen, setDraftOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
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
    setDraftOpen(null);
    
    setTimeout(() => {
      setIsProcessing(false);
      setResults(true);
    }, 2200);
  };

  const handleCopy = (bodyText: string) => {
    navigator.clipboard.writeText(bodyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.section 
      id="demo"
      aria-labelledby="demo-title"
      className="py-24 bg-[var(--color-bz-bg)] border-y border-[var(--color-bz-border)] relative overflow-hidden"
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
          <p className="text-3xl md:text-5xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-3">
            Describe your product. We find the factory.
          </p>
          <p className="text-base text-[var(--color-bz-text-muted)] font-body">
            We’ll search our vetted network, surface manufacturers that fit your brief, and show you what an AI-drafted first email looks like. No sourcing jargon required.
          </p>
        </motion.div>

        {/* Input Terminal */}
        <motion.div variants={scaleUp} className={`group bg-[#FFFFFF] border-[1.5px] border-[rgba(184,226,242,0.5)] rounded-xl transition-all duration-150 ease-out overflow-hidden ${isFocused ? 'border-[#B8E2F2] shadow-[0_4px_24px_rgba(184,226,242,0.25)]' : 'shadow-sm'}`}>
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
                  className="bg-[#F5F4F0] border border-[rgba(0,0,0,0.07)] rounded-full py-2.5 px-[18px] text-xs font-body text-[#5C5C57] hover:border-[#B8E2F2] transition-colors flex items-center group cursor-pointer"
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
                <span className="text-sm font-body font-[700] text-[#1A1A18]">3 verified manufacturers found</span>
                <div className="flex gap-2 text-xs font-body text-[#5C5C57]">
                  <span className="bg-[rgba(184,226,242,0.2)] text-[#4A9EBF] border border-[rgba(184,226,242,0.4)] rounded-full px-3 py-1">Region</span>
                  <span className="bg-[#F5F4F0] text-[#5C5C57] border border-[rgba(0,0,0,0.07)] rounded-full px-3 py-1">Category</span>
                  <span className="bg-[#F5F4F0] text-[#5C5C57] border border-[rgba(0,0,0,0.07)] rounded-full px-3 py-1">MOQ</span>
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
                    className="manufacturer-card p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 bg-[#FFFFFF] border border-[rgba(0,0,0,0.07)] !rounded-[20px] relative overflow-hidden group cursor-pointer before:absolute before:top-0 before:left-0 before:w-full before:h-1 before:bg-[#B8E2F2]"
                  >
                    {/* Rank */}
                    <div className="text-xl font-display text-[var(--color-bz-text-faint)] w-8 flex-shrink-0">
                      {index + 1}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-grow flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-body font-[700] text-[#1A1A18]">{m.name}</h4>
                        <span className="text-[#4A9EBF] bg-[rgba(184,226,242,0.1)] border border-[rgba(184,226,242,0.5)] font-body text-[11px] uppercase tracking-wider font-[600] rounded px-2 py-0.5 inline-flex items-center gap-1"><span className="font-bold text-[#4A9EBF]">✓</span> Verified</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[#9C9C96] flex items-center gap-1 font-body">
                          <MapPin className="w-3 h-3" /> {m.location}
                        </span>
                        <span className="bg-[rgba(34,197,94,0.1)] text-[#16A34A] text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm font-body">
                          Active
                        </span>
                      </div>
                    </div>
                    
                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-6 md:gap-8 flex-shrink-0 w-full md:w-auto mt-4 md:mt-0 p-4 bg-[#F5F4F0] rounded-xl">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9C9C96] uppercase font-body tracking-wider mb-1">Price/Unit</span>
                        <span className="font-body text-sm font-[800] text-[#1A1A18]">{m.price}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9C9C96] uppercase font-body tracking-wider mb-1">MOQ</span>
                        <span className="font-body text-sm font-[800] text-[#1A1A18]">{m.moq}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-[#9C9C96] uppercase font-body tracking-wider mb-1">Lead Time</span>
                        <span className="font-body text-sm font-[800] text-[#1A1A18]">{m.lead}</span>
                      </div>
                    </div>
                    
                    {/* Action */}
                    <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                      <button className="btn-ghost flex-1 md:flex-none !text-xs !py-2 !px-3">View profile</button>
                      <button 
                        onClick={() => setDraftOpen(index)}
                        className={`btn-primary flex-1 md:flex-none !text-xs !py-2 !px-3 ${index === 0 ? 'animate-pulse-shadow' : ''}`}
                      >
                        Draft email →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <AnimatePresence>
                {draftOpen !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-6 bg-[#FFFFFF] border border-[rgba(184,226,242,0.5)] rounded-2xl overflow-hidden"
                  >
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(0,0,0,0.07)] bg-[rgba(184,226,242,0.06)]">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B8E2F2] animate-pulse"></div>
                        <span className="text-xs font-body font-semibold text-[#4A9EBF] uppercase tracking-wider">
                          AI Draft — {MOCK_RESULTS[draftOpen].name}
                        </span>
                      </div>
                      <button
                        onClick={() => setDraftOpen(null)}
                        className="text-[#9C9C96] hover:text-[#1A1A18] transition-colors text-lg leading-none"
                        aria-label="Close draft"
                      >
                        ×
                      </button>
                    </div>

                    {/* Email meta */}
                    <div className="px-6 pt-4 pb-2 border-b border-[rgba(0,0,0,0.04)] space-y-1.5">
                      <div className="flex gap-2 text-xs font-body text-[#9C9C96]">
                        <span className="w-12 flex-shrink-0 font-medium text-[#5C5C57]">To:</span>
                        <span>sourcing@{MOCK_RESULTS[draftOpen].name.toLowerCase().replace(/\s+/g, '')}.com</span>
                      </div>
                      <div className="flex gap-2 text-xs font-body text-[#9C9C96]">
                        <span className="w-12 flex-shrink-0 font-medium text-[#5C5C57]">Subject:</span>
                        <span>Partnership Inquiry — New Product Sourcing Request</span>
                      </div>
                    </div>

                    {/* Email body */}
                    <div className="px-6 py-5 text-sm font-body text-[#5C5C57] leading-relaxed whitespace-pre-line">
                      {`Hi ${MOCK_RESULTS[draftOpen].name.split(' ')[0]} Team,

I came across your factory profile on Bazepoint and I'm interested in exploring a manufacturing partnership.

I'm looking to produce [product type] with the following requirements:
• Target price: [your budget per unit]
• Quantity: [your MOQ]
• Timeline: [your target delivery]

Could you confirm your current capacity and whether you accept new founder accounts at these volumes? I'd love to schedule a quick call to discuss further.

Looking forward to hearing from you.

Best,
[Your name]`}
                    </div>

                    {/* Footer actions */}
                    <div className="px-6 pb-5 flex flex-col sm:flex-row gap-3">
                      <button 
                        onClick={() => handleCopy(`Hi ${MOCK_RESULTS[draftOpen].name.split(' ')[0]} Team,\n\nI came across your factory profile on Bazepoint and I'm interested in exploring a manufacturing partnership.\n\nI'm looking to produce [product type] with the following requirements:\n• Target price: [your budget per unit]\n• Quantity: [your MOQ]\n• Timeline: [your target delivery]\n\nCould you confirm your current capacity and whether you accept new founder accounts at these volumes? I'd love to schedule a quick call to discuss further.\n\nLooking forward to hearing from you.\n\nBest,\n[Your name]`)}
                        className="btn-primary flex-1 sm:flex-none !text-sm !py-2.5 !px-5"
                      >
                        {copied ? 'Copied ✓' : 'Copy email ↗'}
                      </button>
                      <button 
                        onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&su=Partnership+Inquiry+—+New+Product+Sourcing+Request', '_blank')}
                        className="btn-ghost flex-1 sm:flex-none !text-sm !py-2.5 !px-5"
                      >
                        Edit in Gmail
                      </button>
                      <p className="text-xs text-[#9C9C96] font-body self-center sm:ml-auto">
                        Personalised by Baze AI · Ready to send
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => { setInput(''); setResults(false); setDraftOpen(null); }}
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
