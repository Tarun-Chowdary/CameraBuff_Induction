import React, { useState, useRef, useEffect } from 'react';
import CameraBuffLogo from '../components/CameraBuffLogo';
import { Film } from 'lucide-react';

export default function NameScene({ onSubmit, archetype, onSound }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 600);
    return () => clearTimeout(t);
  }, []);

  const submit = (e) => {
    e?.preventDefault?.();
    const clean = value.trim();
    if (!clean) { setError('EVERY STORY NEEDS A NAME.'); onSound?.('shutter'); return; }
    onSound?.('stamp');
    onSubmit?.(clean);
  };

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center px-5 py-10"
      style={{ background: 'radial-gradient(circle at top, #4A0F18 0%, #2A0710 60%, #170305 100%)' }}>

      <div className="absolute top-6 left-6 opacity-90 flicker"><CameraBuffLogo size={36} /></div>
      <div className="absolute top-8 right-6 font-marker text-sm" style={{ color: 'var(--mustard-bright)' }}>TAKE 01</div>

      <div className="anim-fadeIn text-center max-w-lg w-full">
        {archetype && (
          <p className="font-marker text-lg mb-3" style={{ color: 'var(--mustard-bright)' }}>
            → {archetype.line}
          </p>
        )}
        <h2 className="font-poster text-5xl sm:text-6xl md:text-7xl leading-[0.95]" style={{ color: 'var(--cream)' }}>
          EVERY MOVIE<br /> HAS A LEAD.
        </h2>
        <p className="font-marker text-2xl mt-6" style={{ color: 'var(--mustard-bright)' }}>
          what&rsquo;s your name?
        </p>
      </div>

      <form onSubmit={submit} className="mt-8 w-full max-w-md anim-fadeIn">
        <div className="relative">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(''); }}
            maxLength={24}
            placeholder="ENTER YOUR NAME"
            aria-label="Your name"
            className="w-full bg-transparent border-b-4 outline-none font-poster text-3xl sm:text-4xl text-center pb-2 tracking-wider"
            style={{
              borderColor: 'var(--cream)',
              color: 'var(--cream)',
              caretColor: 'var(--mustard-bright)',
            }}
          />
          <div className="absolute -bottom-1 left-0 right-0 text-center font-mono-elite text-[10px] tracking-[0.3em] opacity-50" style={{ color: 'var(--cream)' }}>
            {value.length}/24 CHARACTERS
          </div>
        </div>

        {error && (
          <p className="mt-6 font-marker text-lg text-center anim-fadeIn" style={{ color: '#ff6b6b' }}>{error}</p>
        )}

        <div className="mt-10 flex justify-center">
          <button
            type="submit"
            className="group relative inline-flex items-center gap-3 px-8 py-4 font-poster text-2xl border-4 hover:translate-y-[-2px] transition-transform"
            style={{
              background: 'var(--mustard-bright)',
              color: 'var(--ink)',
              borderColor: 'var(--ink)',
              boxShadow: '6px 6px 0 var(--cream)',
            }}
          >
            <Film size={22} />
            ROLL CAMERA
            <span className="font-marker">→</span>
          </button>
        </div>
      </form>

      <div className="absolute bottom-4 left-0 right-0 text-center font-mono-elite text-[10px] opacity-40 tracking-[0.4em]">
        A CAMERABUFF PRODUCTION
      </div>
    </section>
  );
}
