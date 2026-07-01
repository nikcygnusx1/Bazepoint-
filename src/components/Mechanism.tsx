import { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, MessageSquare } from 'lucide-react';
import { BazeConsole } from './BazeConsole';
import { createPinnedSequence } from '../lib/use-gsap-scroll';

export function Mechanism() {
  const mechanismRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollTriggerInstance: any = null;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.min(1, Math.max(0, t));
    
    const lerpColor = (color1: {r: number, g: number, b: number}, color2: {r: number, g: number, b: number}, t: number) => {
      const r = Math.round(color1.r + (color2.r - color1.r) * t);
      const g = Math.round(color1.g + (color2.g - color1.g) * t);
      const b = Math.round(color1.b + (color2.b - color1.b) * t);
      return `rgb(${r}, ${g}, ${b})`;
    };

    const stop1 = { r: 245, g: 244, b: 240 }; // #F5F4F0
    const stop2 = { r: 240, g: 237, b: 232 }; // #F0EDE8
    const stop3 = { r: 234, g: 230, b: 224 }; // #EAE6E0

    const timer = setTimeout(() => {
      scrollTriggerInstance = createPinnedSequence({
        trigger: mechanismRef.current!,
        start: "top top",
        end: "+=300%",
        scrub: 1.5,
        pin: true,
        onUpdate: (progress) => {
          // Color interpolation
          let bgColor = '';
          if (progress < 0.5) {
            bgColor = lerpColor(stop1, stop2, progress / 0.5);
          } else {
            bgColor = lerpColor(stop2, stop3, (progress - 0.5) / 0.5);
          }
          if (mechanismRef.current) {
            mechanismRef.current.style.backgroundColor = bgColor;
          }

          // Step visibility logic
          if (progress < 0.35) {
            if (step1Ref.current) {
              step1Ref.current.style.opacity = '1';
              step1Ref.current.style.transform = 'translateX(0px) scale(1)';
            }
            if (step2Ref.current) {
              step2Ref.current.style.opacity = '0';
              step2Ref.current.style.transform = 'translateX(120px) scale(0.9)';
            }
            if (step3Ref.current) {
              step3Ref.current.style.opacity = '0';
              step3Ref.current.style.transform = 'translateX(-120px) scale(0.9)';
            }
          } else if (progress < 0.65) {
            const p = (progress - 0.35) / 0.30;
            if (step1Ref.current) {
              step1Ref.current.style.opacity = String(lerp(1, 0.3, p));
              step1Ref.current.style.transform = `translateX(${lerp(0, -60, p)}px) scale(${lerp(1, 0.85, p)})`;
            }
            if (step2Ref.current) {
              step2Ref.current.style.opacity = String(lerp(0, 1, p));
              step2Ref.current.style.transform = `translateX(${lerp(120, 0, p)}px) scale(${lerp(0.9, 1, p)})`;
            }
            if (step3Ref.current) {
              step3Ref.current.style.opacity = '0';
              step3Ref.current.style.transform = 'translateX(-120px) scale(0.9)';
            }
          } else {
            const p = (progress - 0.65) / 0.35;
            if (step1Ref.current) {
              step1Ref.current.style.opacity = String(lerp(0.3, 0.1, p));
              step1Ref.current.style.transform = 'translateX(-60px) scale(0.85)';
            }
            if (step2Ref.current) {
              step2Ref.current.style.opacity = String(lerp(1, 0.3, p));
              step2Ref.current.style.transform = `translateX(${lerp(0, -60, p)}px) scale(${lerp(1, 0.85, p)})`;
            }
            if (step3Ref.current) {
              step3Ref.current.style.opacity = String(lerp(0, 1, p));
              step3Ref.current.style.transform = `translateX(${lerp(-120, 0, p)}px) scale(${lerp(0.9, 1, p)})`;
            }
          }

          // Progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${progress * 100}%`;
          }
        }
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (scrollTriggerInstance) scrollTriggerInstance.kill();
    };
  }, []);

  return (
    <section 
      ref={mechanismRef}
      id="mechanism"
      aria-labelledby="mechanism-title"
      className="py-24 relative overflow-hidden bg-[var(--color-bz-bg)] mechanism-section min-h-screen flex flex-col justify-center"
    >
      {/* Progress bar */}
      <div 
        ref={progressBarRef}
        className="absolute top-0 left-0 h-[3px] bg-[var(--color-bz-teal-dark)] transition-all duration-75 z-50"
        style={{ width: 0 }} 
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10 w-full flex-grow flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 id="mechanism-title" className="section-label justify-center mb-4">How it works</h2>
          <p className="text-3xl md:text-4xl font-display font-serif font-[800] tracking-[-1px] text-[var(--color-bz-text)]">
            Stop searching Alibaba.<br />Start building.
          </p>
        </div>

        {/* Bento Step cards container */}
        <div className="relative w-full max-w-5xl mx-auto h-[540px] md:h-[420px]">
          {/* Card 1 */}
          <div 
            ref={step1Ref} 
            className="absolute inset-0 bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm transition-all duration-75"
          >
            <div className="md:w-1/2 text-left">
              <div className="w-12 h-12 rounded-full bg-[var(--color-bz-teal-dark)] text-white flex items-center justify-center mb-4">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-[var(--color-bz-text)] mb-4">
                1. Describe your product
              </h3>
              <p className="text-[var(--color-bz-text-muted)] font-body text-base leading-relaxed">
                Type what you need in plain language. Baze searches our verified factory network and returns your top matches in under 90 seconds.
              </p>
            </div>
            <div className="md:w-1/2 w-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <BazeConsole mode="fragment" zone="brief" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            ref={step2Ref} 
            className="absolute inset-0 bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm transition-all duration-75"
            style={{ opacity: 0, transform: 'translateX(120px) scale(0.9)' }}
          >
            <div className="md:w-1/2 text-left">
              <div className="w-12 h-12 rounded-full bg-[var(--color-bz-teal-dark)] text-white flex items-center justify-center mb-4">
                <Filter className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-[var(--color-bz-text)] mb-4">
                2. AI filters the verified network
              </h3>
              <p className="text-[var(--color-bz-text-muted)] font-body text-base leading-relaxed">
                Baze filters by MOQ, budget, product category, and region. Only factories that match your exact requirements come through.
              </p>
            </div>
            <div className="md:w-1/2 w-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <BazeConsole mode="fragment" zone="list" highlightRow={0} />
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            ref={step3Ref} 
            className="absolute inset-0 bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-between shadow-sm transition-all duration-75"
            style={{ opacity: 0, transform: 'translateX(-120px) scale(0.9)' }}
          >
            <div className="md:w-1/2 text-left">
              <div className="w-12 h-12 rounded-full bg-[var(--color-bz-teal-dark)] text-white flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-display font-bold tracking-tight text-[var(--color-bz-text)] mb-4">
                3. Email drafted, ready to send
              </h3>
              <p className="text-[var(--color-bz-text-muted)] font-body text-base leading-relaxed">
                Your intro email includes the factory's name, your product brief, and your target MOQ. Send it in one click — no editing needed.
              </p>
            </div>
            <div className="md:w-1/2 w-full flex items-center justify-center">
              <div className="w-full max-w-md">
                <BazeConsole mode="fragment" zone="email" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
