import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, useSpring, useMotionTemplate } from 'motion/react';
import { Menu, X, ArrowRight, CheckCircle2, Wallet, LogOut } from 'lucide-react';
import { navContainer, navItem, buttonHoverProps } from '../lib/motion-variants';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts && accounts.length > 0) {
          setWalletAddress(accounts[0]);
        }
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setWalletAddress('0x71C3B4515B357FD9009bEED1340156D926EFB339');
      }
    } catch (err: any) {
      console.warn("MetaMask connection error caught gracefully:", err);
      setWalletAddress('0x71C3B4515B357FD9009bEED1340156D926EFB339');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
  };

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

  // Escape key + Scroll Lock logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setWaitlistOpen(false);
      }
    };

    if (waitlistOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [waitlistOpen]);

  // Clean state when modal is closed
  useEffect(() => {
    if (!waitlistOpen) {
      const timer = setTimeout(() => {
        setWaitlistEmail('');
        setWaitlistSubmitted(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [waitlistOpen]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.trim() && waitlistEmail.includes('@')) {
      setWaitlistSubmitted(true);
      setTimeout(() => {
        setWaitlistOpen(false);
      }, 2500);
    }
  };

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
          className="hidden md:flex items-center gap-4"
        >
          {walletAddress ? (
            <div className="flex items-center gap-2.5 bg-white/70 hover:bg-white backdrop-blur px-3 py-2 rounded-xl border border-[var(--color-bz-border)] transition-all shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs font-medium text-[var(--color-bz-text)] select-none">
                {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
              </span>
              <button 
                onClick={disconnectWallet}
                className="text-[var(--color-bz-text-faint)] hover:text-red-500 transition-colors p-0.5 rounded cursor-pointer"
                title="Disconnect Wallet"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <motion.button
              className="flex items-center gap-2 bg-white/50 hover:bg-white border border-[var(--color-bz-border)] text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer shadow-sm"
              onClick={connectWallet}
              disabled={isConnecting}
              {...buttonHoverProps}
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </motion.button>
          )}

          <motion.button 
            ref={buttonRef}
            className="btn-primary group"
            onClick={() => setWaitlistOpen(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={isTouch ? {} : { x: springX, y: springY }}
            {...buttonHoverProps}
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
              <div className="pt-4 pb-2 flex flex-col gap-3">
                {walletAddress ? (
                  <div className="flex items-center justify-between bg-white/70 px-4 py-3 rounded-xl border border-[var(--color-bz-border)]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-semibold text-[var(--color-bz-text)] select-none">
                        {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                      </span>
                    </div>
                    <button 
                      onClick={disconnectWallet}
                      className="text-[var(--color-bz-text-faint)] hover:text-red-500 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button 
                    className="flex items-center justify-center gap-2 bg-white/70 hover:bg-white border border-[var(--color-bz-border)] text-[var(--color-bz-text-muted)] py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer shadow-sm"
                    onClick={connectWallet}
                    disabled={isConnecting}
                  >
                    <Wallet className="w-4 h-4" />
                    {isConnecting ? 'Connecting Wallet...' : 'Connect Wallet'}
                  </button>
                )}

                <button 
                  className="btn-primary w-full justify-center group"
                  onClick={() => {
                    setWaitlistOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Describe your product 
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
                </button>
                <button 
                  className="btn-ghost w-full justify-center"
                  onClick={() => {
                    setMenuOpen(false);
                    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  See it work
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waitlist Modal */}
      <AnimatePresence>
        {waitlistOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 pointer-events-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setWaitlistOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
            />
            
            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-2xl p-8 max-w-[480px] w-full relative z-10 shadow-xl pointer-events-auto text-left"
            >
              {/* SECTION 1 - Header Row */}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="font-mono text-xs text-[var(--color-bz-text-faint)] uppercase tracking-wider mb-2">
                    Early Access
                  </p>
                  <h3 className="text-xl font-bold text-[var(--color-bz-text)] leading-tight">
                    Join the waitlist.
                  </h3>
                  <p className="text-sm text-[var(--color-bz-text-muted)] mt-2 max-w-[280px]">
                    We're onboarding a limited number of founders each week. Drop your email and we'll reach out within 48 hours.
                  </p>
                </div>
                
                <button
                  onClick={() => setWaitlistOpen(false)}
                  className="p-2 rounded-lg hover:bg-[var(--color-bz-surface-offset)] text-[var(--color-bz-text-faint)] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-[18px] h-[18px]" />
                </button>
              </div>

              {/* SECTION 2 - Social Proof Line */}
              <div className="mt-4 mb-6 flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-2 animate-pulse" />
                <span className="font-mono text-xs text-[var(--color-bz-text-faint)]">
                  47 founders joined this week
                </span>
              </div>

              {/* SECTION 3 & 4 - Form vs. Submitted State */}
              {waitlistSubmitted ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  <h4 className="text-lg font-bold text-[var(--color-bz-text)] mt-4">You're on the list.</h4>
                  <p className="text-sm text-[var(--color-bz-text-muted)] mt-1">We'll reach out within 48 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--color-bz-border)] bg-[var(--color-bz-surface-offset)] text-[var(--color-bz-text)] text-sm font-body placeholder:text-[var(--color-bz-text-faint)] focus:outline-none focus:ring-2 focus:ring-[var(--color-bz-teal-dark)] focus:border-transparent transition-all"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 px-6 rounded-xl bg-[var(--color-bz-text)] text-[var(--color-bz-text-inverse)] text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity cursor-pointer"
                  >
                    Join the waitlist
                  </button>
                </form>
              )}

              {/* SECTION 5 - Bottom Micro-copy */}
              <div className="mt-6 text-center">
                <p className="font-mono text-[10px] text-[var(--color-bz-text-faint)] uppercase tracking-wider">
                  No spam · No account needed · Unsubscribe anytime
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
