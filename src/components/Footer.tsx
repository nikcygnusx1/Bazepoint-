export function Footer() {
  return (
    <footer className="bg-bz-charcoal border-t border-bz-border py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="col-span-1 md:col-span-2">
            <a href="#" className="text-xl font-bold tracking-tighter italic font-serif text-bz-white mb-4 block">
              BAZEPOINT.
            </a>
            <p className="text-sm text-bz-gray font-light max-w-xs">
              The trust and payment rail for global SME sourcing. From idea to doorstep, settled with proof.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-bz-white font-mono mb-6">Protocol</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-xs text-bz-gray hover:text-bz-white transition-colors">Verification Framework</a></li>
              <li><a href="#" className="text-xs text-bz-gray hover:text-bz-white transition-colors">Escrow Logic</a></li>
              <li><a href="#" className="text-xs text-bz-gray hover:text-bz-white transition-colors">Trust Scoring</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-bz-white font-mono mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-xs text-bz-gray hover:text-bz-white transition-colors">About</a></li>
              <li><a href="#" className="text-xs text-bz-gray hover:text-bz-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-xs text-bz-gray hover:text-bz-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-8 border-t border-bz-border gap-4">
          <div className="text-[10px] font-mono opacity-50 uppercase tracking-[0.2em] text-bz-gray">
            Protocol v1.42 // © 2026 Bazepoint
          </div>
          <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-bz-orange border border-bz-orange/30 px-3 py-1 bg-bz-orange/5">
            System Operational
          </div>
        </div>
        
      </div>
    </footer>
  );
}
