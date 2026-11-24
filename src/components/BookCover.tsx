import React, { useState } from 'react';
import { Book } from '../types';
import { THEMES } from '../data/libraryData';
import { Bookmark, Sparkles, BookOpen, Star, Flame, Shield } from 'lucide-react';

interface BookCoverProps {
  book: Book;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showOverlay?: boolean;
}

export const BookCover: React.FC<BookCoverProps> = ({
  book,
  className = '',
  size = 'md',
  showOverlay = true
}) => {
  const [imageError, setImageError] = useState(false);

  // Reset image error state whenever book or cover image changes
  React.useEffect(() => {
    setImageError(false);
  }, [book.id, book.coverImage]);

  const themeConfig = THEMES.find((t) => t.id === book.theme);

  // Theme palettes for typography and fallbacks
  const themeColorStyles: Record<string, { bg: string; accent: string; border: string; text: string; glow: string }> = {
    romances: {
      bg: 'from-[#2d0a18] via-[#400e23] to-[#17050d]',
      accent: '#f43f5e',
      border: 'border-rose-800/60',
      text: 'text-rose-100',
      glow: 'shadow-rose-950/50'
    },
    novelas: {
      bg: 'from-[#131131] via-[#211d4d] to-[#0c0a1f]',
      accent: '#818cf8',
      border: 'border-indigo-800/60',
      text: 'text-indigo-100',
      glow: 'shadow-indigo-950/50'
    },
    poesia: {
      bg: 'from-[#291804] via-[#452707] to-[#140b02]',
      accent: '#f59e0b',
      border: 'border-amber-800/60',
      text: 'text-amber-100',
      glow: 'shadow-amber-950/50'
    },
    contos: {
      bg: 'from-[#052618] via-[#093d27] to-[#02140c]',
      accent: '#10b981',
      border: 'border-emerald-800/60',
      text: 'text-emerald-100',
      glow: 'shadow-emerald-950/50'
    },
    cronicas: {
      bg: 'from-[#08222d] via-[#0e3647] to-[#041219]',
      accent: '#06b6d4',
      border: 'border-cyan-800/60',
      text: 'text-cyan-100',
      glow: 'shadow-cyan-950/50'
    },
    teatro: {
      bg: 'from-[#23092d] via-[#3a0e4a] to-[#13051a]',
      accent: '#a855f7',
      border: 'border-purple-800/60',
      text: 'text-purple-100',
      glow: 'shadow-purple-950/50'
    },
    'literatura-brasileira': {
      bg: 'from-[#2d1604] via-[#4a2407] to-[#190b02]',
      accent: '#f59e0b',
      border: 'border-amber-700/60',
      text: 'text-amber-100',
      glow: 'shadow-amber-950/50'
    },
    'literatura-estrangeira': {
      bg: 'from-[#071d33] via-[#0d2e50] to-[#040f1c]',
      accent: '#38bdf8',
      border: 'border-sky-800/60',
      text: 'text-sky-100',
      glow: 'shadow-sky-950/50'
    },
    antologias: {
      bg: 'from-[#042422] via-[#073c38] to-[#021413]',
      accent: '#14b8a6',
      border: 'border-teal-800/60',
      text: 'text-teal-100',
      glow: 'shadow-teal-950/50'
    },
    ficcao: {
      bg: 'from-[#1c0d33] via-[#2f1654] to-[#0e071c]',
      accent: '#8b5cf6',
      border: 'border-violet-800/60',
      text: 'text-violet-100',
      glow: 'shadow-violet-950/50'
    },
    historia: {
      bg: 'from-[#261908] via-[#3d290d] to-[#140d04]',
      accent: '#d97706',
      border: 'border-amber-900/60',
      text: 'text-amber-100',
      glow: 'shadow-amber-950/50'
    },
    biografia: {
      bg: 'from-[#2a0c14] via-[#421320] to-[#17060b]',
      accent: '#e11d48',
      border: 'border-rose-900/60',
      text: 'text-rose-100',
      glow: 'shadow-rose-950/50'
    },
    'historia-do-piaui': {
      bg: 'from-[#261e05] via-[#3f3209] to-[#141002]',
      accent: '#eab308',
      border: 'border-yellow-700/60',
      text: 'text-yellow-100',
      glow: 'shadow-yellow-950/50'
    },
    dicionarios: {
      bg: 'from-[#0a1b33] via-[#102d54] to-[#060f1c]',
      accent: '#3b82f6',
      border: 'border-blue-800/60',
      text: 'text-blue-100',
      glow: 'shadow-blue-950/50'
    }
  };

  const currentThemeStyle = themeColorStyles[book.theme] || {
    bg: 'from-[#1e1b4b] to-[#0f172a]',
    accent: '#fbbf24',
    border: 'border-slate-700',
    text: 'text-slate-100',
    glow: 'shadow-black/50'
  };

  const isManga = false;
  const isTopYear = book.tags.some(t => t.startsWith('Top 202'));

  return (
    <div 
      className={`relative w-full h-full overflow-hidden select-none bg-slate-900 ${currentThemeStyle.glow} ${className}`}
    >
      {/* Real Cover Image */}
      {!imageError && book.coverImage ? (
        <img
          src={book.coverImage}
          alt={`Capa do livro ${book.title}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        /* Fallback: High-end Stylized Graphic Book Cover */
        <div className={`w-full h-full bg-gradient-to-b ${currentThemeStyle.bg} p-4 flex flex-col justify-between border-2 ${currentThemeStyle.border} relative overflow-hidden`}>
          {/* Subtle geometric pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />
          
          {/* Top Banner */}
          <div className="relative z-10 flex items-center justify-between">
            <span 
              className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm shadow-xs"
              style={{ backgroundColor: themeConfig?.accentColor || '#fbbf24', color: '#0f172a' }}
            >
              {isManga ? 'MANGÁ' : themeConfig?.name || 'LIVRO'}
            </span>
            <span className="text-[10px] font-mono font-bold text-white/70">
              {book.year}
            </span>
          </div>

          {/* Center Title & Author */}
          <div className="relative z-10 my-auto text-center px-1">
            <div className="inline-block p-1.5 rounded-full mb-2 bg-white/10 backdrop-blur-xs">
              {isManga ? <Flame className="w-5 h-5 text-amber-400" /> : <BookOpen className="w-5 h-5 text-amber-300" />}
            </div>
            <h3 className="font-serif-display text-base sm:text-lg font-black text-white leading-tight drop-shadow-md line-clamp-3">
              {book.title}
            </h3>
            <div className="w-10 h-0.5 mx-auto my-2 rounded-full" style={{ backgroundColor: themeConfig?.accentColor || '#fbbf24' }} />
            <p className="text-[11px] font-sans-delicate text-white/85 font-medium tracking-wide line-clamp-1">
              {book.author}
            </p>
          </div>

          {/* Bottom Publisher / Rating Bar */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-white/70 pt-2 border-t border-white/15">
            <span className="font-semibold text-white/90">LIVROTEC • CETI</span>
            <div className="flex items-center gap-0.5 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400 inline" />
              <span>{book.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Book 3D Spine and Lighting Effect */}
      <div className="absolute inset-y-0 left-0 w-3.5 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 left-1 w-px bg-white/20 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

      {/* Manga Japanese style corner banner if manga */}
      {isManga && (
        <div className="absolute top-2 right-2 z-20 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-xs tracking-wider shadow-sm uppercase">
          Manga
        </div>
      )}

      {/* Year Foil Ribbon for Top Year books */}
      {isTopYear && !isManga && (
        <div className="absolute top-2 right-2 z-20 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-xs tracking-wider shadow-sm uppercase border border-red-400/40">
          Top {book.year}
        </div>
      )}
    </div>
  );
};
