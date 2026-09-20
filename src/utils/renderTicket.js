import ticketBg from '../assets/ticket-bg.jpg';

// Same fractional box used to overlay the name in Ticket.jsx, kept in sync here.
const NAME_BOX = { left: 0.19, top: 0.52, width: 0.60, height: 0.10 };
const IMG_W = 1931;
const IMG_H = 814;
const PAGE_BG = '#2A0710';
const NAME_COLOR = '#3a0a08';
const TICKET_TEXT_COLOR = '#F2C13B';
const CREAM = '#F4E7C7';

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Best-effort font warm-up. Never hangs the download if a font is slow/blocked.
async function ensureFonts() {
  if (!('fonts' in document)) return;
  const specs = ['700 60px "Alfa Slab One"', '400 20px "Special Elite"'];
  try {
    await Promise.race([
      Promise.all(specs.map((s) => document.fonts.load(s).catch(() => {}))),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch (e) {
    /* fall back to default fonts silently */
  }
}

function pickNameFontSize(len, ticketWidthPx) {
  // Mirrors the cqw tiers in index.css (6.6 / 5.2 / 4 / 3.1% of ticket width)
  const pct = len <= 8 ? 0.066 : len <= 14 ? 0.052 : len <= 20 ? 0.04 : 0.031;
  return ticketWidthPx * pct;
}

function drawSpacedText(ctx, text, x, y, letterSpacingPx) {
  // Canvas letterSpacing isn't reliable across engines; space manually.
  const widths = [...text].map((ch) => ctx.measureText(ch).width);
  const total = widths.reduce((a, b) => a + b, 0) + letterSpacingPx * (text.length - 1);
  let cursor = x - total / 2;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = 'left';
  [...text].forEach((ch, i) => {
    ctx.fillText(ch, cursor, y);
    cursor += widths[i] + letterSpacingPx;
  });
  ctx.textAlign = prevAlign;
}

/**
 * Renders the ticket (artwork + stamped name + ticket-number strip) to a
 * PNG data URL entirely via Canvas 2D — no DOM cloning, so it can't hit the
 * WebKit/mobile-Safari foreignObject bugs that html-to-image ran into.
 */
export async function renderTicketToDataUrl({ name, ticketId, scale = 2 }) {
  await ensureFonts();
  const bg = await loadImage(ticketBg);

  const width = IMG_W * scale;
  const ticketHeight = IMG_H * scale;
  const metaHeight = Math.round(width * 0.075);
  const height = ticketHeight + metaHeight;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // page background behind everything (visible in the meta strip area)
  ctx.fillStyle = PAGE_BG;
  ctx.fillRect(0, 0, width, height);

  // ticket artwork, stretched to fill exactly like the on-page CSS version
  ctx.drawImage(bg, 0, 0, width, ticketHeight);

  // name, stamped onto the STARRING line
  const displayName = (name || 'THE FRESHER').toUpperCase();
  const boxCenterX = (NAME_BOX.left + NAME_BOX.width / 2) * width;
  const boxCenterY = (NAME_BOX.top + NAME_BOX.height / 2) * ticketHeight;
  const maxTextWidth = NAME_BOX.width * width * 0.96;

  let size = pickNameFontSize(displayName.length, width);
  ctx.font = `700 ${size}px "Alfa Slab One", "Anton", serif`;
  while (ctx.measureText(displayName).width > maxTextWidth && size > 10) {
    size -= 1;
    ctx.font = `700 ${size}px "Alfa Slab One", "Anton", serif`;
  }
  ctx.fillStyle = NAME_COLOR;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(displayName, boxCenterX, boxCenterY);

  // perforated tear line
  const lineY = ticketHeight + metaHeight * 0.32;
  ctx.strokeStyle = CREAM;
  ctx.globalAlpha = 0.7;
  ctx.lineWidth = Math.max(1, width * 0.0011);
  ctx.setLineDash([width * 0.012, width * 0.008]);
  ctx.beginPath();
  ctx.moveTo(width * 0.03, lineY);
  ctx.lineTo(width * 0.97, lineY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1;

  // ticket number line
  const ticketLine = `TICKET NO. ${ticketId} \u00B7 ADMIT ONE`;
  const metaFontSize = Math.max(10, width * 0.011);
  ctx.font = `400 ${metaFontSize}px "Special Elite", "Courier New", monospace`;
  ctx.fillStyle = TICKET_TEXT_COLOR;
  ctx.textBaseline = 'middle';
  drawSpacedText(ctx, ticketLine, width / 2, ticketHeight + metaHeight * 0.68, metaFontSize * 0.22);

  return canvas.toDataURL('image/png');
}
