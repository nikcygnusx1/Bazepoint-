import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Terminal, Cpu, CheckCircle2 } from 'lucide-react';

const SUGGESTIONS = [
  "Premium Skincare Packaging, MOQ 500",
  "Heavyweight Cotton Hoodies, Turkey",
  "Custom Supplement Jars, 30 days lead"
];

export function PromptDemo() {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsProcessing(true);
    setResults(false);
    
    setTimeout(() => {
      setIsProcessing(false);
      setResults(true);
    }, 2000);
  };

  return (
    <section className="py-24 bg-bz-charcoal border-y border-bz-border relative overflow-hidden" id="demo">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-bz-orange font-mono mb-4">The Synthesis Engine</h2>
          <p className="text-3xl md:text-5xl font-serif font-bold uppercase tracking-tight text-bz-white">
            Command Your Supply Chain.
          </p>
        </div>

        {/* Input Terminal */}
        <div className="bg-bz-onyx border border-bz-border p-2 shadow-2xl relative">
          <form onSubmit={handleSubmit} className="relative flex items-center bg-bz-black border border-bz-border p-2">
            <div className="pl-4 pr-3 text-bz-orange">
              <Terminal className="w-5 h-5" />
            </div>
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What do you want to make?"
              className="w-full bg-transparent border-none outline-none text-bz-white font-mono text-sm placeholder:text-bz-gray/50 py-4"
              disabled={isProcessing || results}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isProcessing || results}
              className="px-6 py-4 bg-bz-white text-bz-black font-black uppercase text-xs tracking-widest hover:bg-bz-orange hover:text-bz-white disabled:opacity-50 disabled:hover:bg-bz-white disabled:hover:text-bz-black transition-colors"
            >
              Execute
            </button>
          </form>
          
          <AnimatePresence mode="wait">
            {!isProcessing && !results && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-4 flex flex-wrap gap-2"
              >
                <span className="text-[10px] text-bz-gray uppercase tracking-widest font-mono mr-2 py-2">Examples:</span>
                {SUGGESTIONS.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setInput(s)}
                    className="text-xs font-mono text-bz-gray border border-bz-border px-3 py-1.5 hover:border-bz-orange hover:text-bz-white transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}

            {isProcessing && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-8 border-t border-bz-border flex flex-col items-center justify-center gap-4 font-mono text-xs text-bz-orange"
              >
                <Cpu className="w-6 h-6 animate-pulse" />
                <div className="uppercase tracking-widest animate-pulse">Parsing Intent & Auditing Supply Network...</div>
              </motion.div>
            )}

            {results && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 border-t border-bz-border bg-bz-charcoal/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] text-bz-green uppercase font-mono tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Synthesis Complete
                  </span>
                  <span className="text-[10px] text-bz-gray uppercase font-mono">Found 3 Verified Matches</span>
                </div>
                
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-bz-onyx border border-bz-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-bz-white mb-1">Manufacturer ID: TR-{(Math.random()*1000).toFixed(0)}</span>
                        <span className="text-[10px] text-bz-gray font-mono uppercase">Istanbul, Turkey</span>
                      </div>
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-6 font-mono text-xs">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-bz-gray uppercase">Est. Price</span>
                          <span className="text-bz-white">$8.20/unit</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] text-bz-gray uppercase">MOQ</span>
                          <span className="text-bz-white">500</span>
                        </div>
                        <button className="col-span-2 sm:col-span-1 mt-2 sm:mt-0 text-[10px] uppercase tracking-widest text-bz-orange border border-bz-orange px-4 py-2 hover:bg-bz-orange hover:text-bz-black transition-colors text-center font-bold">
                          View Protocol
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button 
                  onClick={() => { setInput(''); setResults(false); }}
                  className="mt-6 text-[10px] text-bz-gray uppercase font-mono hover:text-bz-white underline underline-offset-4"
                >
                  Reset Terminal
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
