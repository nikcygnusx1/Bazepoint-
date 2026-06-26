import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, sectionHeader, scaleUp } from '../lib/motion-variants';

export function FinalPush() {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isTouch) return;
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  return (
    <motion.section 
      className="py-32 bg-[var(--color-bz-surface)] border-y border-[var(--color-bz-border)] relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      {/* Abstract background shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[var(--color-bz-teal-light)] to-transparent opacity-20 blur-3xl pointer-events-none rounded-full"></div>
      
      <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
        <motion.div variants={sectionHeader}>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[var(--color-bz-text)] mb-6 leading-tight">
            Stop searching.<br />Start manufacturing.
          </h2>
          <p className="text-lg text-[var(--color-bz-text-muted)] font-body leading-relaxed mb-10 max-w-xl mx-auto">
            Join the founders using Bazepoint to bypass the noise and connect directly with vetted production partners.
          </p>
        </motion.div>
        
        <motion.div variants={scaleUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a 
            ref={buttonRef}
            href="#demo"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={isTouch ? {} : { x: springX, y: springY }}
            className="btn-primary !px-8 !py-4 text-base group w-full sm:w-auto text-center block"
          >
            Find your manufacturer
            <ArrowRight className="w-4 h-4 inline-block ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </motion.a>
          <span className="text-sm text-[var(--color-bz-text-faint)] font-body">Free to search. No credit card required.</span>
        </motion.div>
      </div>
    </motion.section>
  );
}
