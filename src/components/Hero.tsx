import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Shield, ChevronDown } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import HeroCanvas from './HeroCanvas';
import { heroContainer, heroLabel, heroCta, heroStats, revealVariant, buttonHoverProps } from '../lib/motion-variants';
import { createPinnedSequence, splitTextToSpans, createCharParticleTimeline } from '../lib/use-gsap-scroll';

export function Hero() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const ghostY = useTransform(scrollY, [0, 600], [0, -80]);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const heroHeadlineRef = useRef<HTMLHeadingElement>(null);
  const heroBodyRef = useRef<HTMLParagraphElement>(null);
  const heroCTARef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    let revertFn: (() => void) | null = null;
    let scrollTriggerInstance: any = null;
    let tl: any = null;

    const timer = setTimeout(() => {
      if (!heroHeadlineRef.current) return;
      const { chars, revert } = splitTextToSpans(heroHeadlineRef.current, { type: 'chars' });
      revertFn = revert;

      tl = createCharParticleTimeline(chars, { direction: 'shatter' });
      tl.pause();

      scrollTriggerInstance = createPinnedSequence({
        trigger: heroRef.current!,
        start: "bottom 90%",
        end: "+=80%",
        scrub: 1.2,
        onUpdate: (progress) => {
          const p = Math.min(1, Math.max(0, progress / 0.5));
          if (tl) tl.progress(p);
          
          if (heroBodyRef.current) {
            heroBodyRef.current.style.opacity = String(1 - p);
          }
          if (heroCTARef.current) {
            heroCTARef.current.style.opacity = String(1 - p);
          }
          if (canvasWrapperRef.current) {
            canvasWrapperRef.current.style.transform = `scaleY(${1 - p * 0.7})`;
            canvasWrapperRef.current.style.opacity = String(1 - p);
          }
        }
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (revertFn) revertFn();
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, []);

  const handleChipClick = (text: string) => {
    const cleanText = text.replace(/^[^\w]+\s/, '');
    window.dispatchEvent(new CustomEvent('populate-demo', { detail: cleanText }));
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section 
      ref={heroRef}
      aria-labelledby="hero-title"
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className="relative pt-[120px] pb-[80px] min-h-[90vh] flex items-center overflow-hidden bg-bz-bg"
    >
      {/* Hero canvas — absolutely fills the section, pointer-events-auto for hover detection */}
      <div
        ref={canvasWrapperRef}
        className="absolute inset-0 z-[1] pointer-events-auto"
        aria-hidden="true"
        data-cursor="drag"
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
          
          <div className="relative mb-6 w-full">
            {/* Ghost headline — parallax depth layer */}
            <motion.h1
              aria-hidden="true"
              className="text-[clamp(2rem,6vw,4rem)] leading-[1.05] font-serif font-normal tracking-[-1px] md:tracking-[-3px] hero-ghost-headline"
              style={{
                y: ghostY,
                color: 'transparent',
                WebkitTextStroke: '1px rgba(184,226,242,0.12)',
                x: 2,
                filter: 'blur(0.4px)',
                userSelect: 'none',
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: -1,
              }}
            >
              Your product idea meets the <em className="italic">right factory.</em> In minutes, not months.
            </motion.h1>

            <h1 
              ref={heroHeadlineRef}
              id="hero-title" 
              className="text-[clamp(2rem,6vw,4rem)] leading-[1.05] font-serif font-normal text-[#B8E2F2] tracking-[-1px] md:tracking-[-3px] relative z-10"
            >
              Your product idea meets the <em className="italic">right factory.</em> In minutes, not months.
            </h1>
          </div>
          
          <motion.p 
            ref={heroBodyRef}
            variants={revealVariant}
            className="max-w-[480px] text-base md:text-lg text-[var(--color-bz-text-muted)] leading-[1.7] font-body font-normal mb-10"
          >
            Describe what you want to make. We'll search verified factories in Turkey, Indonesia, and the UAE. You'll get matches filtered by budget and MOQ with drafted outreach emails.
          </motion.p>
          
          <motion.div 
            ref={heroCTARef}
            variants={heroCta}
            className="flex flex-col gap-4 mb-12 items-center lg:items-start"
          >
            <div className="flex">
              <motion.button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                {...buttonHoverProps}
                className="btn-primary group font-body"
              >
                See it work
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
              </motion.button>
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
