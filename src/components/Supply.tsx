import { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { revealVariant } from '../lib/motion-variants';
import GlobeScene from './globe/GlobeScene';

gsap.registerPlugin(ScrollTrigger);

const TICKER_ITEMS = [
  "✓ Pacific Packaging Systems verified — Guangzhou",
  "✓ Nusantara Naturals passed quality audit — Surabaya",
  "✓ New factory onboarded: Atlas Ceramics — Hanoi",
  "✓ Gulf Cosmetics re-verified — Dubai",
  "✓ Anatolia Apparel completed 43rd order",
  "✓ Vertex Tech MOQ updated — Penang",
  "✓ New category added: Sustainable Packaging — SE Asia",
];

const REGION_CARDS = [
  { id: 'turkey',    name: 'Turkey',    tags: ['Apparel', 'Leather', 'Textiles'],         desc: 'Vertically Integrated Apparel & Textiles' },
  { id: 'indonesia', name: 'Indonesia', tags: ['Bamboo', 'Wood', 'Ceramics'],              desc: 'Sustainable Packaging & Custom Homeware' },
  { id: 'uae',       name: 'UAE',       tags: ['Pharma', 'Supplements', 'Halal Certified'], desc: 'Premium Formulations & Halal Beauty' },
];

function GlobeLoadingSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]" aria-hidden="true">
      <div className="globe-skeleton w-60 h-60 rounded-full border border-[rgba(184,226,242,0.25)] flex items-center justify-center">
        <div className="w-48 h-48 rounded-full border border-dashed border-[rgba(184,226,242,0.15)] animate-spin" style={{ animationDuration: '12s' }}></div>
      </div>
    </div>
  );
}

interface RegionCardProps {
  card: typeof REGION_CARDS[0];
  isActive: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function RegionCard({ card, isActive, onHover, onLeave }: RegionCardProps) {
  return (
    <div
      tabIndex={0}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onHover();
        }
      }}
      className={`region-card p-5 rounded-xl text-left outline-none ${
        isActive ? 'region-card-active shadow-sm' : 'border-transparent bg-transparent'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isActive ? 'bg-[#4A9EBF] scale-125 animate-pulse' : 'bg-[#9C9C96]'
          }`}
        />
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--color-bz-text)]">
          {card.name}
        </h3>
        {isActive && (
          <span className="text-[#4A9EBF] text-xs font-semibold ml-auto animate-bounce-horizontal">
            →
          </span>
        )}
      </div>
      <p className="text-xs text-[var(--color-bz-text-muted)] font-body font-medium mb-3">
        {card.desc}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {card.tags.map((tag, i) => (
          <span
            key={i}
            className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--color-bz-border)] text-[var(--color-bz-text-faint)] bg-white/40"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TickerStrip({ items }: { items: string[] }) {
  return (
    <div className="relative flex items-center w-full h-full">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--color-bz-bg)] to-transparent z-10 pointer-events-none" />
      <div className="flex items-center whitespace-nowrap ticker-strip gap-8">
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[11px] font-mono text-[var(--color-bz-text-muted)] flex items-center gap-4"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-[var(--color-bz-border-strong)]" />
          </span>
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-bz-bg)] to-transparent z-10 pointer-events-none" />
    </div>
  );
}

export function Supply() {
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 90%',
      end: 'top 10%',
      onUpdate: (self) => {
        setScrollProgress(self.progress);
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="supply"
      aria-labelledby="supply-title"
      className="relative min-h-screen bg-[var(--color-bz-bg)] overflow-hidden flex flex-col justify-between"
      ref={sectionRef}
    >
      {/* Main Content Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 min-h-[90vh] items-center py-16 md:py-24">
        
        {/* LEFT COLUMN — Text Content */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
            className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-bz-text-faint)] mb-4"
          >
            The Supply Network
          </motion.p>

          <motion.h2
            id="supply-title"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
            className="text-[clamp(1.8rem,3.5vw,3rem)] font-serif font-normal leading-[1.1] text-[var(--color-bz-text)] mb-6 tracking-[-0.02em]"
          >
            Quality production outside the trade war zone.
          </motion.h2>

          <motion.p
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
            className="text-[var(--color-bz-text-muted)] text-base leading-relaxed max-w-[44ch] mb-8 font-body"
          >
            We've spent years auditing factories across emerging manufacturing hubs. We only list partners who communicate clearly, accept reasonable MOQs, and deliver on time.
          </motion.p>

          {/* Mobile Active Region Tabs Switcher */}
          <div className="flex lg:hidden border border-[var(--color-bz-border)] rounded-full p-1 bg-white mb-6">
            {REGION_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => setActiveRegion(activeRegion === card.id ? null : card.id)}
                className={`flex-1 text-center py-2 px-1 rounded-full text-[10px] font-mono transition-all uppercase tracking-wider ${
                  activeRegion === card.id
                    ? 'bg-[#1A1A18] text-white font-bold'
                    : 'text-[var(--color-bz-text-muted)] hover:text-[#1A1A18]'
                }`}
              >
                {card.name}
              </button>
            ))}
          </div>

          {/* Desktop Region Cards List */}
          <div className="hidden lg:flex flex-col gap-2 mb-8">
            {REGION_CARDS.map((card) => (
              <RegionCard
                key={card.id}
                card={card}
                isActive={activeRegion === card.id}
                onHover={() => setActiveRegion(card.id)}
                onLeave={() => setActiveRegion(null)}
              />
            ))}
          </div>

          {/* Three Stat Block */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={revealVariant}
          >
            <div className="mt-10 grid grid-cols-3 divide-x divide-[var(--color-bz-border)] border border-[var(--color-bz-border)] rounded-xl overflow-hidden bg-[var(--color-bz-surface)]">
              <div className="py-6 px-4 text-center">
                <p className="text-2xl md:text-3xl font-bold tabular-nums leading-none text-[var(--color-bz-text)]">
                  500+
                </p>
                <p className="text-[10px] uppercase tracking-wider mt-2 text-[var(--color-bz-text-faint)] font-sans">
                  Verified Factories
                </p>
              </div>
              <div className="py-6 px-4 text-center">
                <p className="text-2xl md:text-3xl font-bold tabular-nums leading-none text-[var(--color-bz-text)]">
                  3
                </p>
                <p className="text-[10px] uppercase tracking-wider mt-2 text-[var(--color-bz-text-faint)] font-sans">
                  Active Regions
                </p>
              </div>
              <div className="py-6 px-4 text-center">
                <p className="text-2xl md:text-3xl font-bold tabular-nums leading-none text-[var(--color-bz-text)]">
                  &lt;90s
                </p>
                <p className="text-[10px] uppercase tracking-wider mt-2 text-[var(--color-bz-text-faint)] font-sans">
                  Avg. Match Time
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN — R3F Globe Canvas Container */}
        <div
          className="col-span-1 lg:col-span-7 relative order-1 lg:order-2 h-[55vw] lg:h-[600px] min-h-[320px] lg:min-h-[500px]"
          aria-hidden="true"
        >
          <Suspense fallback={<GlobeLoadingSkeleton />}>
            <GlobeScene
              activeRegion={activeRegion}
              onRegionHover={setActiveRegion}
              scrollProgress={scrollProgress}
            />
          </Suspense>
        </div>

      </div>

      {/* FOOTER LIVE TICKER */}
      <div className="border-t border-[var(--color-bz-border)] bg-[var(--color-bz-surface)] overflow-hidden py-3">
        <TickerStrip items={TICKER_ITEMS} />
      </div>
    </section>
  );
}
export default Supply;
