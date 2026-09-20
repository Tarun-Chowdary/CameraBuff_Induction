import React, { useEffect, useState } from 'react';
import CameraBuffLogo from '../components/CameraBuffLogo';

export default function IntroScene({ onNext, reducedMotion, onSound }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => { setStep(1); onSound?.('whoosh'); }, reducedMotion ? 200 : 900);
    const t2 = setTimeout(() => { setStep(2); onSound?.('click'); }, reducedMotion ? 500 : 2000);
    const t3 = setTimeout(() => onNext?.(), reducedMotion ? 900 : 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onNext, reducedMotion]);

  return (
    <section
      className="relative flex items-center justify-center min-h-screen w-full text-center px-6"
      style={{ background: 'radial-gradient(ellipse at center, #1a0509 0%, #050203 70%)' }}
    >
      {/* projector cone */}
      <div className="absolute inset-0 pointer-events-none flicker" style={{ overflow: 'hidden' }}>
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2"
          style={{
            width: 0, height: 0,
            maxWidth: '100vw',
            borderLeft: 'min(55vw, 500px) solid transparent',
            borderRight: 'min(55vw, 500px) solid transparent',
            borderBottom: '120vh solid rgba(244,231,199,0.05)',
            filter: 'blur(30px)'
          }}
        />
      </div>

      <div className="relative z-10">
        {step >= 0 && (
          <div className="anim-fadeIn mb-6 flex justify-center flicker">
            <CameraBuffLogo size={72} />
          </div>
        )}
        {step >= 1 && (
          <h1 className="font-poster anim-bigIn text-cream text-5xl sm:text-7xl md:text-8xl leading-none" style={{ color: 'var(--cream)' }}>
            CAMERABUFF
          </h1>
        )}
        {step >= 2 && (
          <p className="font-marker anim-fadeIn text-2xl sm:text-3xl mt-4" style={{ color: 'var(--mustard-bright)' }}>
            presents…
          </p>
        )}
      </div>
    </section>
  );
}
