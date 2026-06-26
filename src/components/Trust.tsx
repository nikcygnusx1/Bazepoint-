import { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import { CheckCircle2, Shield, Factory, Globe } from 'lucide-react';
import { revealVariant } from '../lib/motion-variants';
import { useCountUp } from '../lib/use-count-up';

const PILLARS = [
  { icon: Shield, title: "Verified Identity", desc: "Every factory undergoes strict business license and identity verification before joining our network." },
  { icon: Factory, title: "Facility Audits", desc: "We review on-site facility photos, capacity claims, and ISO certifications." },
  { icon: CheckCircle2, title: "Quality Assurance", desc: "Past performance and defect rates are tracked. Only reliable manufacturers stay in the network." },
  { icon: Globe, title: "Global Reach", desc: "Access high-quality production outside of China, specializing in SE Asia and MENA." }
];

export function Trust() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const stats = [
    { label: "Verified Factories", end: 400, prefix: "", suffix: "+" },
    { label: "Countries", end: 12, prefix: "", suffix: "" },
    { label: "Success Rate", end: 99, prefix: "", suffix: "%" }
  ];

  const count1 = useCountUp(stats[0].end);
  const count2 = useCountUp(stats[1].end);
  const count3 = useCountUp(stats[2].end);

  const counters = [count1, count2, count3];

  useEffect(() => {
    if (isInView) {
      counters.forEach(c => c.start());
    }
  }, [isInView]);

  return (
    <motion.section
      id="trust"
      aria-labelledby="trust-title"
      ref={sectionRef}
      className="py-24 bg-[var(--color-bz-surface)] trust-hatch border-y border-[var(--color-bz-border)]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={revealVariant}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 id="trust-title" className="section-label justify-center mb-4">Built on Trust</h2>
          <p className="text-3xl md:text-5xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)]">
            A network you can rely on.
          </p>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-20 max-w-4xl mx-auto">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div key={i} className="bg-[var(--color-bz-bg)] p-8 rounded-xl border border-[var(--color-bz-border)] shadow-sm">
                <Icon className="w-6 h-6 text-[var(--color-bz-teal)] mb-4" />
                <h3 className="text-xl font-body font-bold text-[var(--color-bz-text)] mb-2">{pillar.title}</h3>
                <p className="text-base text-[var(--color-bz-text-muted)] leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Counters Row */}
        <div className="flex flex-wrap justify-center gap-12 lg:gap-24 max-w-4xl mx-auto border-t border-[var(--color-bz-border)] pt-12">
          {stats.map((stat, i) => (
            <div key={i} className="text-center min-w-[120px]">
              <div className="text-4xl md:text-5xl font-display font-[800] tracking-[-1px] text-[var(--color-bz-text)] mb-2 tabular-nums">
                {stat.prefix}{counters[i].count}{stat.suffix}
              </div>
              <div className="text-sm font-body text-[var(--color-bz-text-muted)] uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

      </div>
    </motion.section>
  );
}
