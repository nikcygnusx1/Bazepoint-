import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MapPin, Shield, Factory } from 'lucide-react';
import { staggerContainer, sectionHeader, staggerFast, fadeUpFast } from '../lib/motion-variants';

const REGIONS = [
  {
    name: "Turkey",
    // Each description echoes the thesis: Baze connects you to verified factories here
    description: "Vertically integrated apparel hubs with clear English comms, reasonable MOQs, and direct sea routes to Europe. Exceptional for textiles, leather goods, and packaging.",
    specialty: "Vertically Integrated Apparel & Textiles",
    coords: { top: '35%', left: '52%' }
  },
  {
    name: "Indonesia",
    description: "High-volume sustainable packaging, bamboo goods, ceramics, and custom homeware. Zero-tariff access to Oceania and North American markets. MOQs that work for first batches.",
    specialty: "Sustainable Packaging & Custom Homeware",
    coords: { top: '70%', left: '75%' }
  },
  {
    name: "UAE",
    description: "World-class pharmaceutical, supplement, and cosmetics labs. Halal-certified facility lines. Optimal global air-freight positioning. Every partner here passed a compliance review before listing.",
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

export function Supply() {
  const supplyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: supplyScroll } = useScroll({
    target: supplyRef,
    offset: ["start end", "start 0.3"],
  });

  const headerY = useTransform(supplyScroll, [0, 1], [40, 0]);
  const headerOpacity = useTransform(supplyScroll, [0, 0.4], [0, 1]);

  return (
    <motion.section
      id="supply"
      aria-labelledby="supply-title"
      ref={supplyRef}
      className="py-24 bg-[var(--color-bz-surface)] border-y border-[var(--color-bz-border)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      {/* Live verification ticker — signals the network is real and actively maintained */}
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

          {/* Left: Copy — answers "How do I know these factories are real?" */}
          <div className="col-span-1 lg:col-span-5">
            <motion.div variants={sectionHeader} style={{ y: headerY, opacity: headerOpacity }} className="will-change-transform">
              {/* OUTCOME HEADING — not "The Supply Network" */}
              <h2 className="section-label mb-4">Verified manufacturers</h2>
              <p id="supply-title" className="text-3xl md:text-5xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-6 leading-tight">
                Every factory in the network earned its place.
              </p>
              <p className="text-lg text-[var(--color-bz-text-muted)] font-body font-light leading-relaxed mb-8">
                We audit manufacturers across Turkey, UAE, and Southeast Asia before they join the network. They pass a four-point check — business license, English communication, export compliance, and sample production quality — before a single brief reaches them.
              </p>
            </motion.div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--color-bz-border)] pb-4">
                <Shield className="w-5 h-5 text-[var(--color-bz-teal)] flex-shrink-0" />
                {/* OUTCOME SUBHEADING — not "Vetted for founders" */}
                <h3 className="font-display font-[800] tracking-[-0.5px] text-lg text-[var(--color-bz-text)]">No factory reaches you unverified.</h3>
              </div>
              <p className="text-sm font-body text-[var(--color-bz-text-faint)] mt-6">
                Business license check · English comms audit · Export compliance review · Sample production test. All four, every factory, before they appear in a Baze result.
              </p>
            </div>
          </div>

          {/* Right: Interactive Map */}
          <div className="col-span-1 lg:col-span-7 bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-2xl p-8 relative overflow-hidden min-h-[500px] flex items-center justify-center">
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full object-cover opacity-[0.05]" fill="currentColor">
              <path d="M100 100 Q 200 50, 300 150 T 500 100 T 700 200 T 900 150 L 900 400 L 100 400 Z" stroke="var(--color-bz-text)" strokeWidth="2" fill="none" />
              <circle cx="200" cy="200" r="2" />
              <circle cx="350" cy="180" r="2" />
              <circle cx="600" cy="250" r="2" />
              <circle cx="800" cy="120" r="2" />
            </svg>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-bz-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-bz-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.3]"></div>

            {REGIONS.map((region, i) => (
              <motion.div
                key={region.name}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.15), type: "spring", stiffness: 200, damping: 20 }}
                className="absolute group z-10"
                style={{ top: region.coords.top, left: region.coords.left }}
              >
                <div className="relative">
                  <div className="w-4 h-4 bg-[var(--color-bz-teal)] rounded-full flex items-center justify-center cursor-pointer relative z-10 shadow-sm border border-[var(--color-bz-bg)] group-hover:scale-125 transition-transform duration-300">
                    <div className="w-1.5 h-1.5 bg-[var(--color-bz-bg)] rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 bg-[var(--color-bz-teal)] rounded-full animate-ping opacity-20"></div>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-[var(--color-bz-bg)] border border-[var(--color-bz-border)] rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-display font-[800] tracking-tight text-[var(--color-bz-text)]">{region.name}</span>
                    <Factory className="w-3.5 h-3.5 text-[var(--color-bz-teal)]" />
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-bz-amber)] mb-2">
                    {region.specialty}
                  </div>
                  <p className="text-xs font-body text-[var(--color-bz-text-muted)] leading-snug">
                    {region.description}
                  </p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-bz-border)]"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-bz-bg)]"></div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
              className="absolute bottom-6 left-6 right-6 md:right-auto bg-[var(--color-bz-bg)]/90 backdrop-blur border border-[var(--color-bz-border)] rounded-lg p-4 shadow-sm flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-bz-teal-light)] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[var(--color-bz-teal)]" />
              </div>
              <div>
                <div className="text-sm font-display font-[800] tracking-tight text-[var(--color-bz-text)]">1,200+ Verified Partners</div>
                <div className="text-xs font-body text-[var(--color-bz-text-muted)]">Continuously audited — bad actors removed</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
