import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navContainer, navItem } from '../lib/motion-variants';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const headerPy    = useTransform(scrollY, [0, 80], [24, 16]);  // padding-y (py-6 is 24px, py-4 is 16px)
  const headerBlur  = useTransform(scrollY, [0, 80], [0, 12]);   // backdrop blur
  const headerBg    = useTransform(
    scrollY,
    [0, 80],
    ["rgba(245,244,240,0)", "rgba(245,244,240,0.85)"]
  );
  const headerBorder = useTransform(
    scrollY,
    [0, 80],
    ["rgba(224,219,211,0)", "rgba(224,219,211,1)"]
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
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

  const navLinks = [
    { name: 'How it works', href: '#mechanism' },
    { name: 'Verified network', href: '#supply' },
    { name: 'Why Bazepoint', href: '#trap' },
  ];

  return (
    <motion.header
      initial="hidden"
      animate="visible"
      variants={navContainer}
      className="fixed top-0 left-0 right-0 z-50 border-b will-change-transform"
      style={{
        paddingTop: headerPy,
        paddingBottom: headerPy,
        backgroundColor: headerBg,
        backdropFilter: useMotionTemplate`blur(${headerBlur}px)`,
        borderBottomColor: headerBorder,
      }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
        
        {/* Logo */}
        <motion.div 
          variants={navItem}
          className="flex items-center gap-3"
        >
          <div className="bg-[#B8E2F2] rounded-[10px] w-8 h-8 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="#4A9EBF" strokeWidth="1.5" />
              <path d="M10 1 L10 19" stroke="#4A9EBF" strokeWidth="1.5" />
            </svg>
          </div>
          <a href="#" className="font-body text-[22px] text-[var(--color-bz-text)] font-semibold leading-none hover:opacity-80 transition-opacity">
            Bazepoint
          </a>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.li key={link.name} variants={navItem} className="list-none">
              <motion.a
                className="relative text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors duration-200 text-sm font-medium py-1 inline-block"
                href={link.href}
                whileHover="hover"
              >
                {link.name}
                <motion.span
                  className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[var(--color-bz-teal)] origin-left"
                  variants={{
                    initial: { scaleX: 0 },
                    hover:   { scaleX: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  initial="initial"
                />
              </motion.a>
            </motion.li>
          ))}
        </nav>

        {/* Desktop CTA */}
        <motion.div
          variants={navItem}
          className="hidden md:block"
        >
          <motion.button 
            ref={buttonRef}
            className="btn-primary group"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={isTouch ? {} : { x: springX, y: springY }}
          >
            Describe your product 
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden text-bz-text-muted"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence mode="wait">
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[#F5F4F0] border-b border-[var(--color-bz-border)] absolute top-full left-0 right-0 shadow-md"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-base font-medium text-[var(--color-bz-text-muted)] py-3 border-b border-[var(--color-bz-border-soft)] hover:text-[var(--color-bz-text)] transition-colors block"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 pb-2">
                <button 
                  className="btn-primary w-full justify-center group"
                  onClick={() => {
                    setMenuOpen(false);
                    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Describe your product 
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
