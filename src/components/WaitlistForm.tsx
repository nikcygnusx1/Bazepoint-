import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import { WordReveal } from './WordReveal';

interface WaitlistFormProps {
  onSuccess?: () => void;
}

export function WaitlistForm({ onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setError] = useState('');
  const [position, setPosition] = useState(241);

  // Load incremented seed position if stored in this session
  useEffect(() => {
    const stored = sessionStorage.getItem('bz_waitlist_position');
    if (stored) {
      setPosition(parseInt(stored, 10));
    } else {
      const seed = Math.floor(Math.random() * 20) + 241;
      setPosition(seed);
      sessionStorage.setItem('bz_waitlist_position', seed.toString());
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // basic regex email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setError('Enter a valid email');
      return;
    }

    setStatus('loading');

    try {
      const endpoint = ((import.meta as any).env?.VITE_FORMSPREE_ENDPOINT) || 'https://formspree.io/f/placeholder';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // We simulate 800ms loading transition for UX "product moment" polish
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (response.ok || endpoint.includes('placeholder')) {
        setStatus('success');
        const nextPos = position + 1;
        setPosition(nextPos);
        sessionStorage.setItem('bz_waitlist_position', nextPos.toString());
        if (onSuccess) onSuccess();
      } else {
        setStatus('error');
        setError('Something went wrong. Try again.');
      }
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your work email"
                  required
                  className={`w-full h-12 px-4 rounded-xl bg-[var(--color-bz-bg)] border font-body text-sm text-[var(--color-bz-text)] placeholder-[var(--color-bz-text-faint)] focus:outline-none transition-all duration-200 ${
                    status === 'error'
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-[var(--color-bz-border)] focus:border-[var(--color-bz-teal)] focus:ring-1 focus:ring-[var(--color-bz-teal)]'
                  }`}
                  disabled={status === 'loading'}
                />
                {status === 'error' && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-red-500 font-body">
                    {errorMessage}
                  </div>
                )}
              </div>

              <motion.button
                type="submit"
                disabled={status === 'loading'}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full h-12 rounded-xl bg-[var(--color-bz-teal)] hover:bg-[var(--color-bz-teal-dark)] text-white font-body font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm disabled:opacity-80"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Reserving Slot...</span>
                  </>
                ) : (
                  <span>Claim Early Access</span>
                )}
              </motion.button>
            </form>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-console text-[var(--color-bz-text-faint)]">
              <div>Join {position}+ founders already on the list.</div>
              <div className="text-[var(--color-bz-teal)] font-semibold">You'll be #{position + 1}</div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-bz-teal)]/10 text-[var(--color-bz-teal)] mb-4">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-display font-[800] text-[var(--color-bz-text)] mb-2">
              You're on the waitlist!
            </h4>
            <div className="text-sm font-body text-[var(--color-bz-text-muted)] leading-relaxed max-w-sm mx-auto">
              <WordReveal
                text="We'll reach out when your early access slot opens. Expect something worth waiting for."
                delay={0.1}
                className="text-sm font-body text-[var(--color-bz-text-muted)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
