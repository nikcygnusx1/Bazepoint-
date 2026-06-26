import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export function FinalPush() {
  return (
    <section className="py-32 md:py-48 bg-bz-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at center, #fff 1px, transparent 1px)',
        backgroundSize: '2rem 2rem'
      }}></div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 flex flex-col items-center">
        <h2 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter text-bz-white mb-12 leading-[0.9]">
          FORTUNE 500 LEVERAGE,<br/>
          <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1.5px var(--color-bz-white)' }}>FOR THE SOLO FOUNDER.</span>
        </h2>
        
        <button className="group relative px-10 py-5 bg-bz-white text-bz-black font-black uppercase text-sm tracking-widest overflow-hidden hover:bg-bz-orange transition-colors duration-0 mb-20">
          <span className="relative z-10 flex items-center gap-3 group-hover:text-bz-white group-hover:font-mono">
            DEPLOY ESCROW <ArrowRight className="w-5 h-5" />
          </span>
        </button>

        <div className="flex flex-col items-center border-t border-bz-border pt-12 w-full max-w-lg">
          <span className="text-[10px] uppercase tracking-[0.3em] text-bz-gray font-mono mb-8">Backed By</span>
          <div className="flex flex-wrap justify-center gap-12 opacity-60 grayscale brightness-200">
            {/* Using text logos as placeholders for actual SVGs to maintain the aesthetic */}
            <span className="font-bold text-lg tracking-tighter uppercase italic font-serif">FOUNDERS FUND</span>
            <span className="font-bold text-lg tracking-tighter uppercase font-sans">KLEINER PERKINS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
