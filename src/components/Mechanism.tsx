import { motion } from 'motion/react';
import { Search, Lock, PackageCheck } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: "Algorithmic Discovery",
    desc: "Intent-based matching against a closed network of audited factories. No scraping. No brokers.",
    meta: "AI MATCHING LAYER"
  },
  {
    icon: Lock,
    title: "Cryptographic Escrow",
    desc: "Your capital is secured in stablecoin escrow. Funds only release when production milestones are mathematically verified.",
    meta: "SETTLEMENT LAYER"
  },
  {
    icon: PackageCheck,
    title: "Verified Delivery",
    desc: "Quality audits and order history are tamper-evident. Factories build a portable trust score they can't fake.",
    meta: "ENFORCEMENT LAYER"
  }
];

export function Mechanism() {
  return (
    <section className="py-24 md:py-32 bg-bz-black" id="mechanism">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-bz-border pb-8">
          <div className="max-w-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-bz-gray font-mono mb-6">The Protocol</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter text-bz-white leading-tight">
              Evidence, Not Marketing.
            </h3>
          </div>
          <p className="max-w-sm text-sm text-bz-gray font-light">
            We built a portable trust layer for global manufacturing. Anyone can put data on a ledger; the moat is the verified reputation behind it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-bz-border">
          {STEPS.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-bz-black p-8 lg:p-12 group hover:bg-bz-onyx transition-colors duration-300"
            >
              <div className="text-[10px] text-bz-orange font-mono uppercase tracking-widest mb-12 flex items-center justify-between">
                <span>{step.meta}</span>
                <span className="opacity-30 text-lg">0{index + 1}</span>
              </div>
              
              <step.icon className="w-8 h-8 text-bz-white mb-8 group-hover:text-bz-orange transition-colors" strokeWidth={1.5} />
              
              <h4 className="text-xl font-bold text-bz-white mb-4 uppercase tracking-tight font-serif">{step.title}</h4>
              <p className="text-sm text-bz-gray leading-relaxed font-light">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
