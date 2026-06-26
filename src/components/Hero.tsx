import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-40 pb-24 md:pt-48 md:pb-32 min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
        backgroundSize: '4rem 4rem'
      }}></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left: Copy & CTA */}
        <div className="col-span-1 lg:col-span-8 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
            className="mb-8 flex items-center gap-4"
          >
            <div className="h-px w-12 bg-bz-white opacity-30"></div>
            <span className="text-[11px] uppercase tracking-[0.4em] text-bz-orange font-bold font-mono">Institutional-Grade Trust Layer</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            className="text-5xl sm:text-7xl md:text-[90px] lg:text-[110px] leading-[0.85] font-black tracking-tighter uppercase mb-8 font-serif"
          >
            ELIMINATE<br/>
            <span className="text-transparent stroke-white" style={{ WebkitTextStroke: '1.5px var(--color-bz-white)' }}>UNCERTAINTY.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="max-w-2xl text-lg md:text-xl text-bz-gray leading-relaxed font-light mb-12"
          >
            Bazepoint is the world’s first <span className="text-bz-white font-medium">AI-native trust layer</span> for global manufacturing. We replace blind risk with mathematical verification and milestone-backed escrow.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-8"
          >
            <button className="group px-8 py-5 bg-bz-white text-bz-black font-black uppercase text-sm tracking-tighter hover:bg-bz-orange transition-colors duration-0 flex items-center gap-3">
              <span className="group-hover:text-bz-white group-hover:font-mono transition-none">Begin Synthesis</span>
              <ArrowRight className="w-5 h-5 group-hover:text-bz-white transition-none" />
            </button>
            <div className="flex flex-col border-l border-bz-border pl-6">
              <span className="text-3xl font-bold font-mono text-bz-white tracking-tight">12,402<span className="text-bz-orange">+</span></span>
              <span className="text-[10px] uppercase tracking-widest text-bz-gray font-mono mt-1">Verified Manufacturers</span>
            </div>
          </motion.div>
        </div>

        {/* Right: Verification Terminal Snippet */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="col-span-1 lg:col-span-4"
        >
          <div className="bg-bz-onyx border border-bz-border p-6 shadow-2xl relative overflow-hidden group">
            {/* Ambient scan line */}
            <div className="absolute top-0 left-0 w-full h-px bg-bz-orange/50 shadow-[0_0_10px_rgba(255,78,0,0.5)] animate-[scan_3s_ease-in-out_infinite]"></div>
            
            <div className="flex justify-between items-center mb-6 border-b border-bz-border pb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-bz-gray italic">System Readout // Secure</span>
              <ShieldCheck className="w-4 h-4 text-bz-green" />
            </div>
            
            <div className="space-y-5 font-mono text-xs">
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] text-bz-gray uppercase mb-1">Target Match</span>
                  <span className="text-bz-white font-bold">Apparel Facility TR-04</span>
                </div>
                <span className="text-bz-green bg-bz-green/10 px-2 py-1 text-[9px] uppercase tracking-wider font-bold">Verified</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bz-charcoal border border-bz-border p-3">
                  <span className="block text-[9px] text-bz-gray uppercase mb-1">Quality Score</span>
                  <span className="text-bz-white font-bold">98.4 / 100</span>
                </div>
                <div className="bg-bz-charcoal border border-bz-border p-3">
                  <span className="block text-[9px] text-bz-gray uppercase mb-1">On-Time Rate</span>
                  <span className="text-bz-white font-bold">99.1%</span>
                </div>
              </div>
              
              <div className="border-l-2 border-bz-orange pl-4 py-1">
                <span className="block text-[10px] text-bz-gray uppercase mb-1">Escrow Status</span>
                <span className="text-bz-white flex items-center gap-2">
                  <Lock className="w-3 h-3 text-bz-orange" />
                  Milestone Lock Active
                </span>
              </div>
              
              <div className="pt-2 border-t border-bz-border">
                <span className="block text-[9px] text-bz-gray uppercase mb-1">Protocol Hash</span>
                <span className="text-[10px] text-bz-gray opacity-60 break-all leading-relaxed">0x8f2d4...93k2_TRUST_ENFORCED</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
