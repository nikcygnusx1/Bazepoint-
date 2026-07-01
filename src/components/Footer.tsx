import { Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[var(--color-bz-surface-offset-2)] border-t border-[var(--color-bz-border)] pt-16" aria-label="Site footer">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 flex flex-col items-start sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#B8E2F2] rounded-[10px] w-8 h-8 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <circle cx="10" cy="10" r="9" stroke="#4A9EBF" strokeWidth="1.5" />
                  <path d="M10 1 L10 19" stroke="#4A9EBF" strokeWidth="1.5" />
                </svg>
              </div>
              <span className="font-display font-serif font-[800] tracking-tight text-2xl text-[var(--color-bz-text)] leading-none">
                Bazepoint
              </span>
            </div>
            <p className="font-body text-sm text-[var(--color-bz-text-muted)] max-w-[260px] leading-relaxed mb-6">
              AI sourcing agent for founders building their first physical product.
            </p>
            <div className="flex gap-4">
              <a href="#" aria-label="Follow on Twitter" className="w-9 h-9 rounded-full bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] flex items-center justify-center hover:bg-[var(--color-bz-border)] transition-colors text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)]">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Follow on LinkedIn" className="w-9 h-9 rounded-full bg-[var(--color-bz-surface)] border border-[var(--color-bz-border)] flex items-center justify-center hover:bg-[var(--color-bz-border)] transition-colors text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)]">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Product Nav Col */}
          <div>
            <h4 className="font-body text-sm font-semibold text-[var(--color-bz-text)] mb-5">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#mechanism" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">How it works</a></li>
              <li><a href="#supply" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">Verified network</a></li>
              <li><a href="#demo" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">See a demo</a></li>
              <li><a href="#supply" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">For manufacturers</a></li>
            </ul>
          </div>
          
          {/* Company Nav Col */}
          <div>
            <h4 className="font-body text-sm font-semibold text-[var(--color-bz-text)] mb-5">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">About Bazepoint</a></li>
              <li><a href="#" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">Contact us</a></li>
              <li><a href="#" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">Privacy policy</a></li>
              <li><a href="#" className="font-body text-sm text-[var(--color-bz-text-muted)] hover:text-[var(--color-bz-text)] transition-colors">Terms of service</a></li>
            </ul>
          </div>
          
          {/* CTA Col */}
          <div>
            <h4 className="font-body text-sm font-semibold text-[var(--color-bz-text)] mb-3">Get started</h4>
            <p className="font-body text-sm text-[var(--color-bz-text-muted)] mb-4 max-w-[280px]">
              Describe your first product. Get matched with verified manufacturers in minutes.
            </p>
            <a href="#demo" className="btn-primary !py-2.5 !px-5 !text-xs inline-flex">
              Start sourcing
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-bz-border)] py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <div className="font-body text-xs text-[var(--color-bz-text-faint)]">
              © 2026 Bazepoint. All rights reserved.
            </div>
            <div className="font-body text-[10px] text-[var(--color-bz-text-faint)] max-w-2xl leading-relaxed">
              Disclaimer: Sourcing matches and auditing scores are computed based on active field indexes and trade records. All shipping operations, global tariffs, and import compliance requirements remain the direct legal responsibility of the respective contracting parties.
            </div>
          </div>
          <div className="font-body text-xs text-[var(--color-bz-text-faint)] italic md:text-right flex-shrink-0 self-start md:self-center">
            Built for founders. Backed by verified factories.
          </div>
        </div>
        
      </div>
    </footer>
  );
}
