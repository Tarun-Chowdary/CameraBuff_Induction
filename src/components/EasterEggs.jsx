import React, { createContext, useCallback, useContext, useState } from 'react';
import { Film, Popcorn, Aperture, Clapperboard, X } from 'lucide-react';

const EasterCtx = createContext(null);

const PIECES = [
  { key: 'reel',    Icon: Film,        label: 'FILM REEL' },
  { key: 'popcorn', Icon: Popcorn,     label: 'POPCORN'  },
  { key: 'lens',    Icon: Aperture,    label: 'LENS'     },
  { key: 'clapper', Icon: Clapperboard, label: 'CLAPPER' },
];

export function EasterProvider({ children, onSound }) {
  const [found, setFound] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const collect = useCallback((key) => {
    setFound((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      onSound?.('click');
      if (next.length >= 3 && !showModal) {
        onSound?.('stamp');
        setShowModal(true);
      }
      return next;
    });
  }, [onSound, showModal]);

  return (
    <EasterCtx.Provider value={{ found, collect, pieces: PIECES }}>
      {children}
      {/* Progress indicator */}
      {found.length > 0 && (
        <div className="fixed bottom-3 left-3 z-[70] flex items-center gap-1 px-3 py-2 border-2"
             style={{ background: 'rgba(11,8,8,0.75)', borderColor: 'var(--mustard-bright)' }}>
          <span className="font-mono-elite text-[10px] tracking-widest" style={{ color: 'var(--mustard-bright)' }}>
            DIRECTOR&apos;S CUT
          </span>
          <span className="font-poster text-sm" style={{ color: 'var(--cream)' }}>{found.length}/3</span>
        </div>
      )}
      {showModal && <DirectorsCutModal onClose={() => setShowModal(false)} />}
    </EasterCtx.Provider>
  );
}

export function useEaster() {
  return useContext(EasterCtx);
}

/** Hidden clickable dot at a given position. */
export function HiddenEgg({ egg, style }) {
  const ctx = useEaster();
  if (!ctx) return null;
  const found = ctx.found.includes(egg);
  const Icon = PIECES.find((p) => p.key === egg)?.Icon || Film;
  return (
    <button
      aria-label={`Hidden \${egg}`}
      onClick={(e) => { e.stopPropagation(); ctx.collect(egg); }}
      className={`absolute z-30 ${found ? 'opacity-95' : 'opacity-25 hover:opacity-90'} transition-opacity`}
      style={{
        width: 34, height: 34,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: found ? 'var(--mustard-bright)' : 'transparent',
        border: found ? '2px solid var(--ink)' : '2px dashed rgba(244,231,199,0.6)',
        borderRadius: '50%',
        ...style,
      }}
    >
      <Icon size={18} color={found ? '#0B0808' : 'var(--cream)'} />
    </button>
  );
}

function DirectorsCutModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <div className="relative max-w-md w-full p-6 comic-panel anim-slam" style={{ background: 'var(--cream)', color: 'var(--ink)' }}>
        <button onClick={onClose} className="absolute top-2 right-2" aria-label="Close">
          <X size={20} />
        </button>
        <div className="speech-badge pop-shake mb-3">DIRECTOR&apos;S CUT UNLOCKED</div>
        <h3 className="font-poster text-2xl leading-tight mt-3" style={{ color: 'var(--burgundy-deep)' }}>
          YOU FOUND SOMETHING<br />THE FRESHERS WEREN&apos;T<br />SUPPOSED TO FIND.
        </h3>
        <p className="font-marker text-lg mt-3" style={{ color: 'var(--burgundy)' }}>or maybe they were.</p>
        <div className="halftone mt-4 border-2 border-black p-3" style={{ background: '#fff' }}>
          <p className="font-mono-elite text-xs tracking-widest" style={{ color: 'var(--ink)' }}>BONUS SCENE — CLASSIFIED</p>
          <p className="font-poster text-lg mt-1" style={{ color: 'var(--pop-red)' }}>SHOOT. EDIT. CREATE. BELONG.</p>
          <p className="font-marker text-sm mt-1" style={{ color: 'var(--burgundy-deep)' }}>we’ll be looking for the sharp eyes at the premiere.</p>
        </div>
        <button onClick={onClose} className="mt-4 px-5 py-2 font-poster border-4"
          style={{ background: 'var(--mustard-bright)', color: 'var(--ink)', borderColor: 'var(--ink)', boxShadow: '4px 4px 0 var(--ink)' }}>
          BACK TO THE SHOW
        </button>
      </div>
    </div>
  );
}
