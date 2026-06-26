import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'motion/react';

export function HeroVisual() {
  const shouldReduceMotion = useReducedMotion();
  
  // Real state wired to PromptDemo events
  const [isSearching, setIsSearching] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [draftIndex, setDraftIndex] = useState<number | null>(null);
  const [briefText, setBriefText] = useState('Skincare packaging · Indonesia · MOQ 500 · under $2.50/unit');
  
  const [animStage, setAnimStage] = useState<'idle' | 'brief' | 'cards' | 'typing' | 'draft'>('idle');

  // Custom Event Subscriptions
  useEffect(() => {
    const handleSearching = (e: Event) => {
      const isSearch = (e as CustomEvent<boolean>).detail;
      if (isSearch) {
        setIsSearching(true);
        setHasResults(false);
        setDraftIndex(null);
      } else {
        setIsSearching(false);
      }
    };

    const handleResults = () => {
      setHasResults(true);
      setIsSearching(false);
    };

    const handleReset = () => {
      setHasResults(false);
      setIsSearching(false);
      setDraftIndex(null);
      setBriefText('Skincare packaging · Indonesia · MOQ 500 · under $2.50/unit');
    };

    const handleDraftOpen = (e: Event) => {
      const detail = (e as CustomEvent<{ index: number }>).detail;
      setDraftIndex(detail.index);
      setHasResults(true);
    };

    const handleDraftClose = () => {
      setDraftIndex(null);
    };

    const handleBrief = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setBriefText(detail);
    };

    window.addEventListener('demo-searching', handleSearching);
    window.addEventListener('demo-results', handleResults);
    window.addEventListener('demo-reset', handleReset);
    window.addEventListener('demo-draft-open', handleDraftOpen);
    window.addEventListener('demo-draft-close', handleDraftClose);
    window.addEventListener('demo-brief', handleBrief);

    return () => {
      window.removeEventListener('demo-searching', handleSearching);
      window.removeEventListener('demo-results', handleResults);
      window.removeEventListener('demo-reset', handleReset);
      window.removeEventListener('demo-draft-open', handleDraftOpen);
      window.removeEventListener('demo-draft-close', handleDraftClose);
      window.removeEventListener('demo-brief', handleBrief);
    };
  }, []);

  // State Machine Transitions
  useEffect(() => {
    if (shouldReduceMotion) {
      if (draftIndex !== null) {
        setAnimStage('draft');
      } else if (hasResults) {
        setAnimStage('cards');
      } else if (isSearching) {
        setAnimStage('brief');
      } else {
        setAnimStage('idle');
      }
      return;
    }

    if (isSearching) {
      setAnimStage('brief');
      const t = setTimeout(() => {
        setAnimStage('cards');
      }, 500);
      return () => clearTimeout(t);
    }

    if (hasResults) {
      if (draftIndex !== null) {
        setAnimStage('typing');
        const t = setTimeout(() => {
          setAnimStage('draft');
        }, 750);
        return () => clearTimeout(t);
      } else {
        setAnimStage('cards');
      }
      return;
    }

    setAnimStage('idle');
  }, [isSearching, hasResults, draftIndex, shouldReduceMotion]);

  const showBrief = ['brief', 'cards', 'typing', 'draft'].includes(animStage);
  const showCards = ['cards', 'typing', 'draft'].includes(animStage);

  const MANU_CARDS = [
    {
      name: "Nusantara Packaging Co.",
      location: "Surabaya, Indonesia",
      price: "$1.85/unit",
      moq: "500",
      lead: "14d"
    },
    {
      name: "Pacific Glassworks",
      location: "Jakarta, Indonesia",
      price: "$2.10/unit",
      moq: "750",
      lead: "18d"
    },
    {
      name: "Halo Beauty Labs",
      location: "Bandung, Indonesia",
      price: "$2.30/unit",
      moq: "500",
      lead: "21d"
    }
  ];

  const selectedManu = MANU_CARDS[draftIndex !== null ? draftIndex : 0] || MANU_CARDS[0];
  const truncatedBrief = briefText.length > 60 ? briefText.slice(0, 57) + '...' : briefText;

  return (
    <div className="w-full h-full min-h-[420px] flex items-center justify-center p-4">
      {/* Background decoration: subtle grid or glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(184,226,242,0.15)_0%,transparent_70%] pointer-events-none z-0"></div>

      <div 
        className="w-full max-w-[420px] bg-white border border-[rgba(0,0,0,0.07)] rounded-2xl p-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)] relative z-10 overflow-hidden min-h-[480px] flex flex-col justify-start"
        style={{ backgroundColor: 'var(--color-bz-surface)' }}
      >
        <AnimatePresence mode="wait">
          {animStage === 'idle' ? (
            <div key="idle-state" className="w-full h-full flex flex-col justify-between opacity-35 filter blur-[0.2px] pointer-events-none select-none">
              <div>
                {/* Brief */}
                <div className="flex items-center gap-3 p-3.5 bg-[rgba(184,226,242,0.18)] border border-[rgba(184,226,242,0.3)] rounded-xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4A9EBF] flex-shrink-0"></div>
                  <span className="text-xs md:text-sm font-body font-medium text-[#1A1A18] text-left leading-normal">
                    Skincare packaging · Indonesia · MOQ 500 · under $2.50/unit
                  </span>
                </div>
                {/* Cards */}
                <div className="space-y-3 mt-4">
                  {MANU_CARDS.map((card) => (
                    <div
                      key={card.name}
                      className="bg-white border border-[var(--color-bz-border)] rounded-xl p-3 flex items-center justify-between"
                    >
                      <div className="flex flex-col text-left mr-2 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
                          <span className="text-xs md:text-sm font-body font-semibold text-[#1A1A18] truncate leading-tight">{card.name}</span>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-body text-[#4A9EBF] bg-[rgba(184,226,242,0.25)] border border-[rgba(184,226,242,0.4)] flex-shrink-0">
                            ✓
                          </span>
                        </div>
                        <span className="text-[10px] md:text-xs font-body text-[#9C9C96] truncate">{card.location}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-x-2.5 text-right flex-shrink-0">
                        <div>
                          <div className="text-[9px] font-body text-[#9C9C96] uppercase tracking-wider">Price</div>
                          <div className="text-[10px] md:text-xs font-body font-semibold text-[#1A1A18]">{card.price}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-body text-[#9C9C96] uppercase tracking-wider">MOQ</div>
                          <div className="text-[10px] md:text-xs font-body font-semibold text-[#1A1A18]">{card.moq}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-body text-[#9C9C96] uppercase tracking-wider">Lead</div>
                          <div className="text-[10px] md:text-xs font-body font-semibold text-[#1A1A18]">{card.lead}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center pt-4 text-[10px] text-[#9C9C96] font-body tracking-wider uppercase">
                Interactive Sourcing Engine
              </div>
            </div>
          ) : (
            <motion.div
              key="inner-sequence"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full flex flex-col h-full justify-between"
            >
              <div>
                {/* Step 1: Brief Bubble */}
                <AnimatePresence>
                  {showBrief && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center gap-3 p-3.5 bg-[rgba(184,226,242,0.18)] border border-[rgba(184,226,242,0.3)] rounded-xl relative overflow-hidden"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#4A9EBF] flex-shrink-0 animate-pulse"></div>
                      <span className="text-xs md:text-sm font-body font-medium text-[#1A1A18] text-left leading-normal">
                        {truncatedBrief}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step 2: Cards */}
                <AnimatePresence>
                  {showCards && (
                    <div className="space-y-3 mt-4">
                      {MANU_CARDS.map((card, idx) => (
                        <motion.div
                          key={card.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.4, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                          className={`bg-white border border-[var(--color-bz-border)] rounded-xl p-3 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all duration-300 ${draftIndex === idx ? 'ring-2 ring-[rgba(184,226,242,0.6)] border-[#B8E2F2]' : ''}`}
                        >
                          <div className="flex flex-col text-left mr-2 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
                              <span className="text-xs md:text-sm font-body font-semibold text-[#1A1A18] truncate leading-tight">{card.name}</span>
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold font-body text-[#4A9EBF] bg-[rgba(184,226,242,0.25)] border border-[rgba(184,226,242,0.4)] flex-shrink-0">
                                ✓
                              </span>
                            </div>
                            <span className="text-[10px] md:text-xs font-body text-[#9C9C96] truncate">{card.location}</span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-x-2.5 text-right flex-shrink-0">
                            <div>
                              <div className="text-[9px] font-body text-[#9C9C96] uppercase tracking-wider">Price</div>
                              <div className="text-[10px] md:text-xs font-body font-semibold text-[#1A1A18]">{card.price}</div>
                            </div>
                            <div>
                              <div className="text-[9px] font-body text-[#9C9C96] uppercase tracking-wider">MOQ</div>
                              <div className="text-[10px] md:text-xs font-body font-semibold text-[#1A1A18]">{card.moq}</div>
                            </div>
                            <div>
                              <div className="text-[9px] font-body text-[#9C9C96] uppercase tracking-wider">Lead</div>
                              <div className="text-[10px] md:text-xs font-body font-semibold text-[#1A1A18]">{card.lead}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Step 3: AI Draft Email or Typing */}
              <div>
                <AnimatePresence mode="wait">
                  {animStage === 'typing' && (
                    <motion.div
                      key="typing-indicator"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="mt-4 p-4 bg-[#FFFFFF] border border-[rgba(184,226,242,0.3)] rounded-xl flex items-center gap-3 shadow-[0_4px_12px_rgba(184,226,242,0.1)]"
                    >
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A9EBF] animate-bounce" style={{ animationDelay: '0s' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A9EBF] animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A9EBF] animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                      <span className="text-[10px] md:text-xs font-body font-semibold text-[#4A9EBF] uppercase tracking-wider">
                        Drafting outreach email...
                      </span>
                    </motion.div>
                  )}
                  
                  {animStage === 'draft' && (
                    <motion.div
                      key="email-draft"
                      initial={{ opacity: 0, y: 6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.98 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-4 bg-[#FFFFFF] border border-[rgba(184,226,242,0.5)] rounded-xl p-4 shadow-[0_4px_12px_rgba(184,226,242,0.15)] text-left relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-full h-[3px] bg-[#B8E2F2]"></div>
                      <div className="flex items-center justify-between mb-2 pb-1 border-b border-[rgba(0,0,0,0.04)]">
                        <span className="text-[9px] md:text-[10px] font-body font-bold text-[#4A9EBF] uppercase tracking-widest">
                          AI Draft Email
                        </span>
                        <span className="text-[8px] md:text-[9px] font-body text-[#9C9C96]">
                          Ready to send
                        </span>
                      </div>
                      <div className="text-[10px] md:text-xs font-body text-[#1A1A18] space-y-1">
                        <p className="font-semibold text-[#5C5C57]">
                          To: <span className="font-normal text-[#9C9C96]">sourcing@{selectedManu.name.toLowerCase().replace(/\s+/g, '')}.com</span>
                        </p>
                        <p className="font-semibold text-[#5C5C57] pb-1.5 border-b border-[rgba(0,0,0,0.04)]">
                          Subject: <span className="font-normal text-[#9C9C96]">Partnership Inquiry</span>
                        </p>
                        <p className="text-[#5C5C57] leading-relaxed pt-1.5 whitespace-pre-line text-[9px] md:text-[11px]">
                          Hi {selectedManu.name.split(' ')[0]} Team, we’re looking to produce {truncatedBrief}.
                          Could you share your current pricing and capacity for this volume?
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
