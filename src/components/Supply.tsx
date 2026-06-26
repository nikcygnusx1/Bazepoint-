import { motion, useReducedMotion } from 'motion/react';
import { MapPin, TrendingUp, CheckCircle } from 'lucide-react';

const FACTORIES = [
  {
    name: "Anatolia Apparel Co.",
    location: "Istanbul, Turkey",
    category: "Apparel",
    price: "$7.20",
    moq: "100",
    lead: "18 days",
    score: 96,
    orders: 43,
    speciality: "Heavyweight cotton, knitwear, denim"
  },
  {
    name: "Pacific Packaging Systems",
    location: "Guangzhou, China",
    category: "Packaging",
    price: "$1.45",
    moq: "2,000",
    lead: "12 days",
    score: 99,
    orders: 127,
    speciality: "Glass bottles, kraft boxes, rigid packaging"
  },
  {
    name: "Atlas Ceramics Workshop",
    location: "Hanoi, Vietnam",
    category: "Ceramics",
    price: "$4.80",
    moq: "500",
    lead: "24 days",
    score: 94,
    orders: 31,
    speciality: "Ceramic mugs, home décor, tableware"
  },
  {
    name: "Vertex Tech Manufacturing",
    location: "Penang, Malaysia",
    category: "Electronics",
    price: "$12.00",
    moq: "250",
    lead: "30 days",
    score: 98,
    orders: 56,
    speciality: "PCB assembly, consumer electronics, IoT hardware"
  },
  {
    name: "Gulf Cosmetics Factory",
    location: "Dubai, UAE",
    category: "Cosmetics",
    price: "$3.20",
    moq: "500",
    lead: "21 days",
    score: 97,
    orders: 38,
    speciality: "Halal-certified serums, lotions, fragrances"
  },
  {
    name: "Nusantara Naturals",
    location: "Surabaya, Indonesia",
    category: "Supplements",
    price: "$2.60",
    moq: "1,000",
    lead: "16 days",
    score: 95,
    orders: 29,
    speciality: "Capsules, powders, halal + organic certified"
  }
];

export function Supply() {
  const shouldReduceMotion = useReducedMotion();

  const gridVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="bg-bz-bg pt-24 md:pt-32" id="supply" aria-label="Verified Manufacturer Network">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pb-24">
        
        <div className="mb-16">
          <span className="section-label block mb-4">Verified network</span>
          <h2 className="text-3xl md:text-5xl font-serif font-normal text-bz-text mb-4">
            Real manufacturers. Real scores.
          </h2>
          <p className="max-w-[560px] text-base font-body text-bz-text-muted mb-12 leading-relaxed">
            Every manufacturer in the Bazepoint network has completed at least one successful, verified production run. Their score reflects real orders, real samples, real delivery — not marketing claims.
          </p>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            <div className="flex flex-col gap-1">
              <span aria-label="200 plus" className="text-3xl md:text-4xl font-serif text-bz-teal leading-none">200+</span>
              <span className="font-body text-xs text-bz-text-muted uppercase tracking-wider">Verified Manufacturers</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-bz-border"></div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl md:text-4xl font-serif text-bz-teal leading-none">12</span>
              <span className="font-body text-xs text-bz-text-muted uppercase tracking-wider">Countries</span>
            </div>
            <div className="hidden md:block w-px h-12 bg-bz-border"></div>
            <div className="flex flex-col gap-1">
              <span aria-label="94 percent" className="text-3xl md:text-4xl font-serif text-bz-teal leading-none">94%</span>
              <span className="font-body text-xs text-bz-text-muted uppercase tracking-wider">On-time Delivery Rate</span>
            </div>
          </div>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={shouldReduceMotion ? {} : gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          {FACTORIES.map((f, i) => (
            <motion.div 
              key={i}
              variants={shouldReduceMotion ? {} : cardVariants}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              className="manufacturer-card flex flex-col hover:border-[var(--color-bz-teal)] bg-bz-surface overflow-hidden group"
            >
              <div className="p-5 md:p-6 flex-grow flex flex-col">
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-body text-base font-semibold text-bz-text mb-1 truncate" title={f.name}>{f.name}</h4>
                    <span className="font-body text-xs text-bz-text-muted flex items-center gap-1.5 truncate">
                      <MapPin className="w-3 h-3 text-bz-text-faint flex-shrink-0" aria-hidden="true" /> 
                      <span className="sr-only">Location: </span>{f.location}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="verified-chip">✓ Verified</span>
                    <span className="font-data text-xs font-bold text-bz-teal flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-bz-verified" aria-hidden="true" />
                      <span className="sr-only">Score: </span>{f.score}%
                    </span>
                  </div>
                </div>
                
                {/* Category Tag */}
                <div className="mb-3">
                  <span className="bg-bz-amber-light text-bz-amber border border-[color-mix(in_srgb,var(--color-bz-amber)_25%,transparent)] text-[11px] font-body font-medium px-2.5 py-1 rounded-full">
                    {f.category}
                  </span>
                </div>
                
                {/* Speciality */}
                <div className="mb-6 flex-grow">
                  <p className="font-body text-xs text-bz-text-muted italic line-clamp-2">
                    {f.speciality}
                  </p>
                </div>
                
                {/* Metrics Row */}
                <div className="border-t border-bz-border-soft pt-4 mb-5">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-data text-sm font-bold text-bz-text">{f.price}</span>
                      <span className="font-body text-[10px] text-bz-text-faint uppercase tracking-wider">Price/Unit</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-data text-sm font-bold text-bz-text">{f.moq}</span>
                      <span className="font-body text-[10px] text-bz-text-faint uppercase tracking-wider">MOQ</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-data text-sm font-bold text-bz-text">{f.lead}</span>
                      <span className="font-body text-[10px] text-bz-text-faint uppercase tracking-wider">Lead Time</span>
                    </div>
                  </div>
                </div>

                {/* Orders Social Proof */}
                <div className="mt-auto">
                  <span className="font-body text-xs text-bz-text-muted flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-bz-verified" aria-hidden="true" />
                    <span className="sr-only">Completed orders: </span>{f.orders} completed orders
                  </span>
                </div>
              </div>
              
              {/* Card Footer CTA */}
              <div className="border-t border-bz-border-soft p-4 bg-bz-surface flex items-center justify-between">
                <a href="#" className="font-body text-xs text-bz-text-muted hover:underline transition-all">View profile</a>
                <button className="btn-primary !px-3.5 !py-1.5 !text-xs !rounded">
                  Request sample →
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Manufacturer CTA Band */}
      <div className="bg-bz-surface-2 border-y border-bz-border py-12">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-body text-base font-medium text-bz-text mb-1">
              Are you a manufacturer? Join the Bazepoint verified network.
            </h3>
            <p className="font-body text-sm text-bz-text-muted">
              We onboard factories across Southeast Asia, MENA & Oceania.
            </p>
          </div>
          <button className="btn-ghost whitespace-nowrap w-full md:w-auto">
            Apply to join →
          </button>
        </div>
      </div>
    </section>
  );
}
