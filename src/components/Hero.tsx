import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Shield, ChevronDown } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { heroContainer, heroLabel, heroHeadline, heroSubtext, heroCta, heroStats, staggerFast, fadeUpFast } from '../lib/motion-variants';

export function Hero() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const handleChipClick = (text: string) => {
    // Strip the emoji and just pass the text for the demo
    const cleanText = text.replace(/^[^\w]+\s/, '');
    window.dispatchEvent(new CustomEvent('populate-demo', { detail: cleanText }));
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineText = "From idea to verified manufacturer.";
  const headlineWords = headlineText.split(" ");
  const subHeadlineText = "In minutes, not months.";
  const subHeadlineWords = subHeadlineText.split(" ");

  return (
    <motion.section 
      variants={heroContainer}
      initial="hidden"
      animate="visible"
      className="relative pt-[120px] pb-[80px] min-h-[90vh] flex items-center overflow-hidden bg-bz-bg"
    >
      <div className="hero-ambient-bg" aria-hidden="true" />
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-50 z-0" style={{
        backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(201,107,42,0.03) 100%)',
      }}></div>
      
      {/* Decorative Circular Outline */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full border border-[var(--color-bz-border)] opacity-40 pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left: Copy & CTA */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
          <motion.div 
            variants={heroLabel}
            className="mb-8 flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-bz-teal)]"></div>
            <span className="section-label">AI Sourcing Agent</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-hero leading-[1.05] font-serif font-normal text-[var(--color-bz-text)] mb-6">
            <div className="flex flex-wrap">
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
            <div className="flex flex-wrap mt-2">
              <motion.span className="inline-block mr-[0.25em]" variants={heroHeadline}>In</motion.span>
              <motion.span className="inline-block mr-[0.25em] text-[var(--color-bz-teal)]" variants={heroHeadline}>minutes,</motion.span>
              <motion.span className="inline-block mr-[0.25em]" variants={heroHeadline}>not</motion.span>
              <motion.span className="inline-block line-through opacity-50" variants={heroHeadline}>months.</motion.span>
            </div>
          </h1>
          
          <motion.p 
            variants={heroSubtext}
            className="max-w-[480px] text-base md:text-lg text-[var(--color-bz-text-muted)] leading-[1.7] font-body font-light mb-10"
          >
            Tell Baze what you want to make. We find verified manufacturers across Southeast Asia, MENA and Oceania, filter by your budget and MOQ, and draft your first outreach email — ready to send.
          </motion.p>
          
          <motion.div 
            variants={heroCta}
            className="flex flex-col gap-4 mb-12"
          >
            <div className="flex">
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group"
              >
                Describe your product
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
              </button>
            </div>
            <motion.div variants={heroStats} className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-[var(--color-bz-teal)]" />
              <span className="text-xs text-[var(--color-bz-text-faint)] font-body">
                Verified manufacturers across Turkey, Vietnam, Indonesia, Malaysia & UAE
              </span>
            </motion.div>
          </motion.div>

          {/* Example Prompt Chips */}
          <motion.div 
            variants={staggerFast}
            className="flex flex-wrap gap-3"
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
                  className="bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-full py-2 px-4 text-xs font-body font-medium text-[var(--color-bz-text)] hover:border-[var(--color-bz-teal)] hover:bg-[var(--color-bz-teal-light)] transition-colors flex items-center gap-2 group relative overflow-hidden"
                >
                  <span className="relative z-10">{text}</span>
                  <span className="text-[var(--color-bz-text-faint)] group-hover:text-[var(--color-bz-teal)] transition-colors relative z-10">↗</span>
                </motion.button>
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Right: Interactive Visual */}
        <div className="col-span-1 lg:col-span-5 w-full h-[300px] lg:h-[560px]">
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
