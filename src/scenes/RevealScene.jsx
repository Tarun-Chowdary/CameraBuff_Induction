import React, { useEffect, useState } from 'react';
import CameraBuffLogo from '../components/CameraBuffLogo';

export default function RevealScene({ name, onNext, reducedMotion, onSound }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const s = reducedMotion ? 400 : 1100;
    const timers = [
      setTimeout(() => { setStep(1); onSound?.('whoosh'); }, s),
      setTimeout(() => { setStep(2); onSound?.('stamp'); }, s * 2),
      setTimeout(() => setStep(3), s * 3.2),
      setTimeout(() => onNext?.(), s * 4.6),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext, reducedMotion]);

  return (
    <section
      className="relative flex items-center justify-center min-h-screen w-full text-center px-5 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #4A0F18 0%, #170305 80%)' }}
    >
      {/* sweep filmstrip */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="filmstrip absolute top-[18%] w-[220%] -left-[60%] rotate-[-4deg]" />
        <div className="filmstrip absolute bottom-[18%] w-[220%] -left-[60%] rotate-[3deg]" />
      </div>

      <div className="relative z-10 max-w-2xl">
        {step >= 0 && (
          <p className="font-neue tracking-[0.5em] text-lg sm:text-xl anim-fadeIn" style={{ color: 'var(--cream)' }}>
            STARRING
          </p>
        )}
        {step >= 1 && (
          <div className="relative inline-block mt-4">
            <div
              className="halftone-yellow absolute -inset-4 sm:-inset-6 -z-10 opacity-60"
              aria-hidden="true"
            />
            <h1
              className="font-poster anim-bigIn leading-[0.9] break-words"
              style={{
                color: 'var(--mustard-bright)',
                fontSize: 'clamp(2.4rem, 12vw, 7rem)',
                WebkitTextStroke: '2px var(--ink)',
                textShadow: '6px 6px 0 var(--burgundy-deep)',
              }}
            >
              {name || 'THE FRESHER'}
            </h1>
          </div>
        )}
        {step >= 2 && (
          <p className="font-marker text-xl sm:text-2xl mt-6 anim-fadeIn" style={{ color: 'var(--cream)' }}>
            in a CAMERABUFF production
          </p>
        )}
        {step >= 3 && (
          <div className="mt-10 anim-fadeIn">
            <div className="flex justify-center mb-4 flicker"><CameraBuffLogo size={54} /></div>
            <p className="font-poster text-3xl sm:text-4xl" style={{ color: 'var(--cream)' }}>
              YOUR STORY <span style={{ color: 'var(--mustard-bright)' }}>STARTS HERE.</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
