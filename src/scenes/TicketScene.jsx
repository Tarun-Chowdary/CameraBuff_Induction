import React, { useEffect, useRef, useState } from 'react';
import Ticket from '../components/Ticket';
import { EVENT } from '../data/event';
import { Download, Loader2 } from 'lucide-react';
import CameraBuffLogo from '../components/CameraBuffLogo';
import Instagram from '../components/InstagramIcon';
import useTicketDownload from '../hooks/useTicketDownload';

const AUTO_ADVANCE_MS = 4000;

export default function TicketScene({ name, ticketId, onNext, onSound }) {
  const [step, setStep] = useState(1);
  const [showActions, setShowActions] = useState(false);
  const [flashed, setFlashed] = useState(true);
  const ticketRef = useRef(null);
  const { downloading, error: downloadError, download } = useTicketDownload();

  // Projector flash on entry
  useEffect(() => {
    const f = setTimeout(() => setFlashed(false), 300);
    return () => clearTimeout(f);
  }, []);

  // Ticket "printing" animation
  useEffect(() => {
    if (step >= 10) {
      onSound?.('stamp');
      const t = setTimeout(() => setShowActions(true), 500);
      return () => clearTimeout(t);
    }
    const stepDelay = step === 1 ? 250 : 420;
    const t = setTimeout(() => {
      onSound?.('print');
      setStep((s) => Math.min(s + 1, 10));
    }, stepDelay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // This is a movie, not a form: once the ticket is fully printed, move on by itself.
  useEffect(() => {
    if (!showActions) return;
    const t = setTimeout(() => onNext?.(), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [showActions, onNext]);

  const handleDownload = async () => {
    const ok = await download(ticketRef.current, name);
    if (ok) onSound?.('shutter');
  };

  return (
    <section
      className="relative min-h-screen w-full px-4 py-10 flex flex-col items-center"
      style={{ background: 'linear-gradient(180deg, #170305 0%, #2A0710 40%, #4A0F18 100%)' }}
    >
      {flashed && (
        <div className="absolute inset-0 z-40 pointer-events-none anim-fadeIn" style={{ background: 'rgba(255,249,233,0.9)' }} />
      )}

      {/* header */}
      <div className="w-full max-w-md flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 flicker">
          <CameraBuffLogo size={28} />
          <span className="font-poster text-lg" style={{ color: 'var(--cream)' }}>CAMERABUFF</span>
        </div>
        <span className="font-marker text-sm" style={{ color: 'var(--mustard-bright)' }}>scene 06</span>
      </div>

      <div className="w-full max-w-md text-center mb-4 anim-fadeIn">
        <p className="font-mono-elite text-[10px] tracking-[0.5em] opacity-80" style={{ color: 'var(--cream)' }}>
          {step < 10 ? 'PRINTING YOUR TICKET\u2026' : 'YOUR TICKET IS READY.'}
        </p>
      </div>

      {/* Ticket */}
      <div className="w-full" style={{ boxSizing: 'border-box' }}>
        <Ticket name={name} ticketId={ticketId} show={step} forwardedRef={ticketRef} />
      </div>

      {/* Actions — no "continue" button; the reel just keeps rolling */}
      {showActions && (
        <div className="mt-8 w-full max-w-md anim-fadeIn text-center">
          <p className="font-poster text-xl" style={{ color: 'var(--cream)' }}>
            THE STORY DOESN&apos;T END HERE.
          </p>
          <p className="font-marker text-lg mt-1" style={{ color: 'var(--mustard-bright)' }}>
            meet us behind the camera.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-poster text-lg border-4 transition-transform active:translate-x-1 active:translate-y-1 disabled:opacity-70"
              style={{
                background: 'var(--mustard-bright)',
                color: 'var(--ink)',
                borderColor: 'var(--ink)',
                boxShadow: '5px 5px 0 var(--cream)',
              }}
            >
              {downloading ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
              {downloading ? 'PRINTING\u2026' : 'DOWNLOAD MY TICKET'}
            </button>
            <a
              href={EVENT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-poster text-lg border-4 transition-transform active:translate-x-1 active:translate-y-1"
              style={{
                background: 'var(--cream)',
                color: 'var(--ink)',
                borderColor: 'var(--ink)',
                boxShadow: '5px 5px 0 var(--pop-cyan)',
              }}
            >
              <Instagram size={18} /> FOLLOW CAMERABUFF
            </a>
          </div>

          {downloadError && (
            <p className="mt-3 font-marker text-sm" style={{ color: '#ff8a80' }}>{downloadError}</p>
          )}

          <p className="mt-6 font-mono-elite text-[10px] tracking-[0.35em] opacity-60" style={{ color: 'var(--cream)' }}>
            ROLLING TO THE NEXT SCENE&hellip;
          </p>
        </div>
      )}

      <div className="mt-8 text-center font-mono-elite text-[10px] tracking-[0.3em] opacity-50">
        A CAMERABUFF PRODUCTION &middot; {EVENT.institute}
      </div>
    </section>
  );
}
