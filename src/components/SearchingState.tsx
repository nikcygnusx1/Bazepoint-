import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const MESSAGES = [
  "Searching verified manufacturer network...",
  "Applying filters: budget, MOQ, lead time, region...",
  "Ranking by trust score and past performance..."
];

interface SearchingStateProps {
  isProcessing: boolean;
}

export function SearchingState({ isProcessing }: SearchingStateProps) {
  const [processMsg, setProcessMsg] = useState(MESSAGES[0]);

  useEffect(() => {
    if (isProcessing) {
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % MESSAGES.length;
        setProcessMsg(MESSAGES[i]);
      }, 600);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  return (
    <AnimatePresence mode="wait">
      {isProcessing && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 48, opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
          className="bg-[var(--color-bz-teal-light)] flex items-center px-6 overflow-hidden rounded-b-xl"
          role="status"
          aria-label="Loading"
        >
          <span className="text-xs text-[var(--color-bz-teal)] italic font-body flex items-center">
            {processMsg}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >...</motion.span>
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
