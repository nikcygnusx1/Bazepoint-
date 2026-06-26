import { useState, useEffect, useRef } from 'react';

export function useTypewriterPlaceholder(
  phrases: string[],
  interval: number = 3500,
  isPaused: boolean = false
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % phrases.length);
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phrases, interval, isPaused]);

  return { currentIndex, currentPhrase: phrases[currentIndex] };
}
