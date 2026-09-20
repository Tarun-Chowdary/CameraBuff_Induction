# CameraBuff — Freshers' Induction

A single-page, cinematic "movie trailer" experience built for CameraBuff (IIEST Shibpur)'s
Freshers' Induction. The visitor watches a short intro, picks a "vibe," types their name,
and gets a personalized, downloadable event ticket — all styled like a grungy pop-art
film poster, with synthesized sound effects and no external audio/image dependencies
beyond the event artwork.

The whole thing auto-plays like a trailer: aside from typing your name and picking a
vibe, there's nothing to click through — each scene times itself and rolls into the next.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build -> dist/
npm run preview   # locally preview the production build
```

Requires Node 18+ (built and tested on Node 22).

## Tech stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, no config file needed)
- **lucide-react** for icons
- **html-to-image** to render the ticket to a downloadable PNG
- Sound effects are synthesized at runtime with the **Web Audio API** — no audio files
- No backend, no analytics, no external requests. Fully static once built.

## How the experience flows

```
Intro → Opening → Identity → Name entry → Reveal → Ticket → Ending
```

| Scene | File | What happens |
|---|---|---|
| Intro | `scenes/IntroScene.jsx` | Logo flicker, auto-advances |
| Opening | `scenes/OpeningScene.jsx` | "LIGHTS. CAMERA. ACTION." beats |
| Identity | `scenes/IdentityScene.jsx` | Pick a "vibe" (director, photographer, etc.) — the only real choice in the flow |
| Name entry | `scenes/NameScene.jsx` | The one required text input — everything else is auto-play |
| Reveal | `scenes/RevealScene.jsx` | Big stylized reveal of the entered name |
| Ticket | `scenes/TicketScene.jsx` | Ticket "prints" onto the event artwork with the name stamped in, download + Instagram links, then auto-advances |
| Ending | `scenes/EndingScene.jsx` | Sign-off screen with a download-ticket option and the Instagram link |

`App.jsx` owns which scene is active and passes down the visitor's `name`, a randomly
generated `ticketId`, and a shared `play(soundType)` function for sound effects.

## Project structure

```
src/
  App.jsx                 Scene router / top-level state
  assets/
    camerabuff-logo.png   Real CameraBuff crosshair mark (masked/tinted at runtime)
    ticket-bg.jpg         Ticket artwork background
  components/
    CameraBuffLogo.jsx    Renders the logo as a CSS mask so it can be any color
    Ticket.jsx            The actual ticket visual (artwork + name stamped in)
    InstagramIcon.jsx     Small inline Instagram glyph (lucide-react dropped brand icons)
    EasterEggs.jsx        Unused scaffolding, kept for future use
    FilmGrain.jsx         Decorative grain overlay
    SoundToggle.jsx       Unused (sound is always-on now, see below)
  data/
    event.js              Event details, archetypes, ticket ID/filename helpers
  hooks/
    useSound.js            Synthesized SFX (click, shutter, stamp, print, pop, whoosh)
    useTicketDownload.js   Shared "capture ticket -> download PNG" logic
  scenes/                  One file per screen (see table above)
  index.css / App.css      Tailwind + custom styles, fonts, animations
```

## Customizing the event

Everything event-specific lives in `src/data/event.js`:

```js
export const EVENT = {
  organization: 'CAMERABUFF',
  title: 'FRESHERS INDUCTION',
  date: '23 SEPTEMBER 2026',
  time: '5:00 PM',
  venueLine1: '1ST FLOOR',
  venueLine2: 'STUDENT AMENITIES CENTER',
  institute: 'IIEST SHIBPUR',
  instagramUrl: 'https://www.instagram.com/camerabuff_iiests/',
  instagramHandle: '@camerabuff_iiests',
};
```

To change the ticket artwork, swap `src/assets/ticket-bg.jpg` for a same-aspect-ratio
image (1931:814) — the name is positioned by percentage over the "STARRING" line, so a
differently laid-out ticket will need the coordinates in `components/Ticket.jsx` adjusted
(`left`, `width`, `top`, `height` on the name overlay).

To change the logo, swap `src/assets/camerabuff-logo.png` for another black-on-transparent
mark — it's applied as a CSS mask and tinted with the `color` prop, so any solid-color
logo mark will drop in without touching the scenes that use it.

## Notes on sound

There are no audio files — every effect (projector clicks, shutter snaps, ticket
printing, stamps, whooshes, selection pops) is synthesized on the fly via the Web Audio
API in `hooks/useSound.js`. Sound is on by default; since browsers require a user gesture
before audio can play, the `AudioContext` silently arms/resumes itself on the visitor's
first tap or keypress anywhere on the page — there's no mute button in the UI.

## Browser support notes

- Uses modern CSS: `aspect-ratio`, CSS container queries (`container-type: inline-size`),
  `clip-path`, and CSS masks. All work in current Chrome, Firefox, Safari, and Edge.
- The ticket download uses `html-to-image`, which relies on the Canvas API and works in
  all evergreen browsers; very old browsers may fail to download (the UI shows an error
  message and lets the visitor retry rather than failing silently).
