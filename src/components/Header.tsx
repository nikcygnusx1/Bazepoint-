import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Lock, CheckCircle2 } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bz-black/80 backdrop-blur-md border-b border-bz-border py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 bg-bz-green rounded-full animate-pulse"></div>
              <span className="text-[10px] text-bz-gray uppercase tracking-[0.2em] font-mono">System Secure</span>
            </div>
            <a href="#" className="text-2xl font-bold tracking-tighter italic font-serif text-bz-white hover:text-bz-offwhite transition-colors">
              BAZEPOINT.
            </a>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-semibold text-bz-gray">
            <a href="#mechanism" className="hover:text-bz-white transition-colors">The Protocol</a>
            <a href="#supply" className="hover:text-bz-white transition-colors">Verified Supply</a>
            <a href="#trap" className="hover:text-bz-white transition-colors">The Agent Trap</a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="hidden md:flex text-[11px] uppercase tracking-widest font-semibold text-bz-gray hover:text-bz-white transition-colors">
            Login
          </a>
          <button className="group relative px-6 py-3 bg-bz-white text-bz-black font-black uppercase text-xs tracking-widest overflow-hidden hover:bg-bz-orange transition-colors duration-0">
            <span className="relative z-10 flex items-center gap-2 group-hover:text-bz-white group-hover:font-mono">
              INITIATE <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
