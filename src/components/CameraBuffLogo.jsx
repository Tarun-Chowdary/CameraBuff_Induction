import React from 'react';
import logoMark from '../assets/camerabuff-logo.png';

// The real CameraBuff crosshair mark. Supplied as a black-on-transparent
// PNG, so it's applied as a CSS mask and filled with `color` — this keeps
// the same size/color props every call site already uses, tintable for
// light or dark backgrounds without needing separate image assets.
export default function CameraBuffLogo({ size = 64, color = '#F4E7C7' }) {
  return (
    <span
      role="img"
      aria-label="CameraBuff mark"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: color,
        WebkitMaskImage: `url(${logoMark})`,
        maskImage: `url(${logoMark})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  );
}
