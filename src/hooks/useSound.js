// Tiny synthesized SFX using Web Audio API. No external audio files.
import { useCallback, useEffect, useRef, useState } from "react";

export default function useSound() {
  const [enabled, setEnabled] = useState(true);
  const ctxRef = useRef(null);

  const ensureCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    if (ctxRef.current && ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return ctxRef.current;
  }, []);

  // Browsers won't let audio play until a user gesture. Since there's no
  // mute/unmute button anymore, just quietly arm/resume the AudioContext
  // on the very first tap/key anywhere on the page.
  useEffect(() => {
    const arm = () => {
      ensureCtx();
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("touchstart", arm);
    };
    window.addEventListener("pointerdown", arm, { once: true });
    window.addEventListener("keydown", arm, { once: true });
    window.addEventListener("touchstart", arm, { once: true });
    return () => {
      window.removeEventListener("pointerdown", arm);
      window.removeEventListener("keydown", arm);
      window.removeEventListener("touchstart", arm);
    };
  }, [ensureCtx]);

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      if (next) ensureCtx();
      return next;
    });
  }, [ensureCtx]);

  const play = useCallback(
    (type = "click") => {
      if (!enabled) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === "click" || type === "projector") {
        // sharp tick — projector sound, boosted so it reads clearly
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.42, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === "shutter") {
        // shutter = quick noise burst + click
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++)
          d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
        const src = ctx.createBufferSource();
        const filt = ctx.createBiquadFilter();
        filt.type = "highpass";
        filt.frequency.value = 1200;
        const g = ctx.createGain();
        g.gain.value = 0.22;
        src.buffer = buf;
        src.connect(filt).connect(g).connect(ctx.destination);
        src.start(now);
        // add snap click
        const o = ctx.createOscillator();
        const og = ctx.createGain();
        o.type = "square";
        o.frequency.setValueAtTime(2500, now);
        og.gain.setValueAtTime(0.2, now);
        og.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
        o.connect(og).connect(ctx.destination);
        o.start(now);
        o.stop(now + 0.06);
      } else if (type === "stamp") {
        // low thud
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === "print") {
        // paper ratchet: quick repeated ticks, like a ticket printer feeding paper
        for (let i = 0; i < 4; i++) {
          const t = now + i * 0.09;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(900 + i * 45, t);
          gain.gain.setValueAtTime(0.14, t);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.06);
        }
      } else if (type === "pop") {
        // bright pop-art blip for selections
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.09);
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      } else if (type === "whoosh") {
        const buf = ctx.createBuffer(1, ctx.sampleRate * 0.35, ctx.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        const src = ctx.createBufferSource();
        const filt = ctx.createBiquadFilter();
        filt.type = "bandpass";
        filt.frequency.setValueAtTime(400, now);
        filt.frequency.exponentialRampToValueAtTime(2200, now + 0.3);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0, now);
        g.gain.linearRampToValueAtTime(0.25, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
        src.buffer = buf;
        src.connect(filt).connect(g).connect(ctx.destination);
        src.start(now);
      }
    },
    [enabled, ensureCtx],
  );

  useEffect(
    () => () => {
      try {
        ctxRef.current?.close?.();
      } catch (e) {
        /* noop */
      }
    },
    [],
  );

  return { enabled, toggle, play };
}
