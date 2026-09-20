import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? 'Mute sound' : 'Enable sound'}
      className="fixed top-3 right-3 z-[70] w-11 h-11 flex items-center justify-center border-2"
      style={{
        background: enabled ? 'var(--mustard-bright)' : 'rgba(11,8,8,0.7)',
        borderColor: 'var(--cream)',
        color: enabled ? 'var(--ink)' : 'var(--cream)',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.6)',
      }}
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
