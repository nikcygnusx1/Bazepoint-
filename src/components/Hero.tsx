import { motion } from 'motion/react';
import { ArrowRight, Shield } from 'lucide-react';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  const handleChipClick = (text: string) => {
    // Strip the emoji and just pass the text for the demo
    const cleanText = text.replace(/^[^\w]+\s/, '');
    window.dispatchEvent(new CustomEvent('populate-demo', { detail: cleanText }));
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.95 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="relative pt-[120px] pb-[80px] min-h-[90vh] flex items-center overflow-hidden bg-bz-bg">
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0 pointer-events-none opacity-50" style={{
        backgroundImage: 'linear-gradient(135deg, transparent 0%, rgba(201,107,42,0.03) 100%)',
      }}></div>
      
      {/* Decorative Circular Outline */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full border border-bz-border opacity-40 pointer-events-none"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left: Copy & CTA */}
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mb-8 flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-bz-teal"></div>
            <span className="section-label">AI Sourcing Agent</span>
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-hero leading-[1.05] font-serif font-normal text-bz-text mb-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
            >
              From idea to verified manufacturer.
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
            >
              In <span className="text-bz-teal">minutes</span>, not <span className="line-through opacity-50">months</span>.
            </motion.div>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="max-w-[480px] text-base md:text-lg text-bz-text-muted leading-[1.7] font-body font-light mb-10"
          >
            Tell Baze what you want to make. We find verified manufacturers across Southeast Asia, MENA and Oceania, filter by your budget and MOQ, and draft your first outreach email — ready to send.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 }}
            className="flex flex-col gap-4 mb-12"
          >
            <div className="flex">
              <button 
                onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group"
              >
                Describe your product
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-150 ease-out group-hover:translate-x-1" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3 text-bz-teal" />
              <span className="text-xs text-bz-text-faint font-body">
                Verified manufacturers across Turkey, Vietnam, Indonesia, Malaysia & UAE
              </span>
            </div>
          </motion.div>

          {/* Example Prompt Chips */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            {[
              "Premium skincare packaging · MOQ 500 · Indonesia",
              "Heavyweight cotton hoodie · Turkey · under $9/unit",
              "Custom supplement jars · 30 day lead · halal certified"
            ].map((text, i) => (
              <motion.button 
                key={i}
                variants={itemVariants}
                onClick={() => handleChipClick(text)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-bz-surface-2 border border-bz-border rounded-full py-2 px-4 text-xs font-body font-medium text-bz-text hover:border-bz-teal hover:bg-bz-teal-light transition-colors flex items-center gap-2 group relative overflow-hidden"
              >
                <span className="relative z-10">{text}</span>
                <span className="text-bz-text-faint group-hover:text-bz-teal transition-colors relative z-10">↗</span>
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Right: Interactive Visual */}
        <div className="col-span-1 lg:col-span-5 w-full h-[300px] lg:h-[560px]">
          <HeroVisual />
        </div>

      </div>
    </section>
  );
}
