import React, { useEffect, useState } from 'react';
import CameraBuffLogo from '../components/CameraBuffLogo';

const BEATS = ['LIGHTS.', 'CAMERA.', 'ACTION.'];

export default function OpeningScene({ onNext, reducedMotion, onSound }) {
  const [beat, setBeat] = useState(0);
  const [flash, setFlash] = useState(false);
  const [showTag, setShowTag] = useState(false);

  useEffect(() => {
    const step = reducedMotion ? 500 : 950;
    const t1 = setTimeout(() => { setBeat(1); onSound?.('click'); }, step);
    const t2 = setTimeout(() => { setBeat(2); onSound?.('click'); }, step * 2);
    const t3 = setTimeout(() => { setFlash(true); onSound?.('shutter'); setTimeout(() => setFlash(false), 250); }, step * 3);
    const t4 = setTimeout(() => setShowTag(true), step * 3 + 350);
    const t5 = setTimeout(() => onNext?.(), step * 3 + 2800);
    return () => [t1,t2,t3,t4,t5].forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext, reducedMotion]);

  const words = ['LIGHTS.', 'CAMERA.', 'ACTION.'];
  const colors = ['var(--pop-cyan)', 'var(--mustard-bright)', 'var(--pop-red)'];

  return (
    <section
      className="relative flex items-center justify-center min-h-screen w-full text-center px-4 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #2A0710 0%, #4A0F18 100%)' }}
    >
      {/* diagonal filmstrip pass */}
      <div className="absolute -left-1/2 top-1/4 w-[200%] rotate-[-6deg] pointer-events-none">
        <div className="filmstrip" />
      </div>
      <div className="absolute -left-1/2 bottom-1/4 w-[200%] rotate-[6deg] pointer-events-none opacity-70">
        <div className="filmstrip" />
      </div>

      {/* projector flash */}
      {flash && <div className="absolute inset-0 z-30" style={{ background: 'rgba(255,249,233,0.85)' }} />}

      <div className="relative z-20">
        {!showTag && BEATS.slice(0, beat + 1).map((w, i) => (
          <h2
            key={w}
            className={`font-poster ${i === beat ? 'anim-slam' : 'opacity-0 hidden'} text-6xl sm:text-8xl md:text-9xl leading-none text-stroke-ink`}
            style={{ color: colors[i % 3] }}
          >
            {w}
          </h2>
        ))}

        {showTag && (
          <div className="anim-bigIn">
            <p className="font-marker text-3xl sm:text-5xl md:text-6xl leading-tight" style={{ color: 'var(--cream)' }}>
              EVERY STORY
            </p>
            <p className="font-poster text-4xl sm:text-6xl md:text-7xl mt-2" style={{ color: 'var(--mustard-bright)' }}>
              NEEDS A BEGINNING.
            </p>
            <div className="mt-8 flex justify-center opacity-90">
              <CameraBuffLogo size={54} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
