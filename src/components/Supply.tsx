import { motion } from 'motion/react';
import { Shield, ArrowUpRight } from 'lucide-react';

const FACTORIES = [
  {
    name: "Anatolia Apparel Co.",
    location: "Istanbul, Turkey",
    price: "$7.20",
    moq: "100",
    lead: "18d",
    score: "96%",
    hash: "0x8a...4f1"
  },
  {
    name: "Pacific Packaging Systems",
    location: "Shenzhen, China",
    price: "$1.45",
    moq: "2000",
    lead: "12d",
    score: "99%",
    hash: "0x2b...9c3"
  },
  {
    name: "Atlas Ceramics",
    location: "Hanoi, Vietnam",
    price: "$4.80",
    moq: "500",
    lead: "24d",
    score: "94%",
    hash: "0x9f...1e8"
  },
  {
    name: "Vertex Tech Mfg",
    location: "Penang, Malaysia",
    price: "$12.00",
    moq: "250",
    lead: "30d",
    score: "98%",
    hash: "0x3d...7a2"
  }
];

export function Supply() {
  return (
    <section className="py-24 md:py-32 bg-bz-charcoal" id="supply">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-bz-orange font-mono mb-6">Verified Supply</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter text-bz-white leading-tight">
              A Global Network, <br/>Scored by Reality.
            </h3>
          </div>
          <p className="max-w-sm text-sm text-bz-gray font-light">
            We don't rely on self-reported marketing. Factories build their score through successful, escrow-cleared production runs on Bazepoint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FACTORIES.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="bg-bz-onyx border border-bz-border flex flex-col"
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-bz-white font-bold text-sm mb-1">{f.name}</h4>
                    <span className="text-[10px] text-bz-gray font-mono uppercase tracking-wider">{f.location}</span>
                  </div>
                  <div className="w-2 h-2 bg-bz-green rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-bz-black border border-bz-border p-3">
                    <span className="block text-[9px] text-bz-gray uppercase mb-1 font-mono">Price/Unit</span>
                    <span className="text-bz-white font-bold font-mono text-xs">{f.price}</span>
                  </div>
                  <div className="bg-bz-black border border-bz-border p-3">
                    <span className="block text-[9px] text-bz-gray uppercase mb-1 font-mono">MOQ</span>
                    <span className="text-bz-white font-bold font-mono text-xs">{f.moq}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3 h-3 text-bz-green" />
                    <span className="text-[10px] text-bz-green font-bold uppercase tracking-wider font-mono">Verified {f.score}</span>
                  </div>
                  <span className="text-[10px] text-bz-white font-bold font-mono">{f.lead} Lead</span>
                </div>
              </div>
              
              <div className="border-t border-bz-border p-4 bg-bz-black flex items-center justify-between group cursor-pointer hover:bg-bz-orange transition-colors">
                <span className="text-[9px] text-bz-gray font-mono group-hover:text-bz-black transition-colors">Log: {f.hash}</span>
                <ArrowUpRight className="w-3 h-3 text-bz-gray group-hover:text-bz-black transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
