import React from 'react';
import ticketBg from '../assets/ticket-bg.jpg';

/**
 * Renders the CameraBuff ticket artwork with the fresher's name stamped
 * into the "STARRING" line, plus a "print" reveal animation controlled by `show` (1-10).
 *
 * Sizing is done entirely with inline styles on a simple 100%-width chain
 * (outer box caps at 900px and centers itself; everything inside is 100%
 * of that) so there's no ambiguity between Tailwind's arbitrary-width
 * classes, container queries and aspect-ratio/clip-path interacting badly.
 */
export default function Ticket({ name, ticketId, show = 10, forwardedRef }) {
  const progress = Math.max(0, Math.min(show / 10, 1));
  const displayName = (name || 'THE FRESHER').toUpperCase();

  // Longer names get a smaller type size so they always sit on the line.
  const len = displayName.length;
  const nameSizeClass =
    len <= 8 ? 'ticket-name-xl' : len <= 14 ? 'ticket-name-lg' : len <= 20 ? 'ticket-name-md' : 'ticket-name-sm';

  return (
    <div
      ref={forwardedRef}
      style={{
        width: '100%',
        maxWidth: 900,
        margin: '0 auto',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      <div className="ticket-frame" style={{ width: '100%', boxSizing: 'border-box' }}>
        {/* Shadow lives on its own layer — mobile Safari can render an element
            invisible when `filter` and `clip-path` share the same box. */}
        <div style={{ width: '100%', filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.55))' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              boxSizing: 'border-box',
              aspectRatio: '1931 / 814',
              backgroundImage: `url(${ticketBg})`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#E8D6AD',
              clipPath: `inset(${(1 - progress) * 100}% 0 0 0)`,
              transition: 'clip-path 0.45s steps(8, end)',
            }}
          >
            {/* Name stamped onto the STARRING line */}
            <div
              className="absolute flex items-center justify-center px-2 text-center"
              style={{ left: '19%', width: '60%', top: '52%', height: '10%' }}
            >
              <span className={`font-poster ticket-name ${nameSizeClass}`}>
                {displayName}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Perforated tear line + ticket number, printed below the artwork */}
      <div className="mt-4 flex items-center gap-3 opacity-70">
        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: 'var(--cream)' }} />
        <span className="font-mono-elite text-[10px] tracking-[0.3em]" style={{ color: 'var(--cream)' }}>
          ✂
        </span>
        <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: 'var(--cream)' }} />
      </div>
      <div
        className="mt-2 text-center font-mono-elite tracking-[0.25em]"
        style={{ color: 'var(--mustard-bright)', fontSize: 'clamp(0.65rem, 1.6vw, 0.85rem)' }}
      >
        TICKET NO. {ticketId} &middot; ADMIT ONE
      </div>
    </div>
  );
}
