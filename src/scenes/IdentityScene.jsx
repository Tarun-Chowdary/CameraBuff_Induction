import React from 'react';
import { ARCHETYPES } from '../data/event';
import { ChevronRight } from 'lucide-react';

const CARD_ACCENTS = ['var(--pop-cyan)', 'var(--mustard-bright)', 'var(--pop-pink)', 'var(--pop-red)', 'var(--pop-cyan)'];

export default function IdentityScene({ onNext, onSound }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen w-full px-5 py-14"
      style={{ background: 'linear-gradient(180deg, #4A0F18 0%, #2A0710 100%)' }}>
      <div className="filmstrip filmstrip-bleed top-0" />
      <div className="filmstrip filmstrip-bleed bottom-0" />

      <div className="max-w-md w-full text-center anim-fadeIn">
        <p className="font-marker text-xl mb-2" style={{ color: 'var(--mustard-bright)' }}>scene 03</p>
        <h2 className="font-poster text-4xl sm:text-5xl leading-tight" style={{ color: 'var(--cream)' }}>
          HOW DO YOU WANT<br /> TO ENTER<br /> THE STORY?
        </h2>
        <p className="font-mono-elite text-xs mt-3 opacity-60 tracking-widest">PICK A VIBE. (JUST FOR FUN.)</p>
      </div>

      <ul className="mt-8 grid grid-cols-1 gap-3 w-full max-w-md">
        {ARCHETYPES.map((a, i) => (
          <li key={a.key}>
            <button
              onClick={() => { onSound?.('pop'); onNext?.(a); }}
              className="w-full flex items-center justify-between px-5 py-4 border-2 hover:translate-x-1 active:translate-x-2 transition-transform relative anim-fadeIn"
              style={{
                borderColor: CARD_ACCENTS[i % CARD_ACCENTS.length],
                background: i % 2 === 0 ? 'rgba(244,231,199,0.06)' : 'transparent',
                boxShadow: `4px 4px 0 ${CARD_ACCENTS[i % CARD_ACCENTS.length]}`,
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div className="text-left">
                <div className="font-poster text-xl" style={{ color: 'var(--cream)' }}>{a.label}</div>
                <div className="font-marker text-sm" style={{ color: CARD_ACCENTS[i % CARD_ACCENTS.length] }}>{a.line}</div>
              </div>
              <ChevronRight color="var(--cream)" size={22} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
