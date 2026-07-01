import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type PinnedSequenceConfig = {
  trigger: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: number | boolean;
  onUpdate: (progress: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
  pin?: boolean;
};

export type SplitOptions = {
  type?: 'chars' | 'words' | 'lines';
  className?: string;
};

export type ParticleConfig = {
  direction: 'shatter' | 'assemble';
  stagger?: number;
  duration?: number;
  ease?: string;
};

export function initScrollTrigger(): void {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.defaults({ markers: false });
}

export function createPinnedSequence(config: PinnedSequenceConfig): ScrollTrigger {
  const triggerElement = typeof config.trigger === 'string' 
    ? document.querySelector(config.trigger) 
    : config.trigger;

  if (!triggerElement) {
    throw new Error(`Pinned sequence trigger element not found: ${config.trigger}`);
  }

  // Set performance classes on trigger
  if (triggerElement instanceof HTMLElement) {
    triggerElement.classList.add('cinematic-pin');
  }

  return ScrollTrigger.create({
    trigger: config.trigger,
    start: config.start ?? "top top",
    end: config.end ?? "+=100%",
    scrub: config.scrub ?? 1.5,
    pin: config.pin ?? true,
    anticipatePin: 1,
    onUpdate: (self) => {
      config.onUpdate(self.progress);
    },
    onEnter: config.onEnter,
    onLeave: config.onLeave,
  });
}

export function splitTextToSpans(
  element: HTMLElement, 
  options?: SplitOptions
): { chars: HTMLSpanElement[]; words: HTMLSpanElement[]; revert: () => void } {
  const originalHTML = element.innerHTML;
  const originalText = element.textContent || "";
  const type = options?.type ?? 'chars';
  const className = options?.className ?? '';

  const chars: HTMLSpanElement[] = [];
  const words: HTMLSpanElement[] = [];

  element.innerHTML = "";

  if (type === 'chars') {
    // Split by words first, then by characters to preserve spaces
    const rawWords = originalText.split(/(\s+)/);
    
    rawWords.forEach((wordText) => {
      if (/^\s+$/.test(wordText)) {
        // Space node
        element.appendChild(document.createTextNode(wordText));
      } else {
        // Word container
        const wordSpan = document.createElement("span");
        wordSpan.className = "split-word inline-block whitespace-nowrap";
        
        const characters = wordText.split("");
        characters.forEach((char) => {
          const outerSpan = document.createElement("span");
          outerSpan.className = "inline-block overflow-hidden vertical-align-middle";
          
          const charSpan = document.createElement("span");
          charSpan.className = `inline-block relative ${className}`;
          charSpan.textContent = char;
          charSpan.style.display = "inline-block";
          
          outerSpan.appendChild(charSpan);
          wordSpan.appendChild(outerSpan);
          chars.push(charSpan);
        });

        element.appendChild(wordSpan);
        words.push(wordSpan);
      }
    });
  } else {
    // Simple word splitting
    const rawWords = originalText.split(/(\s+)/);
    rawWords.forEach((wordText) => {
      if (/^\s+$/.test(wordText)) {
        element.appendChild(document.createTextNode(wordText));
      } else {
        const outerSpan = document.createElement("span");
        outerSpan.className = "inline-block overflow-hidden";
        
        const wordSpan = document.createElement("span");
        wordSpan.className = `inline-block relative ${className}`;
        wordSpan.textContent = wordText;
        
        outerSpan.appendChild(wordSpan);
        element.appendChild(outerSpan);
        words.push(wordSpan);
      }
    });
  }

  const revert = () => {
    element.innerHTML = originalHTML;
  };

  return { chars, words, revert };
}

export function createCharParticleTimeline(
  chars: HTMLSpanElement[],
  config: ParticleConfig
): gsap.core.Timeline {
  const tl = gsap.timeline();
  const stagger = config.stagger ?? 0.015;
  const duration = config.duration ?? 0.4;
  const ease = config.ease ?? "power3.out";

  if (config.direction === 'shatter') {
    chars.forEach((char, i) => {
      // Seed values based on index to be deterministic for progress scrubbing
      const seedX = Math.sin(i * 45) * 80;
      const seedY = Math.cos(i * 35) * 80;
      const seedRot = Math.sin(i * 25) * 45;

      tl.to(char, {
        x: seedX,
        y: seedY,
        rotation: seedRot,
        scale: 0,
        opacity: 0,
        duration: duration,
        ease: ease,
      }, i * stagger);
    });
  } else {
    // Assemble
    chars.forEach((char, i) => {
      const seedX = Math.sin(i * 45) * 80;
      const seedY = Math.cos(i * 35) * 80;
      const seedRot = Math.sin(i * 25) * 45;

      tl.fromTo(char, {
        x: seedX,
        y: seedY,
        rotation: seedRot,
        scale: 0,
        opacity: 0,
      }, {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        duration: duration,
        ease: ease,
      }, i * stagger);
    });
  }

  return tl;
}
