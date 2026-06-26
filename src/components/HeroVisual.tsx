import { useState, useEffect } from 'react';
import { BazeConsole } from './BazeConsole';
import { MANUFACTURERS } from '../lib/console-data';

export function HeroVisual() {
  const [isInteractive, setIsInteractive] = useState(false);
  const [briefText, setBriefText] = useState('Skincare glass packaging · UAE · 500 MOQ · <$2/unit');
  const [consoleState, setConsoleState] = useState<'idle' | 'scanning' | 'results' | 'drafting' | 'draft_ready'>('idle');
  const [activeManufacturerId, setActiveManufacturerId] = useState<string | null>(null);

  // Custom Event Subscriptions
  useEffect(() => {
    const handleSearching = () => {
      setIsInteractive(true);
      setConsoleState('scanning');
      setActiveManufacturerId(null);
    };

    const handleResults = () => {
      setIsInteractive(true);
      setConsoleState('results');
    };

    const handleReset = () => {
      // Return to hero scripted loop after 2.5s
      const timer = setTimeout(() => {
        setIsInteractive(false);
        setConsoleState('idle');
        setActiveManufacturerId(null);
        setBriefText('Skincare glass packaging · UAE · 500 MOQ · <$2/unit');
      }, 2500);
      return () => clearTimeout(timer);
    };

    const handleDraftOpen = (e: Event) => {
      setIsInteractive(true);
      const detail = (e as CustomEvent<{ index: number, manufacturerId?: string }>).detail;
      // Resolve index to id
      const manufacturerId = detail.manufacturerId || MANUFACTURERS[detail.index]?.id || MANUFACTURERS[0].id;
      setActiveManufacturerId(manufacturerId);
      setConsoleState('draft_ready');
    };

    const handleDraftClose = () => {
      setActiveManufacturerId(null);
      setConsoleState('results');
    };

    const handleBrief = (e: Event) => {
      setIsInteractive(true);
      const detail = (e as CustomEvent<string>).detail;
      setBriefText(detail);
    };

    window.addEventListener('demo-searching', handleSearching);
    window.addEventListener('demo-results', handleResults);
    window.addEventListener('demo-reset', handleReset);
    window.addEventListener('demo-draft-open', handleDraftOpen);
    window.addEventListener('demo-draft-close', handleDraftClose);
    window.addEventListener('demo-brief', handleBrief);

    return () => {
      window.removeEventListener('demo-searching', handleSearching);
      window.removeEventListener('demo-results', handleResults);
      window.removeEventListener('demo-reset', handleReset);
      window.removeEventListener('demo-draft-open', handleDraftOpen);
      window.removeEventListener('demo-draft-close', handleDraftClose);
      window.removeEventListener('demo-brief', handleBrief);
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[440px] flex items-center justify-center p-2 relative">
      {/* Background decoration: subtle grid or glow */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,rgba(0,200,176,0.08)_0%,transparent_75%] pointer-events-none z-0"></div>

      <div className="w-full max-w-[850px] relative z-10">
        {isInteractive ? (
          <BazeConsole
            mode="interactive"
            state={consoleState}
            brief={briefText}
            manufacturers={MANUFACTURERS}
            activeManufacturerId={activeManufacturerId}
            onSelectManufacturer={(id) => {
              setActiveManufacturerId(id);
              if (id) {
                setConsoleState('draft_ready');
              } else {
                setConsoleState('results');
              }
            }}
          />
        ) : (
          <BazeConsole mode="hero" />
        )}
      </div>
    </div>
  );
}
