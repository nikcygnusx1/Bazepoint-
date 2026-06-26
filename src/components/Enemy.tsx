import { motion } from 'motion/react';

export function Enemy() {
  return (
    <section className="bg-bz-black border-y border-bz-border" id="trap">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh]">
        
        {/* The Trap (Dark/Chaotic) */}
        <div className="p-12 md:p-24 lg:p-32 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-bz-border relative overflow-hidden">
          {/* Subtle noise/glitch effect abstraction */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-bz-gray via-bz-black to-bz-black pointer-events-none"></div>
          
          <div className="relative z-10 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.3em] text-bz-gray font-mono mb-6 block">The Current State</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter text-bz-white mb-8">
              The Agent Trap.
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-bz-white font-bold mb-2">95% Are Brokers</h4>
                <p className="text-bz-gray text-sm leading-relaxed font-light">
                  Up to 95% of "manufacturers" online are traders posing as the factory, saying yes to anything to win your deposit.
                </p>
              </div>
              <div>
                <h4 className="text-bz-white font-bold mb-2">The Bait and Switch</h4>
                <p className="text-bz-gray text-sm leading-relaxed font-light">
                  A flawless golden sample wins the contract, then quality quietly tanks once mass production begins.
                </p>
              </div>
              <div>
                <h4 className="text-bz-white font-bold mb-2">The Post-Deposit Blackout</h4>
                <p className="text-bz-gray text-sm leading-relaxed font-light">
                  The day after your deposit clears, replies drop from hours to days. You are left guessing if your line was booked.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Solution (Structured/Bright) */}
        <div className="p-12 md:p-24 lg:p-32 flex flex-col justify-center bg-bz-onyx relative">
          <div className="relative z-10 max-w-lg">
            <span className="text-[10px] uppercase tracking-[0.3em] text-bz-orange font-mono mb-6 block">The Solution</span>
            <h2 className="text-4xl md:text-5xl font-serif font-black uppercase tracking-tighter text-bz-white mb-8">
              Execute With Certainty.
            </h2>
            <p className="text-bz-white text-lg leading-relaxed mb-12">
              Bazepoint replaces blind trust with deterministic execution. We verify the factory, secure the funds, and enforce the quality standard.
            </p>
            
            <div className="border-l-2 border-bz-orange pl-6 py-2">
              <span className="text-[11px] font-serif italic text-bz-gray leading-relaxed block">
                "Very few on Alibaba are actual factories. You're better off getting on WeChat and digging through the groups, and you'll want an agent just to avoid the ones who say yes to everything with no experience or good intentions."
              </span>
              <span className="text-[9px] uppercase tracking-widest text-bz-gray font-mono mt-4 block">— Sourcing Founder, Market Research</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
