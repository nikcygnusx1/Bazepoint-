import { useState, useEffect } from 'react';

export function useCountUp(target: number, duration: number = 600, inView: boolean = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const frame = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * target);
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(frame);
  }, [inView, target, duration]);

  return count;
}

import React from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals: number;
  duration?: number;
}

function AnimatedNumber({ value, decimals, duration = 600 }: AnimatedNumberProps) {
  const count = useCountUp(value, duration, true);
  return React.createElement('span', null, count.toFixed(decimals));
}

interface CountUpTextProps {
  value: string;
  duration?: number;
}

export function CountUpText({ value, duration = 600 }: CountUpTextProps) {
  const regex = /(\d+(?:\.\d+)?)/g;
  const parts = value.split(regex);

  return React.createElement(
    React.Fragment,
    null,
    parts.map((part, i) => {
      if (/^\d+(?:\.\d+)?$/.test(part)) {
        const num = parseFloat(part);
        const match = part.match(/\.(\d+)/);
        const decimals = match ? match[1].length : 0;
        return React.createElement(AnimatedNumber, {
          key: i,
          value: num,
          decimals,
          duration,
        });
      }
      return React.createElement('span', { key: i }, part);
    })
  );
}
