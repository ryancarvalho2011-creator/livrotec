/**
 * Generates rich, high-resolution SVG book cover Data URLs
 * featuring customized typography, thematic artwork, authors, and publisher branding.
 */

export interface BookCoverOptions {
  title: string;
  author: string;
  theme: string;
  year?: number;
  subtitle?: string;
  accentColor?: string;
  bgGradient: [string, string, string];
  symbolType: 'bride' | 'spider' | 'dragon' | 'door' | 'wolf' | 'forest' | 'theater' | 'telescope' | 'castle' | 'book' | 'skull' | 'heart' | 'mist' | 'yellowface' | 'sword' | 'rose' | 'orchid' | 'mirror' | 'woman_dark';
}

const SYMBOL_SVGS: Record<string, string> = {
  bride: `
    <g transform="translate(150, 195) scale(0.95)">
      <!-- Moon glow -->
      <circle cx="0" cy="0" r="62" fill="url(#violetGlow)" opacity="0.6"/>
      <circle cx="0" cy="0" r="55" stroke="#c084fc" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>
      <!-- Veil Flow -->
      <path d="M-30 -35 C-50 10 -40 50 -35 70 C-10 75 10 75 35 70 C40 50 50 10 30 -35 Z" fill="rgba(233,213,255,0.25)" stroke="rgba(192,132,252,0.6)" stroke-width="1.5"/>
      <!-- Bride silhouette -->
      <ellipse cx="0" cy="-22" rx="14" ry="17" fill="#f5d0fe"/>
      <path d="M-18 -15 Q-25 15 -18 45 L18 45 Q25 15 18 -15 Z" fill="#e879f9"/>
      <!-- Lace Crown / Veil Top -->
      <path d="M-16 -32 Q0 -42 16 -32 Q0 -36 -16 -32" fill="#c084fc"/>
      <!-- Red Rose Bouquet -->
      <circle cx="0" cy="35" r="10" fill="#e11d48"/>
      <circle cx="-7" cy="38" r="7" fill="#be123c"/>
      <circle cx="7" cy="38" r="7" fill="#be123c"/>
      <circle cx="0" cy="35" r="3" fill="#fbbf24"/>
    </g>
  `,
  spider: `
    <g transform="translate(150, 195) scale(0.95)">
      <path d="M-60 -60 L60 60 M60 -60 L-60 60 M0 -80 L0 80 M-80 0 L80 0" stroke="rgba(239,68,68,0.4)" stroke-width="1.5" fill="none"/>
      <circle cx="0" cy="0" r="40" stroke="rgba(239,68,68,0.5)" stroke-width="1.5" fill="none"/>
      <circle cx="0" cy="0" r="68" stroke="rgba(239,68,68,0.3)" stroke-width="1.5" fill="none"/>
      <ellipse cx="0" cy="-6" rx="14" ry="20" fill="#ef4444"/>
      <ellipse cx="0" cy="18" rx="20" ry="26" fill="#dc2626"/>
      <circle cx="-5" cy="-10" r="3" fill="#fff"/>
      <circle cx="5" cy="-10" r="3" fill="#fff"/>
      <path d="M-10 -15 Q-35 -35 -45 -10 Q-35 5 -12 -5" stroke="#ef4444" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M10 -15 Q35 -35 45 -10 Q35 5 12 -5" stroke="#ef4444" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-12 10 Q-45 10 -55 35 Q-40 45 -15 25" stroke="#dc2626" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M12 10 Q45 10 55 35 Q40 45 15 25" stroke="#dc2626" stroke-width="4" fill="none" stroke-linecap="round"/>
    </g>
  `,
  dragon: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="65" fill="url(#fireGlow)" opacity="0.4"/>
      <path d="M-70 -20 Q-30 -80 0 -30 Q30 -80 70 -20 Q20 30 0 70 Q-20 30 -70 -20 Z" fill="url(#goldGrad)" opacity="0.95"/>
      <path d="M-50 -10 Q-10 -50 0 -20 Q10 -50 50 -10 Q10 20 0 50 Q-10 20 -50 -10 Z" fill="#0f172a"/>
      <circle cx="-8" cy="-18" r="4" fill="#f59e0b"/>
      <circle cx="8" cy="-18" r="4" fill="#f59e0b"/>
      <path d="M0 -5 L-25 35 M0 -5 L25 35 M0 -15 L0 45" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
      <path d="M-80 10 Q-40 60 0 90 Q40 60 80 10" stroke="rgba(245,158,11,0.7)" stroke-width="2.5" fill="none"/>
    </g>
  `,
  door: `
    <g transform="translate(150, 195) scale(0.9)">
      <circle cx="0" cy="0" r="70" fill="url(#blueGlow)" opacity="0.4"/>
      <rect x="-45" y="-70" width="90" height="140" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>
      <rect x="-35" y="-60" width="30" height="55" rx="2" fill="#0f172a" stroke="rgba(56,189,248,0.5)" stroke-width="1.5"/>
      <rect x="5" y="-60" width="30" height="55" rx="2" fill="#0f172a" stroke="rgba(56,189,248,0.5)" stroke-width="1.5"/>
      <rect x="-35" y="5" width="30" height="55" rx="2" fill="#0f172a" stroke="rgba(56,189,248,0.5)" stroke-width="1.5"/>
      <rect x="5" y="5" width="30" height="55" rx="2" fill="#0f172a" stroke="rgba(56,189,248,0.5)" stroke-width="1.5"/>
      <circle cx="25" cy="5" r="5" fill="#f59e0b"/>
      <path d="M25 5 L25 15" stroke="#f59e0b" stroke-width="2.5"/>
      <circle cx="25" cy="5" r="9" stroke="rgba(245,158,11,0.6)" stroke-width="1.5" fill="none"/>
      <!-- Keyhole glow beam -->
      <polygon points="25,5 60,-20 60,30" fill="rgba(245,158,11,0.2)"/>
    </g>
  `,
  woman_dark: `
    <g transform="translate(150, 195) scale(0.95)">
      <!-- Darkness aura -->
      <circle cx="0" cy="0" r="65" fill="#020617" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.3"/>
      <!-- Flashlight beam -->
      <polygon points="0,60 -60,-60 60,-60" fill="url(#flashBeam)" opacity="0.35"/>
      <!-- Woman silhouette -->
      <ellipse cx="0" cy="-15" rx="16" ry="20" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <path d="M-22 35 C-25 0 -15 -10 0 -10 C15 -10 25 0 22 35 Z" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
      <!-- Red smiling face symbol -->
      <g transform="translate(0, -12) scale(0.7)">
        <circle cx="0" cy="0" r="18" fill="none" stroke="#ef4444" stroke-width="2.5"/>
        <circle cx="-6" cy="-4" r="2.5" fill="#ef4444"/>
        <circle cx="6" cy="-4" r="2.5" fill="#ef4444"/>
        <path d="M-8 4 Q0 12 8 4" stroke="#ef4444" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      </g>
    </g>
  `,
  wolf: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="65" fill="#4c1d95" opacity="0.5"/>
      <path d="M0 -60 L15 -20 L50 -20 L20 5 L35 45 L0 20 L-35 45 L-20 5 L-50 -20 L-15 -20 Z" fill="#c084fc" opacity="0.35"/>
      <path d="M-30 -30 L-10 10 L0 -10 L10 10 L30 -30 L20 20 L0 45 L-20 20 Z" fill="#e9d5ff"/>
      <circle cx="-10" cy="5" r="3.5" fill="#6b21a8"/>
      <circle cx="10" cy="5" r="3.5" fill="#6b21a8"/>
      <ellipse cx="0" cy="22" rx="4.5" ry="3" fill="#581c87"/>
    </g>
  `,
  forest: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="-10" r="60" fill="rgba(16,185,129,0.2)"/>
      <path d="M-40 45 L-40 15 L-60 15 L-30 -25 L-45 -25 L-20 -65 L0 -25 L-15 -25 L15 15 L-5 15 L-5 45 Z" fill="#059669" opacity="0.7"/>
      <path d="M0 55 L0 20 L-25 20 L5 -30 L-10 -30 L15 -80 L40 -30 L25 -30 L50 20 L25 20 L25 55 Z" fill="#10b981"/>
      <path d="M40 45 L40 15 L20 15 L50 -25 L35 -25 L60 -65 L80 -25 L65 -25 L95 15 L75 15 L75 45 Z" fill="#047857" opacity="0.8"/>
      <!-- Cabin -->
      <rect x="-12" y="30" width="24" height="20" fill="#78350f"/>
      <polygon points="0,18 -16,30 16,30" fill="#451a03"/>
      <rect x="-3" y="38" width="6" height="12" fill="#fbbf24"/>
    </g>
  `,
  telescope: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="65" stroke="rgba(244,63,94,0.4)" stroke-width="1.5" stroke-dasharray="4 4" fill="none"/>
      <circle cx="-35" cy="-35" r="2.5" fill="#fff"/>
      <circle cx="45" cy="-20" r="3" fill="#f43f5e"/>
      <circle cx="30" cy="40" r="2" fill="#fff"/>
      <circle cx="-40" cy="30" r="2.5" fill="#fbcfe8"/>
      <path d="M-45 35 L35 -45 L50 -30 L-30 50 Z" fill="url(#pinkGrad)"/>
      <ellipse cx="42" cy="-38" rx="12" ry="6" transform="rotate(45 42 -38)" fill="#ffe4e6"/>
      <path d="M-10 15 L-35 65 M-10 15 L15 65 M-10 15 L-10 65" stroke="#f43f5e" stroke-width="3" stroke-linecap="round"/>
    </g>
  `,
  castle: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="65" fill="rgba(245,158,11,0.15)"/>
      <path d="M-50 45 L-50 -15 L-60 -15 L-55 -45 L-40 -45 L-40 45 Z" fill="#f59e0b" opacity="0.85"/>
      <path d="M50 45 L50 -15 L60 -15 L55 -45 L40 -45 L40 45 Z" fill="#f59e0b" opacity="0.85"/>
      <rect x="-35" y="-20" width="70" height="65" fill="#d97706"/>
      <path d="M-20 -20 L-20 -50 L0 -70 L20 -50 L20 -20 Z" fill="#b45309"/>
      <path d="M-10 45 A 10 10 0 0 1 10 45 Z" fill="#451a03"/>
    </g>
  `,
  yellowface: `
    <g transform="translate(150, 195) scale(1)">
      <rect x="-65" y="-45" width="130" height="90" rx="8" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
      <ellipse cx="-25" cy="0" rx="18" ry="13" fill="#18181b"/>
      <ellipse cx="25" cy="0" rx="18" ry="13" fill="#18181b"/>
      <ellipse cx="-25" cy="0" rx="8" ry="8" fill="#eab308"/>
      <ellipse cx="25" cy="0" rx="8" ry="8" fill="#eab308"/>
      <circle cx="-25" cy="0" r="4.5" fill="#18181b"/>
      <circle cx="25" cy="0" r="4.5" fill="#18181b"/>
      <path d="M-40 -22 Q-25 -32 -10 -22" stroke="#18181b" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M40 -22 Q25 -32 10 -22" stroke="#18181b" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-15 25 Q0 15 15 25" stroke="#18181b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    </g>
  `,
  mist: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="60" fill="rgba(225,29,72,0.15)"/>
      <path d="M-60 35 Q-30 15 0 35 Q30 55 60 35" stroke="rgba(255,255,255,0.8)" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-50 10 Q-10 -10 20 10 Q50 30 70 10" stroke="rgba(255,255,255,0.6)" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M-70 -15 Q-30 -35 10 -15 Q40 5 60 -15" stroke="rgba(255,255,255,0.7)" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M-40 -40 Q0 -60 40 -40" stroke="rgba(255,255,255,0.5)" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="0" cy="0" r="9" fill="#e11d48"/>
    </g>
  `,
  orchid: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="55" fill="rgba(192,132,252,0.2)"/>
      <path d="M0 -5 C-35 -45 -45 -15 0 20 C45 -15 35 -45 0 -5" fill="#c084fc" opacity="0.85"/>
      <path d="M0 -5 C-45 -15 -45 30 0 35 C45 30 45 -15 0 -5" fill="#a855f7" opacity="0.95"/>
      <circle cx="0" cy="8" r="7" fill="#fbbf24"/>
      <path d="M0 35 Q-5 60 -15 75 M0 35 Q5 60 15 75" stroke="#22c55e" stroke-width="3" stroke-linecap="round"/>
    </g>
  `,
  rose: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="55" fill="rgba(225,29,72,0.25)"/>
      <path d="M0 -30 C18 -30 30 -15 25 0 C20 18 0 30 -18 25 C-35 18 -35 -5 -25 -22 C-12 -38 0 -30 0 -30 Z" fill="#e11d48"/>
      <path d="M0 -15 C10 -15 15 -8 12 0 C10 10 0 15 -10 12 C-18 10 -18 -2 -12 -12 Z" fill="#be123c"/>
      <circle cx="0" cy="0" r="5" fill="#fbbf24"/>
      <path d="M-5 25 Q-15 50 -25 65 M5 25 Q15 50 25 65" stroke="#15803d" stroke-width="3" stroke-linecap="round"/>
    </g>
  `,
  sword: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="60" fill="url(#violetGlow)" opacity="0.5"/>
      <path d="M0 -75 L12 -60 L4 35 L0 45 L-4 35 L-12 -60 Z" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
      <rect x="-25" y="35" width="50" height="9" rx="2" fill="#f59e0b"/>
      <rect x="-5" y="44" width="10" height="26" rx="2" fill="#78350f"/>
      <circle cx="0" cy="76" r="7" fill="#f59e0b"/>
    </g>
  `,
  mirror: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="60" fill="rgba(56,189,248,0.2)"/>
      <polygon points="-30,-45 30,-45 45,45 -45,45" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
      <polygon points="-20,-35 20,-35 30,35 -30,35" fill="rgba(56,189,248,0.3)" stroke="#7dd3fc" stroke-width="1.5"/>
      <line x1="-35" y1="0" x2="35" y2="0" stroke="rgba(255,255,255,0.7)" stroke-width="2"/>
      <ellipse cx="0" cy="-5" rx="10" ry="15" fill="#0f172a"/>
    </g>
  `,
  heart: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="60" fill="url(#pinkGlow)" opacity="0.4"/>
      <path d="M0 45 C-50 15 -60 -25 -25 -40 C-10 -45 0 -25 0 -20 C0 -25 10 -45 25 -40 C60 -25 50 15 0 45 Z" fill="url(#pinkGrad)"/>
      <circle cx="-12" cy="-20" r="5" fill="#fff" opacity="0.7"/>
    </g>
  `,
  book: `
    <g transform="translate(150, 195) scale(0.95)">
      <path d="M-50 25 C-25 15 0 25 0 25 C0 25 25 15 50 25 L45 -35 C20 -45 0 -35 0 -35 C0 -35 -20 -45 -45 -35 Z" fill="#f1f5f9"/>
      <path d="M0 25 L0 -35" stroke="#94a3b8" stroke-width="2"/>
      <path d="M-40 15 C-20 5 0 15 0 15" stroke="#cbd5e1" stroke-width="1.5" fill="none"/>
      <path d="M0 15 C20 5 40 15 40 15" stroke="#cbd5e1" stroke-width="1.5" fill="none"/>
    </g>
  `,
  skull: `
    <g transform="translate(150, 195) scale(0.95)">
      <circle cx="0" cy="0" r="60" fill="rgba(225,29,72,0.2)"/>
      <circle cx="0" cy="-10" r="35" fill="#f8fafc"/>
      <rect x="-18" y="10" width="36" height="24" rx="4" fill="#f8fafc"/>
      <ellipse cx="-12" cy="-8" rx="8" ry="10" fill="#0f172a"/>
      <ellipse cx="12" cy="-8" rx="8" ry="10" fill="#0f172a"/>
      <path d="M-4 10 L0 4 L4 10 Z" fill="#0f172a"/>
      <line x1="-10" y1="26" x2="-10" y2="34" stroke="#0f172a" stroke-width="2.5"/>
      <line x1="0" y1="26" x2="0" y2="34" stroke="#0f172a" stroke-width="2.5"/>
      <line x1="10" y1="26" x2="10" y2="34" stroke="#0f172a" stroke-width="2.5"/>
    </g>
  `
};

export function generateBookCoverSvg(options: BookCoverOptions): string {
  const {
    title,
    author,
    theme,
    year = 2024,
    accentColor = '#f59e0b',
    bgGradient,
    symbolType
  } = options;

  const symbolMarkup = SYMBOL_SVGS[symbolType] || SYMBOL_SVGS.book;

  // Split title into lines for SVG text wrapping
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(w => {
    if ((currentLine + ' ' + w).trim().length > 18) {
      lines.push(currentLine.trim());
      currentLine = w;
    } else {
      currentLine = (currentLine + ' ' + w).trim();
    }
  });
  if (currentLine) lines.push(currentLine.trim());

  const titleStartY = 300;
  const lineHeight = 24;

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420" width="300" height="420">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bgGradient[0]}"/>
      <stop offset="50%" stop-color="${bgGradient[1]}"/>
      <stop offset="100%" stop-color="${bgGradient[2]}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbcfe8"/>
      <stop offset="50%" stop-color="#f43f5e"/>
      <stop offset="100%" stop-color="#be123c"/>
    </linearGradient>
    <linearGradient id="flashBeam" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="violetGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="fireGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-15%" y="-15%" width="130%" height="130%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.85"/>
    </filter>
  </defs>

  <!-- Background base -->
  <rect width="300" height="420" fill="url(#bgGrad)"/>
  
  <!-- Subtle decorative pattern -->
  <circle cx="150" cy="190" r="160" fill="url(#centerGlow)"/>
  <rect x="12" y="12" width="276" height="396" rx="6" fill="none" stroke="${accentColor}" stroke-width="1.8" stroke-opacity="0.5"/>
  <rect x="16" y="16" width="268" height="388" rx="4" fill="none" stroke="${accentColor}" stroke-width="0.8" stroke-opacity="0.3"/>

  <!-- Top Category & Year Header -->
  <g transform="translate(24, 34)">
    <rect x="0" y="0" width="80" height="20" rx="4" fill="${accentColor}"/>
    <text x="40" y="14" font-family="system-ui, -apple-system, sans-serif" font-size="9.5" font-weight="900" fill="#0f172a" text-anchor="middle" letter-spacing="1.5">
      ${theme.toUpperCase()}
    </text>
    <text x="252" y="15" font-family="monospace" font-size="12" font-weight="bold" fill="#ffffff" fill-opacity="0.9" text-anchor="end">
      ${year}
    </text>
  </g>

  <!-- Central Thematic Artwork -->
  <g filter="url(#shadow)">
    ${symbolMarkup}
  </g>

  <!-- Title Area with High Contrast & Shadow -->
  <g filter="url(#shadow)">
    ${lines.map((l, i) => `
      <text x="150" y="${titleStartY + (i * lineHeight)}" font-family="Georgia, serif" font-size="19" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">
        ${l}
      </text>
    `).join('')}
  </g>

  <!-- Author Divider & Name -->
  <g transform="translate(150, ${titleStartY + (lines.length * lineHeight) + 6})">
    <line x1="-40" y1="0" x2="40" y2="0" stroke="${accentColor}" stroke-width="2.5" stroke-linecap="round"/>
    <text x="0" y="18" font-family="system-ui, -apple-system, sans-serif" font-size="11.5" font-weight="700" fill="#f1f5f9" text-anchor="middle" letter-spacing="1.2">
      ${author.toUpperCase()}
    </text>
  </g>

  <!-- Footer Seal -->
  <g transform="translate(24, 396)">
    <text x="0" y="0" font-family="system-ui, sans-serif" font-size="8.5" font-weight="bold" fill="#94a3b8" letter-spacing="1">
      LIVROTEC • CETI
    </text>
    <text x="252" y="0" font-family="system-ui, sans-serif" font-size="8.5" font-weight="900" fill="${accentColor}" text-anchor="end">
      ACERVO OFICIAL
    </text>
  </g>

  <!-- 3D Book Spine Shading -->
  <rect x="0" y="0" width="14" height="420" fill="black" opacity="0.4"/>
  <line x1="14" y1="0" x2="14" y2="420" stroke="white" stroke-opacity="0.2" stroke-width="1"/>
</svg>
`.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
}

