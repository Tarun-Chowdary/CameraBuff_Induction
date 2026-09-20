import React, { useEffect, useRef, useState } from 'react';
import CameraBuffLogo from '../components/CameraBuffLogo';
import { EVENT } from '../data/event';
import Instagram from '../components/InstagramIcon';
import Ticket from '../components/Ticket';
import useTicketDownload from '../hooks/useTicketDownload';
import { Download, Loader2 } from 'lucide-react';

const QUOTES = [
  'THE END?',
  'NAH.',
  'THIS IS JUST',
];

export default function EndingScene({ name, ticketId, onSound }) {
  const [step, setStep] = useState(0);
  const ticketRef = useRef(null);
  const { downloading, error: downloadError, download } = useTicketDownload();

  const handleDownload = async () => {
    const ok = await download(ticketRef.current, name);
    if (ok) onSound?.('shutter');
  };

  useEffect(() => {
    onSound?.('whoosh');
    const timers = [
      setTimeout(() => { setStep(1); onSound?.('click'); }, 900),
      setTimeout(() => setStep(2), 2100),
      setTimeout(() => { setStep(3); onSound?.('stamp'); }, 3300),
      setTimeout(() => setStep(4), 4600),
    ];
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center text-center px-6 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #4A0F18 0%, #170305 80%)' }}>

      <div className="filmstrip filmstrip-bleed top-0" />
      <div className="filmstrip filmstrip-bleed bottom-0" />

      {/* Off-screen ticket, kept mounted so it can be captured for download */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0, width: 900 }} aria-hidden="true">
        <Ticket name={name} ticketId={ticketId} show={10} forwardedRef={ticketRef} />
      </div>

      <div className="max-w-lg w-full">
        {step >= 0 && (
          <h1 className="font-poster anim-bigIn leading-none" style={{ color: 'var(--cream)', fontSize: 'clamp(3rem, 15vw, 9rem)' }}>
            {QUOTES[0]}
          </h1>
        )}
        {step >= 1 && (
          <p className="font-marker anim-fadeIn text-4xl sm:text-6xl mt-2" style={{ color: 'var(--mustard-bright)' }}>
            {QUOTES[1]}
          </p>
        )}
        {step >= 2 && (
          <p className="font-poster anim-bigIn text-2xl sm:text-4xl mt-8" style={{ color: 'var(--cream)' }}>
            THIS IS JUST<br /> <span style={{ color: 'var(--mustard-bright)' }}>THE OPENING SCENE.</span>
          </p>
        )}
        {step >= 3 && (
          <div className="anim-fadeIn mt-10">
            <div className="flex justify-center mb-3"><CameraBuffLogo size={52} /></div>
            <p className="font-poster text-3xl" style={{ color: 'var(--cream)' }}>CAMERABUFF</p>
            <p className="font-mono-elite text-sm mt-2 tracking-[0.3em]" style={{ color: 'var(--cream)' }}>{EVENT.shortDate} · {EVENT.time}</p>
            <p className="font-mono-elite text-xs mt-1 tracking-[0.2em] opacity-80" style={{ color: 'var(--cream)' }}>{EVENT.venueLine1}, {EVENT.venueLine2}</p>
            <p className="font-marker text-2xl mt-6" style={{ color: 'var(--mustard-bright)' }}>see you at the premiere.</p>
          </div>
        )}
        {step >= 4 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 anim-fadeIn">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-poster text-lg border-4 transition-transform active:translate-x-1 active:translate-y-1 disabled:opacity-70"
              style={{ background: 'var(--mustard-bright)', color: 'var(--ink)', borderColor: 'var(--ink)', boxShadow: '5px 5px 0 var(--cream)' }}
            >
              {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              {downloading ? 'PRINTING\u2026' : 'DOWNLOAD MY TICKET'}
            </button>
            <a
              href={EVENT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-poster text-lg border-4"
              style={{ background: 'var(--cream)', color: 'var(--ink)', borderColor: 'var(--ink)', boxShadow: '5px 5px 0 var(--mustard-bright)' }}
            >
              <Instagram size={20} /> {EVENT.instagramHandle}
            </a>
          </div>
        )}
        {step >= 4 && downloadError && (
          <p className="mt-3 font-marker text-sm anim-fadeIn" style={{ color: '#ff8a80' }}>{downloadError}</p>
        )}
      </div>
    </section>
  );
}
