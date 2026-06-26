import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Shield, ChevronDown } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import HeroCanvas from './HeroCanvas';
import { heroContainer, heroLabel, heroHeadline, heroSubtext, heroCta, heroStats, staggerFast, fadeUpFast } from '../lib/motion-variants';

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
    // Strip the emoji and just pass the text for the demo
    const cleanText = text.replace(/^[^\w]+\s/, '');
    window.dispatchEvent(new CustomEvent('populate-demo', { detail: cleanText }));
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineText = "From idea to verified manufacturer.";
  const headlineWords = headlineText.split(" ");

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
          
          <h1 id="hero-title" className="text-[clamp(2rem,6vw,4rem)] leading-[1.05] font-display font-[800] text-[#B8E2F2] tracking-[-1px] md:tracking-[-3px] mb-6">
            <div className="flex flex-wrap justify-center lg:justify-start">
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  variants={heroHeadline}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap mt-2 justify-center lg:justify-start">
              <motion.span className="inline-block mr-[0.25em]" variants={heroHeadline}>In</motion.span>
              <motion.span className="inline-block mr-[0.25em]" variants={heroHeadline}>minutes,</motion.span>
              <motion.span className="inline-block mr-[0.25em]" variants={heroHeadline}>not</motion.span>
              <motion.span className="inline-block line-through opacity-50" variants={heroHeadline}>months.</motion.span>
            </div>
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
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group"
              >
                See it work
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
              </button>
            </div>
            <motion.div variants={heroStats} className="flex items-center gap-2 text-left">
              <Shield className="w-3 h-3 text-[var(--color-bz-teal)] flex-shrink-0" />
              <span className="text-xs text-[var(--color-bz-text-faint)] font-body">
                Verified manufacturers across Turkey, Indonesia, and UAE
              </span>
            </motion.div>
          </motion.div>

          {/* Example Prompt Chips */}
          <motion.div 
            variants={staggerFast}
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
          >
            {[
              "Premium skincare packaging · MOQ 500 · Indonesia",
              "Heavyweight cotton hoodie · Turkey · under $9/unit",
              "Custom supplement jars · 30 day lead · halal certified"
            ].map((text, i) => (
              <motion.span
                key={i}
                variants={fadeUpFast}
              >
                <motion.button 
                  onClick={() => handleChipClick(text)}
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                  className="bg-[#FFFFFF] border-[1.5px] border-[rgba(184,226,242,0.5)] rounded-full py-3 px-5 text-sm font-body font-medium text-[var(--color-bz-text-muted)] hover:border-[#B8E2F2] hover:shadow-[0_2px_12px_rgba(184,226,242,0.3)] transition-all flex items-center gap-2 group relative overflow-hidden text-left"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B8E2F2] relative z-10 flex-shrink-0"></div>
                  <span className="relative z-10">{text}</span>
                  <span className="text-[var(--color-bz-text-faint)] group-hover:text-[var(--color-bz-teal-dark)] transition-colors relative z-10 ml-1">↗</span>
                </motion.button>
              </motion.span>
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
