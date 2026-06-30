import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import HeroCanvas from './HeroCanvas';
import { WordReveal } from './WordReveal';
import { heroContainer, heroLabel, heroSubtext, heroCta, revealVariant, buttonHoverProps } from '../lib/motion-variants';

export function Hero() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleFocus = (e: CustomEvent) => setIsInputFocused(e.detail);
    const handleSearch = (e: CustomEvent) => setIsSearching(e.detail);
    window.addEventListener('demo-focus', handleFocus as EventListener);
    window.addEventListener('demo-searching', handleSearch as EventListener);
    return () => {
      window.removeEventListener('demo-focus', handleFocus as EventListener);
      window.removeEventListener('demo-searching', handleSearch as EventListener);
    };
  }, []);

  const handleChipClick = (text: string) => {
    const cleanText = text.replace(/^[^[\w]+\s/, '');
    window.dispatchEvent(new CustomEvent('populate-demo', { detail: cleanText }));
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineText = "Tell Baze what you want to make. Get three verified factories, ready to talk.";

  return (
    <motion.section 
      aria-labelledby="hero-title"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className="relative pt-[120px] pb-[80px] min-h-[90vh] flex items-center overflow-hidden bg-bz-bg"
    >
      {/* Hero canvas — absolutely fills the section, pointer-events none */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        aria-hidden="true"
      >
        <HeroCanvas
          isFocused={isInputFocused}
          isSearching={isSearching}
          className="w-full h-full"
        />
      </div>

      <div className="hero-ambient-bg z-0 relative" aria-hidden="true" />
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0" style={{
        backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(201,107,42,0.03) 100%)',
      }}></div>
      
      {/* Decorative Circular Outline */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full border border-[var(--color-bz-border)] opacity-40 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column: Copy and CTAs */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
          <motion.div 
            variants={heroLabel}
            className="mb-8 inline-flex items-center gap-2 bg-[rgba(184,226,242,0.3)] text-[#4A9EBF] border border-[rgba(184,226,242,0.4)] px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#4A9EBF]"></div>
            <span>AI Sourcing Agent</span>
          </motion.div>
          
          <h1 id="hero-title" className="text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.05] font-display font-[800] text-[#4A9EBF] tracking-[-1px] md:tracking-[-3px] mb-6">
            <WordReveal text={headlineText} delay={0.15} />
          </h1>
          
          <motion.p 
            variants={heroSubtext}
            className="max-w-[480px] text-base md:text-lg text-[var(--color-bz-text-muted)] leading-[1.7] font-body font-normal mb-10"
          >
            Describe your product in plain language. Baze searches a vetted manufacturing network across MENA, Southeast Asia and Oceania, filters by your budget and MOQs, and drafts your first outreach email — ready to send.
          </motion.p>
          
          <motion.div 
            variants={heroCta}
            className="flex flex-col gap-4 mb-12 items-center lg:items-start"
          >
            <div className="flex">
              <motion.button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                {...buttonHoverProps}
                className="btn-primary group"
              >
                See it work
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
              </motion.button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mt-4 text-left w-full max-w-[480px]">
              {[
                "✓ Verified factories only — no directories, no brokers",
                "✓ Free during beta. No account needed",
                "✓ Strict IP Protection — isolated model runs",
                "✓ First factory match in under 90 seconds"
              ].map((text, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + 0.08 * idx, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-1.5 text-xs text-[var(--color-bz-text-faint)] font-body"
                >
                  <span className="text-[#4A9EBF] font-bold mt-0.5">✓</span>
                  <span>{text.replace(/^✓\s*/, '')}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Example Prompt Chips */}
          <motion.div 
            variants={revealVariant}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            {[
              "Premium skincare packaging · MOQ 500 · Indonesia",
              "Heavyweight cotton hoodie · Turkey · under $9/unit",
              "Custom supplement jars · 30 day lead · halal certified"
            ].map((text, i) => (
              <span key={i}>
                <button 
                  onClick={() => handleChipClick(text)}
                  className="bg-[#FFFFFF] border-[1.5px] border-[rgba(184,226,242,0.5)] rounded-full py-3 px-5 text-sm font-body font-medium text-[var(--color-bz-text-muted)] hover:border-[#B8E2F2] hover:shadow-[0_2px_12px_rgba(184,226,242,0.3)] transition-all flex items-center gap-2 group relative overflow-hidden text-left cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B8E2F2] relative z-10 flex-shrink-0"></div>
                  <span className="relative z-10">{text}</span>
                  <span className="text-[var(--color-bz-text-faint)] group-hover:text-[var(--color-bz-teal-dark)] transition-colors relative z-10 ml-1">↗</span>
                </button>
              </span>
            ))}
          </motion.div>
        </div>

        {/* Right Column: HeroVisual Interactive Stage */}
        <div className="col-span-1 lg:col-span-5 w-full flex items-center justify-center">
          <HeroVisual />
        </div>

      </div>

      {/* Scroll indicator */}
      <motion.button
        style={{ opacity: indicatorOpacity }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-bz-text-faint)] hover:text-[var(--color-bz-text-muted)] transition-colors"
        aria-label="Scroll to demo"
      >
        <ChevronDown size={18} />
      </motion.button>

    </motion.section>
  );
}
