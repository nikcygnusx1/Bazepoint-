import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Shield, CheckCircle2, MapPin, ArrowRight, ChevronDown, ChevronUp, Copy, ExternalLink, Mail, Inbox, FileText, Check } from 'lucide-react';
import { MANUFACTURERS, Manufacturer, HERO_SCENARIO } from '../lib/console-data';
import { EASE_HERO, revealVariant, cardHoverProps } from '../lib/motion-variants';

type ConsoleMode = "hero" | "interactive" | "fragment";
type FragmentZone = "topbar" | "brief" | "list" | "email";

interface BazeConsoleProps {
  mode: ConsoleMode;
  
  // Interactive Mode Props
  state?: 'idle' | 'scanning' | 'results' | 'drafting' | 'draft_ready' | 'reset';
  brief?: string;
  manufacturers?: Manufacturer[];
  activeManufacturerId?: string | null;
  onSelectManufacturer?: (id: string | null) => void;
  
  // Hero Mode Props
  beat?: 1 | 2 | 3 | 4;
  customFactoryName?: string | null;
  scenario?: typeof HERO_SCENARIO;

  // Fragment Mode Props
  zone?: FragmentZone;
  highlightRow?: number | null;
  highlightField?: string | null;
}

export function BazeConsole({
  mode,
  beat = 1,
  customFactoryName = null,
  state: interactiveState = 'idle',
  brief: interactiveBrief = '',
  manufacturers = MANUFACTURERS,
  activeManufacturerId: interactiveActiveId = null,
  onSelectManufacturer,
  scenario = HERO_SCENARIO,
  zone,
  highlightRow = null,
  highlightField = null
}: BazeConsoleProps) {
  const shouldReduceMotion = useReducedMotion();

  // Mobile View Toggle: 'list' or 'draft'
  const [activeMobileTab, setActiveMobileTab] = useState<'list' | 'draft'>('list');

  // Brief Panel Collapsible State
  const [isBriefExpanded, setIsBriefExpanded] = useState(false);

  // Clipboard copies
  const [copiedText, setCopiedText] = useState(false);

  // Typewriter typing progress of current email body (0 to 1)
  const [typingProgress, setTypingProgress] = useState(0);

  // Determine active stages/briefs/activeId depending on mode
  const currentStage = useMemo(() => {
    if (mode === 'hero') {
      if (beat === 1) return 'idle';
      if (beat === 2) return 'scanning';
      if (beat === 3) return 'results';
      return 'draft_ready';
    }
    if (mode === 'fragment') return 'results';
    return interactiveState;
  }, [mode, beat, interactiveState]);

  const activeBrief = useMemo(() => {
    if (mode === 'hero') return scenario.brief;
    if (mode === 'fragment') return "Premium apparel production · Istanbul · MOQ 200";
    return interactiveBrief || "Describe your product above and hit search...";
  }, [mode, scenario, interactiveBrief]);

  const activeId = useMemo(() => {
    if (mode === 'hero') {
      if (beat === 4) {
        if (customFactoryName) {
          const found = manufacturers.find(m => m.name === customFactoryName);
          if (found) return found.id;
        }
        return scenario.autoSelectManufacturerId;
      }
      return null;
    }
    if (mode === 'fragment') {
      if (highlightRow !== null) {
        return manufacturers[highlightRow]?.id || null;
      }
      return null;
    }
    return interactiveActiveId;
  }, [mode, beat, customFactoryName, manufacturers, scenario, highlightRow, interactiveActiveId]);

  // Handle active row click
  const handleSelectRow = (id: string) => {
    if (mode === 'hero' || mode === 'fragment') return; 
    if (onSelectManufacturer) {
      onSelectManufacturer(id);
      setActiveMobileTab('draft');
    }
  };

  // Status message in the top-right corner
  const statusInfo = useMemo(() => {
    switch (currentStage) {
      case 'idle':
        return { label: 'Ready', color: 'text-zinc-500 bg-zinc-500/10' };
      case 'scanning':
        return { label: 'Scanning', color: 'text-[#00C8B0] bg-[#00C8B0]/10' };
      case 'results':
        return { label: '3 Matched', color: 'text-[#00C8B0] bg-[#00C8B0]/20 font-bold' };
      case 'draft_ready':
        return { label: 'Draft Ready', color: 'text-[#00C8B0] bg-[#00C8B0]/20 font-bold' };
      default:
        return { label: 'Ready', color: 'text-zinc-500 bg-zinc-500/10' };
    }
  }, [currentStage]);

  const selectedManufacturer = useMemo(() => {
    return manufacturers.find(m => m.id === activeId) || null;
  }, [manufacturers, activeId]);

  // Deep Personalization: Custom Email Body based on activeBrief
  const emailDraftData = useMemo(() => {
    if (!selectedManufacturer) return null;
    const nameParts = selectedManufacturer.name.split(' ');
    const shortName = (nameParts[0] || selectedManufacturer.name) + ' Team';
    const cleanBrief = activeBrief.trim() || '[your product brief here]';

    const subject = selectedManufacturer.emailDraft.subject;
    const body = `Hi ${shortName},

I came across your factory profile on Bazepoint and I'm interested in exploring a manufacturing partnership.

Here's what I'm looking to make:
${cleanBrief}

Could you share your current pricing, minimum order quantities, and lead times for this type of product? If you're open to new founder accounts at these volumes, I'd love to schedule a quick call to discuss next steps.

Looking forward to hearing from you.

Best,
[Your Name]`;

    return { subject, body };
  }, [selectedManufacturer, activeBrief]);

  // Typewriter Effect Trigger
  useEffect(() => {
    if (!activeId) {
      setTypingProgress(0);
      return;
    }
    
    if (shouldReduceMotion) {
      setTypingProgress(1);
      return;
    }

    setTypingProgress(0);
    const startTime = performance.now();
    const duration = 1800; // 1.8 seconds typing

    let animFrameId: number;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setTypingProgress(progress);
      if (progress < 1) {
        animFrameId = requestAnimationFrame(tick);
      }
    };
    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [activeId, shouldReduceMotion]);

  // Clipboard copy handler
  const handleCopyEmail = () => {
    if (!emailDraftData) return;
    navigator.clipboard.writeText(emailDraftData.body);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Gmail prefill window open
  const handleGmailOpen = () => {
    if (!selectedManufacturer || !emailDraftData) return;
    const emailTo = 'sourcing@' + selectedManufacturer.name.toLowerCase().replace(/\s+/g, '') + '.com';
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailTo}&su=${encodeURIComponent(emailDraftData.subject)}&body=${encodeURIComponent(emailDraftData.body)}`;
    window.open(url, '_blank');
  };

  const briefTags = useMemo(() => {
    if (mode === 'hero') return scenario.briefTags;
    // Simple parsing for display tags
    const tags = [];
    const text = activeBrief.toLowerCase();
    
    if (text.includes('packaging') || text.includes('bottle') || text.includes('jar') || text.includes('box')) {
      tags.push({ label: "Category", value: "Packaging Systems" });
    } else if (text.includes('hoodie') || text.includes('apparel') || text.includes('cotton') || text.includes('t-shirt') || text.includes('mug')) {
      tags.push({ label: "Category", value: "Apparel & Merch" });
    } else if (text.includes('supplement') || text.includes('capsule') || text.includes('health') || text.includes('formulation')) {
      tags.push({ label: "Category", value: "Premium Formulation" });
    } else {
      tags.push({ label: "Category", value: "Custom Manufacturing" });
    }

    const moqMatch = activeBrief.match(/moq\s*(\d+)|(\d+)\s*units|moq\s*under\s*(\d+)/i);
    if (moqMatch) {
      const num = moqMatch[1] || moqMatch[2] || moqMatch[3];
      tags.push({ label: "MOQ Limit", value: `${num} units` });
    } else {
      tags.push({ label: "MOQ Limit", value: "Flexible MOQ" });
    }

    const budgetMatch = activeBrief.match(/\$(\d+([.,]\d+)?)/);
    if (budgetMatch) {
      tags.push({ label: "Target Budget", value: `${budgetMatch[0]} / unit` });
    } else {
      tags.push({ label: "Target Budget", value: "Competitive Pricing" });
    }

    if (text.includes('turkey') || text.includes('istanbul')) {
      tags.push({ label: "Trade Hub", value: "Turkey (MENA)" });
    } else if (text.includes('indonesia') || text.includes('asia') || text.includes('vietnam')) {
      tags.push({ label: "Trade Hub", value: "Southeast Asia" });
    } else if (text.includes('uae') || text.includes('dubai')) {
      tags.push({ label: "Trade Hub", value: "Dubai (GCC)" });
    } else {
      tags.push({ label: "Trade Hub", value: "Emerging Markets" });
    }

    return tags;
  }, [mode, activeBrief, scenario]);

  // FRAGMENT MODE VIEWS
  if (mode === 'fragment') {
    if (zone === 'topbar') {
      return (
        <div className="w-full bg-[var(--bz-console-bg)] border border-[var(--bz-console-border)] rounded-lg p-2.5 flex items-center justify-between text-left select-none pointer-events-none">
          <div className="flex items-center gap-2">
            <Inbox className="w-3.5 h-3.5 text-[#00C8B0]" />
            <span className="text-[11px] font-mono text-[var(--bz-console-text)] uppercase tracking-wider font-semibold">Baze Console</span>
          </div>
          <div className="bg-[#00C8B0]/10 px-2 py-0.5 rounded text-[10px] font-mono text-[#00C8B0] font-bold">
            3 Matches Verified
          </div>
        </div>
      );
    }

    if (zone === 'brief') {
      return (
        <div className="w-full bg-[var(--bz-console-bg)] border border-[var(--bz-console-border)] rounded-lg p-4 text-left shadow-lg">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]"></span>
            <span className="text-[10px] font-mono text-[var(--bz-console-text-muted)] uppercase tracking-widest">Active Product Brief</span>
          </div>
          <div className="bg-[var(--bz-console-amber-dim)] border-l-2 border-[var(--bz-console-amber)] p-3 rounded-r-md">
            <p className="text-xs font-mono text-[var(--bz-console-text)] leading-relaxed italic">
              "Skincare packaging · Glass Droppers · UAE / GCC Supplier · MOQ 500 · under $2"
            </p>
          </div>
          <div className="flex gap-1.5 flex-wrap mt-3">
            <span className="text-[10px] bg-[var(--bz-console-surface)] border border-[var(--bz-console-border)] rounded px-1.5 py-0.5 text-[var(--bz-console-text-muted)]">Category: Packaging</span>
            <span className="text-[10px] bg-[var(--bz-console-surface)] border border-[var(--bz-console-border)] rounded px-1.5 py-0.5 text-[var(--bz-console-text-muted)]">MOQ: 500</span>
            <span className="text-[10px] bg-[var(--bz-console-surface)] border border-[var(--bz-console-border)] rounded px-1.5 py-0.5 text-[var(--bz-console-text-muted)]">Budget: &lt; $2</span>
          </div>
        </div>
      );
    }

    if (zone === 'list') {
      return (
        <div className="w-full bg-[var(--bz-console-bg)] border border-[var(--bz-console-border)] rounded-lg overflow-hidden text-left shadow-lg">
          <div className="p-3 bg-[var(--bz-console-surface)] border-b border-[var(--bz-console-border)] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--bz-console-text-muted)] uppercase tracking-wider">Manufacturer Database Matches</span>
            <span className="text-[10px] font-mono text-[#00C8B0] font-semibold">Audit Complete</span>
          </div>
          <div className="divide-y divide-[var(--bz-console-border)]">
            {manufacturers.slice(0, 3).map((m, idx) => {
              const isActive = idx === (highlightRow !== null ? highlightRow : 0);
              return (
                <div
                  key={m.id}
                  className={`p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${isActive ? 'bg-[var(--bz-console-raised)] border-l-2 border-[#00C8B0]' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono text-[var(--bz-console-text-faint)]">{m.rank}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-[var(--bz-console-text)]">{m.name}</span>
                        {m.verified && (
                          <span className="px-1 py-0.5 text-[8px] font-bold text-[#00C8B0] bg-[#00C8B0]/10 border border-[#00C8B0]/30 rounded">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--bz-console-text-muted)] flex items-center gap-1 mt-0.5">
                        <span>{m.flag}</span>
                        <span>{m.city}, {m.country}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-[9px] text-[var(--bz-console-text-faint)] uppercase tracking-wider">Price</div>
                      <div className="text-[11px] font-semibold text-[var(--bz-console-text)]">{m.pricePerUnit}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-[var(--bz-console-text-faint)] uppercase tracking-wider">MOQ</div>
                      <div className="text-[11px] font-semibold text-[var(--bz-console-text)]">{m.moq}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (zone === 'email') {
      return (
        <div className="w-full bg-[var(--bz-console-bg)] border border-[var(--bz-console-border)] rounded-lg overflow-hidden text-left shadow-lg">
          <div className="p-3 bg-[var(--bz-console-surface)] border-b border-[var(--bz-console-border)] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--bz-console-text-muted)] uppercase tracking-wider">Draft Outreach Email</span>
            <span className="text-[10px] text-[#00C8B0] font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Ready
            </span>
          </div>
          <div className="p-3.5 space-y-2 border-b border-[var(--bz-console-border)] bg-[var(--bz-console-surface)] text-[11px]">
            <div className="flex text-[var(--bz-console-text-muted)]">
              <span className="w-12 text-[var(--bz-console-text-faint)]">To:</span>
              <span>sourcing@alghazalpackaging.com</span>
            </div>
            <div className="flex text-[var(--bz-console-text-muted)]">
              <span className="w-12 text-[var(--bz-console-text-faint)]">Subject:</span>
              <span className="font-semibold text-[var(--bz-console-text)]">Partnership Inquiry — 500-unit pilot order</span>
            </div>
          </div>
          <div className="p-4 text-[12px] text-[var(--bz-console-text-muted)] leading-relaxed space-y-3 font-mono">
            <p>Hi AlGhazal team,</p>
            <p>I came across your profile on Bazepoint. We are looking to source high-quality glass dropper bottles for a 500-unit pilot run...</p>
            <p>Could you confirm pricing and standard Q3 capacity metrics?</p>
            <p className="text-[var(--bz-console-text-faint)] italic">[Your Name]</p>
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <div 
      className="w-full bg-[var(--bz-console-bg)] border border-[var(--bz-console-border)] rounded-xl overflow-hidden flex flex-col font-sans shadow-2xl relative"
      role="toolbar" 
      aria-label="Baze sourcing console"
    >
      {/* 2B. TOP BAR */}
      <div className="h-11 bg-[var(--bz-console-surface)] border-b border-[var(--bz-console-border)] flex items-center justify-between px-3 md:px-4 z-10 select-none relative">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-[#00C8B0] flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-black text-black">B</span>
          </div>
          <span className="text-xs font-semibold text-[var(--bz-console-text)] tracking-tight">baze</span>
          <div className="w-px h-3 bg-[var(--bz-console-border)]"></div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--bz-console-text-muted)]">
            {(mode === 'hero' && (beat === 1 || beat === 2)) ? 'baze://sourcing/brief' : 'Sourcing Run'}
          </span>
        </div>

        {/* Dynamic Brief Chip (Center) */}
        {currentStage !== 'idle' && (
          <div className="hidden sm:flex items-center bg-[var(--bz-console-amber-dim)] border border-[var(--bz-console-amber)]/20 px-2.5 py-0.5 rounded-full max-w-[200px] md:max-w-[280px]">
            <span className="text-[10px] font-mono text-[var(--bz-console-amber)] truncate font-medium">
              {activeBrief}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Status Pill */}
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${statusInfo.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current ${currentStage === 'scanning' ? 'animate-ping' : ''}`}></span>
            {statusInfo.label}
          </span>
        </div>

        {/* PROGRESS BAR FOR BEAT 2 */}
        {mode === 'hero' && beat === 2 && (
          <div className="absolute left-0 right-0 bottom-0 h-[2px] bg-zinc-800">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: EASE_HERO }}
              className="h-full bg-[#00C8B0]"
            />
          </div>
        )}
      </div>

      {/* BEAT 1 & BEAT 2 CUSTOM BODY */}
      {mode === 'hero' && (beat === 1 || beat === 2) ? (
        <div className="flex-1 min-h-[380px] flex items-center justify-center p-8 bg-[var(--bz-console-bg)] relative">
          <div className="w-full max-w-md bg-[var(--bz-console-surface)] border border-[var(--bz-console-border)] rounded-lg p-5 shadow-inner flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-[var(--bz-console-text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C8B0]"></span>
              <span>Describe your product</span>
            </div>
            <div className="font-mono text-sm text-[var(--bz-console-text)] border border-[var(--bz-console-border)] bg-[var(--bz-console-bg)] p-3 rounded flex items-center justify-between">
              <span className="truncate">{activeBrief}</span>
              <span className="w-1.5 h-4 bg-[#00C8B0] ml-1 animate-pulse flex-shrink-0"></span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2C. BRIEF PANEL (Full-Width Collapsible) */}
          <div className="bg-[var(--bz-console-surface)]/40 border-b border-[var(--bz-console-border)] transition-all duration-300">
            <button
              onClick={() => setIsBriefExpanded(!isBriefExpanded)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-[var(--bz-console-surface)]/20 transition-colors"
              aria-expanded={isBriefExpanded}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-3.5 h-3.5 text-[var(--bz-console-amber)] flex-shrink-0" />
                <span className="text-xs font-mono text-[var(--bz-console-text)] font-medium truncate">
                  {activeBrief}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--bz-console-text-muted)] select-none">
                <span>{isBriefExpanded ? 'COLLAPSE' : 'EXPAND'}</span>
                {isBriefExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </div>
            </button>

            <AnimatePresence>
              {isBriefExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden border-t border-[var(--bz-console-border)] bg-[var(--bz-console-surface)]/80 p-4"
                >
                  <div className="p-3 bg-[var(--bz-console-amber-dim)] border-l-[3px] border-[var(--bz-console-amber)] rounded-r-md mb-4">
                    <p className="text-[12px] font-mono text-[var(--bz-console-text)] leading-relaxed">
                      "{activeBrief}"
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {briefTags.map((tag, i) => (
                      <div key={i} className="bg-[var(--bz-console-bg)] border border-[var(--bz-console-border)] p-2 rounded">
                        <div className="text-[9px] text-[var(--bz-console-text-faint)] uppercase tracking-wider font-mono">{tag.label}</div>
                        <div className="text-xs text-[var(--bz-console-text)] font-semibold font-mono mt-0.5">{tag.value}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE PANEL TABS */}
          <div className="flex md:hidden border-b border-[var(--bz-console-border)] select-none bg-[var(--bz-console-surface)]">
            <button
              onClick={() => setActiveMobileTab('list')}
              className={`flex-1 py-3 text-center text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-colors ${activeMobileTab === 'list' ? 'border-[#00C8B0] text-[var(--bz-console-text)] bg-[var(--bz-console-raised)]' : 'border-transparent text-[var(--bz-console-text-muted)]'}`}
            >
              Manufacturers ({manufacturers.length})
            </button>
            <button
              onClick={() => setActiveMobileTab('draft')}
              className={`flex-1 py-3 text-center text-xs font-mono font-bold tracking-wider uppercase border-b-2 transition-colors relative ${activeMobileTab === 'draft' ? 'border-[#00C8B0] text-[var(--bz-console-text)] bg-[var(--bz-console-raised)]' : 'border-transparent text-[var(--bz-console-text-muted)]'}`}
            >
              Outreach Draft
              {selectedManufacturer && (
                <span className="absolute right-3 top-3 w-1.5 h-1.5 rounded-full bg-[#00C8B0]"></span>
              )}
            </button>
          </div>

          {/* MAIN CONSOLE BODY */}
          <div className="flex flex-1 min-h-[380px] bg-[var(--bz-console-bg)] overflow-hidden">
            
            {/* MANUFACTURERS LIST */}
            <div 
              className={`w-full md:w-[55%] flex flex-col border-r border-[var(--bz-console-border)] ${activeMobileTab === 'list' ? 'flex' : 'hidden md:flex'}`}
              role="listbox"
              aria-label="Matched manufacturers"
            >
              <div className="divide-y divide-[var(--bz-console-border)] overflow-y-auto flex-1">
                {manufacturers.map((m, idx) => {
                  const isActive = m.id === activeId;
                  const isBeat4Selected = mode === 'hero' && beat === 4 && idx === 0;

                  // Define transition with delay for staggered entry in Beat 3 & 4
                  const staggerDelay = (mode === 'hero' && beat >= 3) ? idx * 0.15 : 0;

                  return (
                    <motion.div
                      key={m.id}
                      variants={revealVariant}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: staggerDelay }}
                      onClick={() => handleSelectRow(m.id)}
                      {...((isBeat4Selected || isActive) ? {} : cardHoverProps)}
                      style={{
                        borderColor: isBeat4Selected ? '#00C8B0' : undefined,
                        transform: isBeat4Selected ? 'translateY(-3px)' : undefined,
                      }}
                      className={`p-3.5 flex flex-col cursor-pointer text-left select-none relative transition-colors duration-200 outline-none group ${isActive ? 'bg-[var(--bz-console-raised)] border-l-2 border-[#00C8B0]' : isBeat4Selected ? 'bg-[var(--bz-console-raised)] border-l-2 border-[#00C8B0]' : 'hover:bg-[var(--bz-console-surface)]/20 border-l-2 border-transparent'}`}
                      role="option"
                      aria-selected={isActive || isBeat4Selected}
                      tabIndex={0}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="text-[10px] font-mono font-medium text-[var(--bz-console-text-faint)] mt-0.5">{m.rank}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-bold text-[var(--bz-console-text)] group-hover:text-white transition-colors">
                                {m.name}
                              </span>
                              {m.verified ? (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase bg-[#00C8B0]/10 border border-[#00C8B0]/30 text-[#00C8B0]">
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase bg-[var(--bz-console-amber-dim)] border border-[var(--bz-console-amber)]/30 text-[var(--bz-console-amber)]">
                                  Pending
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-[var(--bz-console-text-muted)] flex items-center gap-1.5 mt-1">
                              <span>{m.flag}</span>
                              <span className="truncate">{m.city}, {m.country}</span>
                              <span className="w-1 h-1 rounded-full bg-[var(--bz-console-border-active)]"></span>
                              <span className="truncate text-[9px] text-[var(--bz-console-text-faint)]">{m.category}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action draft indicator */}
                        <div className="flex-shrink-0 self-center hidden sm:block">
                          {isActive || isBeat4Selected ? (
                            <span className="text-[10px] font-mono text-[#00C8B0] font-bold flex items-center gap-1 bg-[#00C8B0]/10 px-2 py-1 rounded">
                              Selected ✓
                            </span>
                          ) : (
                            <button
                              aria-label={`Draft outreach email to ${m.name}`}
                              className="text-[10px] font-mono text-[var(--bz-console-text-muted)] hover:text-[#00C8B0] border border-[var(--bz-console-border)] bg-[var(--bz-console-surface)] hover:bg-[#00C8B0]/10 rounded px-2.5 py-1 transition-colors"
                            >
                              Draft →
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Specs stats row */}
                      <div className="flex items-center gap-4 mt-3 bg-[var(--bz-console-surface)]/30 border border-[var(--bz-console-border)] rounded p-2 text-left justify-between sm:justify-start">
                        <div>
                          <div className="text-[8px] uppercase tracking-widest text-[var(--bz-console-text-faint)] font-mono">MOQ</div>
                          <div className="text-[11px] font-semibold text-[var(--bz-console-text)] font-mono mt-0.5">{m.moq}</div>
                        </div>
                        <div className="w-px h-5 bg-[var(--bz-console-border)]"></div>
                        <div>
                          <div className="text-[8px] uppercase tracking-widest text-[var(--bz-console-text-faint)] font-mono">Price</div>
                          <div className="text-[11px] font-semibold text-[var(--bz-console-text)] font-mono mt-0.5">{m.pricePerUnit}</div>
                        </div>
                        <div className="w-px h-5 bg-[var(--bz-console-border)]"></div>
                        <div>
                          <div className="text-[8px] uppercase tracking-widest text-[var(--bz-console-text-faint)] font-mono">Lead</div>
                          <div className="text-[11px] font-semibold text-[var(--bz-console-text)] font-mono mt-0.5">{m.leadTime}</div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* EMAIL DRAFT */}
            <div 
              className={`w-full md:w-[45%] flex flex-col bg-[var(--bz-console-surface)]/20 ${activeMobileTab === 'draft' ? 'flex' : 'hidden md:flex'}`}
              role="region"
              aria-label="AI email draft"
            >
              {selectedManufacturer && emailDraftData ? (
                <div className="flex flex-col h-full overflow-hidden">
                  {/* Draft Header */}
                  <div className="px-4 py-2 bg-[var(--bz-console-surface)] border-b border-[var(--bz-console-border)] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[var(--bz-console-text-muted)] uppercase tracking-wider font-bold">
                      AI Draft Generated
                    </span>
                    <span className="text-[9px] font-mono text-[var(--bz-console-text-faint)]">
                      Ready to Copy / Send
                    </span>
                  </div>

                  {/* Recipient block */}
                  <div className="px-4 py-2 border-b border-[var(--bz-console-border)] text-xs font-mono bg-[var(--bz-console-surface)]/40 text-left space-y-1">
                    <div className="flex">
                      <span className="w-10 text-[var(--bz-console-text-faint)]">To:</span>
                      <span className="text-[var(--bz-console-text-muted)] truncate">
                        sourcing@{selectedManufacturer.name.toLowerCase().replace(/\s+/g, '')}.com
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-10 text-[var(--bz-console-text-faint)]">Subj:</span>
                      <span className="text-[var(--bz-console-text)] truncate font-semibold">
                        {emailDraftData.subject}
                      </span>
                    </div>
                  </div>

                  {/* Body text area */}
                  <div className="flex-1 p-4 overflow-y-auto text-left font-mono text-xs text-[var(--bz-console-text-muted)] leading-relaxed bg-[var(--bz-console-bg)]/50">
                    <div className="whitespace-pre-line font-mono select-text">
                      {emailDraftData.body.slice(0, Math.floor(typingProgress * emailDraftData.body.length))}
                      {typingProgress < 1 && (
                        <span className="w-1 h-3.5 inline-block bg-[#00C8B0] animate-pulse ml-0.5 align-middle"></span>
                      )}
                    </div>
                  </div>

                  {/* Footer buttons */}
                  <div className="p-3 bg-[var(--bz-console-surface)] border-t border-[var(--bz-console-border)] flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="flex-1 btn-ghost !text-[11px] !py-2 justify-center flex items-center gap-1.5 border border-[var(--bz-console-border)] bg-[var(--bz-console-surface)] text-[var(--bz-console-text)]"
                    >
                      {copiedText ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00C8B0]" />
                          <span>Copied ✓</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[var(--bz-console-text-muted)]" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleGmailOpen}
                      className="flex-1 btn-primary !text-[11px] !py-2 !px-3 justify-center flex items-center gap-1.5 bg-[#00C8B0] text-black hover:bg-[#00C8B0]/90 transition-colors font-bold font-mono"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-black" />
                      <span>Send in Gmail</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none opacity-40">
                  <Mail className="w-7 h-7 text-[var(--bz-console-text-faint)] mb-3" />
                  <p className="text-xs font-mono text-[var(--bz-console-text-muted)] uppercase tracking-wider">
                    Select a manufacturer to preview the AI-drafted outreach.
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[10px] text-[#00C8B0] font-mono uppercase tracking-widest font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C8B0] animate-ping"></span>
                    Waiting for interaction
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
