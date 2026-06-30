import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { MapPin, Shield, Factory } from 'lucide-react';
import { revealVariant, cardHoverProps } from '../lib/motion-variants';
import { useCountUp } from '../lib/use-count-up';

const REGIONS = [
  {
    name: "Turkey",
    description: "Highly advanced, vertically integrated apparel hubs. Exceptional leather goods, textiles, and packaging. Direct land/sea routes to Europe and standard air channels to North America with zero tariff overhead.",
    specialty: "Vertically Integrated Apparel & Textiles",
    coords: { top: '35%', left: '52%' }
  },
  {
    name: "Indonesia",
    description: "High-volume wood, bamboo, and sustainable pulp molding. High-spec ceramics and custom furniture. Zero-tariff access to North American and Oceania markets.",
    specialty: "Sustainable Packaging & Custom Homeware",
    coords: { top: '70%', left: '75%' }
  },
  {
    name: "UAE",
    description: "World-class pharmaceutical, supplement, and cosmetics labs. Halal-certified facility lines. Optimal global air-freight positioning with robust trade compliance frameworks.",
    specialty: "Premium Formulations & Halal Beauty",
    coords: { top: '48%', left: '60%' }
  }
];

const TICKER_ITEMS = [
  "✓ Pacific Packaging Systems verified — Guangzhou",
  "✓ Nusantara Naturals passed quality audit — Surabaya",
  "✓ New factory onboarded: Atlas Ceramics — Hanoi",
  "✓ Gulf Cosmetics re-verified — Dubai",
  "✓ Anatolia Apparel completed 43rd order",
  "✓ Vertex Tech MOQ updated — Penang",
  "✓ New category added: Sustainable Packaging — SE Asia",
];

function CounterCard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const factoryCount = useCountUp(847, 800, inView);
  const countryCount = useCountUp(12, 600, inView);
  const matchTime = useCountUp(90, 700, inView);

  return (
    <div ref={ref} className="grid grid-cols-3 divide-x divide-[var(--color-bz-border)] border border-[var(--color-bz-border)] rounded-xl overflow-hidden mt-10 bg-[var(--color-bz-surface)]">
      <div className="flex flex-col items-center justify-center py-5 px-3 text-center">
        <span className="text-2xl md:text-3xl font-display font-[800] text-[var(--color-bz-text)] tabular-nums leading-none mb-1">
          {Math.floor(factoryCount).toLocaleString()}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Verified Factories</span>
      </div>
      <div className="flex flex-col items-center justify-center py-5 px-3 text-center">
        <span className="text-2xl md:text-3xl font-display font-[800] text-[var(--color-bz-text)] tabular-nums leading-none mb-1">
          {Math.floor(countryCount)}+
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">Countries</span>
      </div>
      <div className="flex flex-col items-center justify-center py-5 px-3 text-center">
        <span className="text-2xl md:text-3xl font-display font-[800] text-[var(--color-bz-teal)] tabular-nums leading-none mb-1">
          &lt;{Math.floor(matchTime)}s
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-bz-text-faint)] font-body">First Match</span>
      </div>
    </div>
  );
}

