import { motion, useReducedMotion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function Enemy() {
  const shouldReduceMotion = useReducedMotion();

  const leftVariants = {
    hidden: { opacity: 0, x: -16 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.1, delayChildren: 0.2 } 
    }
  };

  const rightVariants = {
    hidden: { opacity: 0, x: 16 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.06, delayChildren: 0.3 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="bg-bz-surface border-y border-bz-border" id="trap" aria-label="The problem with unassisted sourcing">
      <div className="grid grid-cols-1 md:grid-cols-2">
        
        {/* The Problem (Left) */}
        <motion.div 
          className="bg-bz-surface-3 p-8 md:p-12 lg:p-24 border-b md:border-b-0 md:border-r border-bz-border"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : leftVariants}
        >
          <div className="max-w-xl mx-auto md:mr-0">
            <span className="section-label block mb-4">The reality of unassisted sourcing</span>
            <h2 className="text-xl md:text-2xl font-serif font-normal text-bz-text max-w-[440px] leading-snug">
              Sourcing blind is how founders lose their first $10,000.
            </h2>
            
            <div className="w-full h-[1px] bg-bz-border mt-6 mb-8" aria-hidden="true"></div>
            
            <div className="space-y-4 mb-8">
              <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="bg-bz-surface border border-bz-border rounded-lg p-5">
                <span className="font-serif text-xs text-bz-text-faint mb-1 block" aria-hidden="true">01</span>
                <h4 className="font-body text-sm font-semibold text-bz-text mb-2">95% of online 'manufacturers' are brokers.</h4>
                <p className="font-body text-sm text-bz-text-muted leading-[1.6]">
                  They say yes to everything, take your deposit, then subcontract to the lowest bidder. You have no visibility, no recourse, and no refund.
                </p>
              </motion.div>
              
              <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="bg-bz-surface border border-bz-border rounded-lg p-5">
                <span className="font-serif text-xs text-bz-text-faint mb-1 block" aria-hidden="true">02</span>
                <h4 className="font-body text-sm font-semibold text-bz-text mb-2">The golden sample trap.</h4>
                <p className="font-body text-sm text-bz-text-muted leading-[1.6]">
                  A perfect sample wins the contract. Mass production tells a different story. Quality quietly falls after your deposit clears and production begins.
                </p>
              </motion.div>
              
              <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="bg-bz-surface border border-bz-border rounded-lg p-5">
                <span className="font-serif text-xs text-bz-text-faint mb-1 block" aria-hidden="true">03</span>
                <h4 className="font-body text-sm font-semibold text-bz-text mb-2">The post-deposit blackout.</h4>
                <p className="font-body text-sm text-bz-text-muted leading-[1.6]">
                  Response times go from 2 hours to 2 days after your money hits their account. You're left guessing whether your production line is actually booked.
                </p>
              </motion.div>
            </div>
            
            <motion.div variants={shouldReduceMotion ? {} : itemVariants} className="bg-bz-surface-2 border border-bz-border rounded-md p-5 ml-4 relative">
              <div className="absolute top-3 left-4 text-3xl font-serif text-bz-text-faint opacity-40 leading-none" aria-hidden="true">"</div>
              <p className="font-body text-sm text-bz-text-muted leading-relaxed relative z-10 pt-4 mb-4 italic">
                Very few on Alibaba are actual factories. You're better off on WeChat, digging through groups — and you'll still want a local agent just to weed out the ones who say yes to everything.
              </p>
              <div className="flex flex-col">
                <span className="font-body text-xs font-semibold text-bz-text">Priya M.</span>
                <span className="font-body text-xs text-bz-text-muted">First-time DTC founder, personal care brand</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* The Solution (Right) */}
        <motion.div 
          className="bg-bz-surface p-8 md:p-12 lg:p-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={shouldReduceMotion ? {} : rightVariants}
        >
          <div className="max-w-xl mx-auto md:ml-0">
            <span className="section-label block mb-4">The Bazepoint difference</span>
            <h2 className="text-xl md:text-2xl font-serif font-normal text-bz-text max-w-[440px] leading-snug mb-6">
              Every manufacturer is verified before you ever see them.
            </h2>
            <p className="font-body text-base text-bz-text-muted max-w-[400px] mb-10 leading-relaxed">
              Bazepoint replaces blind trust with a closed, vetted network. Every factory has passed our verification process — documented sample quality, at least one completed production run, and a public trust score built from real orders.
            </p>
            
            <div className="w-full overflow-x-auto pb-4">
              <table className="w-full min-w-[500px] border border-bz-border rounded-lg border-collapse text-left bg-bz-surface overflow-hidden">
                <thead className="bg-bz-surface-2">
                  <tr>
                    <th scope="col" className="border-b border-bz-border p-3 md:px-4 md:py-3 font-body text-xs font-medium text-bz-text-faint uppercase tracking-wider w-1/2">
                      Unassisted
                    </th>
                    <th scope="col" className="border-b border-bz-border p-3 md:px-4 md:py-3 font-body text-xs font-medium text-bz-teal uppercase tracking-wider w-1/2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
                        With Bazepoint
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { u: "Unknown brokers", b: "Verified factories only" },
                    { u: "Generic Alibaba template", b: "AI-drafted personalized email" },
                    { u: "You trust their claims", b: "Scored from past production runs" },
                    { u: "Weeks of research", b: "Minutes" },
                    { u: "Your problem", b: "We flag before you commit" },
                  ].map((row, i) => (
                    <motion.tr 
                      key={i} 
                      variants={shouldReduceMotion ? {} : itemVariants}
                      className={i % 2 === 0 ? "bg-bz-surface" : "bg-bz-surface-2"}
                    >
                      <td className="border-b border-bz-border-soft p-3 md:px-4 md:py-3 font-body text-sm text-bz-text-muted">
                        {row.u}
                      </td>
                      <td className="border-b border-bz-border-soft p-3 md:px-4 md:py-3 font-body text-sm font-medium text-bz-text flex items-center gap-2">
                        <span className="text-bz-verified text-xs font-bold flex-shrink-0" aria-hidden="true">✓</span>
                        {row.b}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
