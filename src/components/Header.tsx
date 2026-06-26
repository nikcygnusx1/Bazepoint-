import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'How it works', href: '#mechanism' },
    { name: 'Verified network', href: '#supply' },
    { name: 'Why Bazepoint', href: '#trap' },
  ];

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-bz-surface/90 backdrop-blur-sm border-b border-bz-border py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex items-center justify-between">
        
        {/* Logo */}
        <motion.div 
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" stroke="var(--color-bz-teal)" strokeWidth="1.5" />
            <path d="M10 1 L10 19" stroke="var(--color-bz-teal)" strokeWidth="1.5" />
          </svg>
          <a href="#" className="font-serif text-[22px] text-bz-text leading-none mt-1 hover:opacity-80 transition-opacity">
            Bazepoint
          </a>
        </motion.div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.name}
              href={link.href}
              initial={{ opacity: 0 }}
              animate={{ opacity: scrolled ? 1 : 0.7 }}
              transition={{ duration: 0.3, delay: 0.2 + (i * 0.06) }}
              className="font-body text-sm font-medium text-bz-text-muted hover:text-bz-text transition-colors"
            >
              {link.name}
            </motion.a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
          className="hidden md:block"
        >
          <button 
            className="btn-primary group"
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Describe your product 
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
          </button>
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
            className="md:hidden overflow-hidden bg-bz-surface-2 border-b border-bz-border absolute top-full left-0 right-0 shadow-md"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-base font-medium text-bz-text-muted py-3 border-b border-bz-border-soft hover:text-bz-text transition-colors block"
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