export function Supply() {
  return (
    <motion.section
      id="supply"
      aria-labelledby="supply-title"
      className="py-24 bg-[var(--color-bz-surface)] border-y border-[var(--color-bz-border)] relative"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      {/* Live Ticker */}
      <div className="w-full bg-[var(--color-bz-surface)] border-b border-[var(--color-bz-border)] h-9 overflow-hidden absolute top-0 left-0 flex items-center relative z-20" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-8 md:w-16 bg-gradient-to-r from-[var(--color-bz-surface)] to-transparent z-10 pointer-events-none"></div>
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="text-xs font-body text-[var(--color-bz-text-muted)] flex items-center gap-4">
              {item}
              <span className="w-1 h-1 rounded-full bg-[var(--color-bz-border-strong)] ml-4"></span>
            </span>
          ))}
        </div>
        <div className="absolute inset-y-0 right-0 w-8 md:w-16 bg-gradient-to-l from-[var(--color-bz-surface)] to-transparent z-10 pointer-events-none"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left: Copy */}
          <motion.div variants={revealVariant} className="col-span-1 lg:col-span-5">
            <div>
              <h2 className="section-label mb-4">The Supply Network</h2>
              <p id="supply-title" className="text-3xl md:text-5xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-6 leading-tight">
                Surface premium supply lines outside traditional tariff zones.
              </p>
              <p className="text-lg text-[var(--color-bz-text-muted)] font-body font-light leading-relaxed mb-8">
                We've spent years auditing factories across emerging manufacturing hubs. We only list partners who communicate clearly, accept reasonable MOQs, and deliver on time.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--color-bz-border)] pb-4">
                <Shield className="w-5 h-5 text-[var(--color-bz-teal)] flex-shrink-0" />
                <h3 className="font-display font-[800] tracking-[-0.5px] text-lg text-[var(--color-bz-text)]">Vetted for founders</h3>
              </div>
              <p className="text-sm font-body text-[var(--color-bz-text-faint)] mt-6">
                Every factory passes business license verification, English comms check, export compliance review, and sample production audit before listing.
              </p>
            </div>

            <CounterCard />
          </motion.div>

          {/* Right: Interactive Map */}
          <motion.div
            variants={revealVariant}
            className="col-span-1 lg:col-span-7 bg-[var(--color-bz-surface-2)] logistics-grid border border-[var(--color-bz-border)] rounded-2xl p-8 relative overflow-hidden min-h-[500px] flex items-center justify-center"
          >
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full object-cover opacity-[0.05]" fill="currentColor">
              <path d="M100 100 Q 200 50, 300 150 T 500 100 T 700 200 T 900 150 L 900 400 L 100 400 Z" stroke="var(--color-bz-text)" strokeWidth="2" fill="none" />
              <circle cx="200" cy="200" r="2" /><circle cx="350" cy="180" r="2" /><circle cx="600" cy="250" r="2" />
              <circle cx="750" cy="300" r="2" /><circle cx="150" cy="300" r="2" /><circle cx="450" cy="350" r="2" />
            </svg>

            {REGIONS.map((region) => (
              <motion.div
                key={region.name}
                className="absolute group"
                style={{ top: region.coords.top, left: region.coords.left, transform: 'translate(-50%, -50%)' }}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative cursor-pointer">
                  <div className="absolute inset-0 rounded-full bg-[var(--color-bz-teal)] opacity-20 animate-ping scale-150" />
                  <div className="relative w-8 h-8 rounded-full bg-[var(--color-bz-surface)] border border-[var(--color-bz-teal)] flex items-center justify-center shadow-sm z-10">
                    <MapPin className="w-3.5 h-3.5 text-[var(--color-bz-teal)]" />
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 min-w-[220px] max-w-[280px] bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] rounded-xl p-4 shadow-lg z-20 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Factory className="w-3.5 h-3.5 text-[var(--color-bz-teal)] flex-shrink-0" />
                      <span className="text-sm font-body font-bold text-[var(--color-bz-text)]">{region.name}</span>
                    </div>
                    <p className="text-xs font-body text-[var(--color-bz-text-faint)] leading-relaxed mb-2">{region.specialty}</p>
                    <p className="text-xs font-body text-[var(--color-bz-text-muted)] leading-relaxed">{region.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="text-center relative z-10">
              <p className="text-xs font-body uppercase tracking-widest text-[var(--color-bz-text-faint)] mb-2">Active Network</p>
              <p className="text-4xl font-display font-[800] text-[var(--color-bz-text)] tracking-[-1px]">MENA · SEA · OCE</p>
              <p className="text-sm font-body text-[var(--color-bz-text-muted)] mt-2">Hover pins to explore manufacturing hubs</p>
            </div>
          </motion.div>

        </div>
      </div>
    </motion.section>
  );
}
