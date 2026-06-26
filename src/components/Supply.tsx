import { motion } from 'motion/react';
import { MapPin, Shield, CheckCircle2, Factory } from 'lucide-react';
import { staggerContainer, sectionHeader, staggerFast, fadeUpFast } from '../lib/motion-variants';

const REGIONS = [
  {
    name: "Turkey",
    description: "Premium apparel, leather goods, and textiles. Fast lead times to Europe.",
    specialty: "Apparel & Textiles",
    coords: { top: '35%', left: '52%' }
  },
  {
    name: "Vietnam",
    description: "High-quality footwear, outerwear, and electronics assembly.",
    specialty: "Footwear & Tech",
    coords: { top: '55%', left: '78%' }
  },
  {
    name: "Indonesia",
    description: "Sustainable packaging, woodwork, and ceramics.",
    specialty: "Packaging & Home",
    coords: { top: '70%', left: '75%' }
  },
  {
    name: "UAE",
    description: "Supplements, cosmetics, and halal-certified production.",
    specialty: "Health & Beauty",
    coords: { top: '48%', left: '60%' }
  }
];

const CRITERIA = [
  "Verified business licenses",
  "English-speaking reps",
  "Export compliance",
  "Sample production verified",
  "Accepts MOQs under 500"
];

export function Supply() {
  return (
    <motion.section 
      id="supply"
      className="py-24 bg-[var(--color-bz-surface)] border-y border-[var(--color-bz-border)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left: Copy */}
          <div className="col-span-1 lg:col-span-5">
            <motion.div variants={sectionHeader}>
              <h2 className="section-label mb-4">The Supply Network</h2>
              <p className="text-3xl md:text-5xl font-serif font-normal text-[var(--color-bz-text)] mb-6 leading-tight">
                Quality production outside of China.
              </p>
              <p className="text-lg text-[var(--color-bz-text-muted)] font-body font-light leading-relaxed mb-8">
                We've spent years auditing factories across emerging manufacturing hubs. We only list partners who communicate clearly, accept reasonable MOQs, and deliver on time.
              </p>
            </motion.div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[var(--color-bz-border)] pb-4">
                <Shield className="w-5 h-5 text-[var(--color-bz-teal)] flex-shrink-0" />
                <h3 className="font-serif text-lg text-[var(--color-bz-text)]">Vetted for founders</h3>
              </div>
              
              <motion.ul variants={staggerFast} className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
                {CRITERIA.map((criterion, i) => (
                  <motion.li key={i} variants={fadeUpFast} className="flex items-start gap-2 text-sm text-[var(--color-bz-text-muted)] font-body">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-bz-teal)] flex-shrink-0 mt-0.5" />
                    {criterion}
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>

          {/* Right: Interactive Map Concept */}
          <div className="col-span-1 lg:col-span-7 bg-[var(--color-bz-surface-2)] border border-[var(--color-bz-border)] rounded-2xl p-8 relative overflow-hidden min-h-[500px] flex items-center justify-center">
            
            {/* Abstract World Map Base */}
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full object-cover opacity-[0.05]" fill="currentColor">
              <path d="M100 100 Q 200 50, 300 150 T 500 100 T 700 200 T 900 150 L 900 400 L 100 400 Z" stroke="var(--color-bz-text)" strokeWidth="2" fill="none" />
              <circle cx="200" cy="200" r="2" />
              <circle cx="350" cy="180" r="2" />
              <circle cx="600" cy="250" r="2" />
              <circle cx="800" cy="120" r="2" />
            </svg>
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-bz-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-bz-border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.3]"></div>

            {/* Region Pins & Cards */}
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
                {/* Pin marker */}
                <div className="relative">
                  <div className="w-4 h-4 bg-[var(--color-bz-teal)] rounded-full flex items-center justify-center cursor-pointer relative z-10 shadow-sm border border-[var(--color-bz-bg)] group-hover:scale-125 transition-transform duration-300">
                    <div className="w-1.5 h-1.5 bg-[var(--color-bz-bg)] rounded-full"></div>
                  </div>
                  {/* Pulse effect */}
                  <div className="absolute inset-0 bg-[var(--color-bz-teal)] rounded-full animate-ping opacity-20"></div>
                </div>
                
                {/* Info Card (Visible on hover) */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[220px] bg-[var(--color-bz-bg)] border border-[var(--color-bz-border)] rounded-lg shadow-lg p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 pointer-events-none z-20">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-serif text-[var(--color-bz-text)] font-semibold">{region.name}</span>
                    <Factory className="w-3.5 h-3.5 text-[var(--color-bz-teal)]" />
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-bz-amber)] mb-2">
                    {region.specialty}
                  </div>
                  <p className="text-xs font-body text-[var(--color-bz-text-muted)] leading-snug">
                    {region.description}
                  </p>
                  
                  {/* Triangle Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-bz-border)]"></div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[var(--color-bz-bg)]"></div>
                </div>
              </motion.div>
            ))}

            {/* Central Badge */}
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
                <div className="text-sm font-serif text-[var(--color-bz-text)] font-medium">1,200+ Verified Partners</div>
                <div className="text-xs font-body text-[var(--color-bz-text-muted)]">Continuously audited network</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
}
