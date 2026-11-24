import React from 'react';
import { Sparkles, Quote, RotateCcw, Compass } from 'lucide-react';
import { ThemeConfig, ThemeId } from '../types';

interface ThemeBannerProps {
  currentTheme?: ThemeConfig;
  activeTheme: ThemeId;
  onResetTheme: () => void;
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
  availableTags: string[];
  totalThemeBooks: number;
  isDarkMode?: boolean;
}

export const ThemeBanner: React.FC<ThemeBannerProps> = ({
  currentTheme,
  activeTheme,
  onResetTheme,
  selectedTag,
  onSelectTag,
  availableTags,
  totalThemeBooks,
  isDarkMode = false
}) => {
  if (!currentTheme && activeTheme === 'todos') {
    return (
      <div id="general-library-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 transition-colors ${
          isDarkMode 
            ? 'bg-[#152238] border-slate-700/80 shadow-md text-white' 
            : 'bg-[#ede8df] border-[#1c1c1c]/15 text-[#1c1c1c]'
        }`}>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-xs font-bold tracking-wider uppercase ${
                isDarkMode ? 'text-amber-400' : 'text-[#8b261d]'
              }`}>
                <Sparkles className="w-4 h-4" />
                <span>Acervo Completo • Todos os Gêneros</span>
              </div>
              <h2 className={`text-2xl sm:text-3xl font-bold font-bodoni ${
                isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
              }`}>
                Obras Literárias • Ceti Gov. Alberto Tavares Silva
              </h2>
              <p className={`text-sm max-w-xl font-normal leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
              }`}>
                Explore as estantes da <strong className={isDarkMode ? 'text-amber-400' : 'text-[#1c1c1c]'}>Livrotec</strong> ou selecione uma categoria acima (Romances, Novelas, Poesia, Contos, Crônicas, Teatro, Literatura Brasileira, Literatura Estrangeira, Antologias, Ficção, História, Biografia, História do Piauí e Dicionários) para filtrar por temática.
              </p>
            </div>

            {/* Quick Tag Pills */}
            {availableTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 max-w-md">
                <span className={`text-xs font-medium flex items-center gap-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
                }`}>
                  <Compass className="w-3.5 h-3.5 text-amber-500" /> Subgêneros:
                </span>
                <button
                  onClick={() => onSelectTag(null)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                    selectedTag === null
                      ? isDarkMode
                        ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs font-black'
                        : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c]'
                      : isDarkMode
                      ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
                      : 'bg-[#f7f5f0] text-[#1c1c1c] border-[#1c1c1c]/20 hover:border-[#1c1c1c]/50'
                  }`}
                >
                  Todas
                </button>
                {availableTags.slice(0, 6).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer border ${
                      selectedTag === tag
                        ? isDarkMode
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs font-black'
                          : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c]'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400'
                        : 'bg-[#f7f5f0] text-[#1c1c1c] border-[#1c1c1c]/20 hover:border-[#1c1c1c]/50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentTheme) return null;

  return (
    <div id="active-theme-hero-banner" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div 
        className="relative overflow-hidden rounded-3xl border border-[#1c1c1c]/25 shadow-xl p-6 sm:p-10"
        style={{
          minHeight: '220px'
        }}
      >
        {/* Thematic Wallpaper Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{ backgroundImage: `url(${currentTheme.bgImage})` }}
        />

        {/* Directional Gradient Overlay: Solid on the left for text contrast, open on the right to reveal the artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/75 to-black/30" />
        <div className={`absolute inset-0 bg-gradient-to-t ${currentTheme.gradient} opacity-40 mix-blend-overlay`} />

        {/* Thematic Content Information */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
          
          <div className="max-w-2xl space-y-3">
            
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="text-xs uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-black/60 backdrop-blur-xs border border-white/20"
                style={{ color: currentTheme.accentColor }}
              >
                Tema: {currentTheme.name}
              </span>
              <span className="text-xs text-white/90 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs">
                {totalThemeBooks} {totalThemeBooks === 1 ? 'título catalogado' : 'títulos catalogados'}
              </span>
              <span className="text-xs text-white/70 italic font-delicate">
                "{currentTheme.mood}"
              </span>
            </div>

            {/* Title & Tagline */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-bodoni text-white tracking-tight drop-shadow-md">
                {currentTheme.name}
              </h2>
              <p className="text-sm sm:text-base text-amber-200/90 font-delicate italic mt-1 drop-shadow">
                {currentTheme.tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-white/85 max-w-xl font-normal leading-relaxed drop-shadow-sm">
              {currentTheme.description}
            </p>

            {/* Famous Quote */}
            <div className="flex items-start gap-2 pt-2 text-xs text-white/75 font-delicate italic border-t border-white/15">
              <Quote className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>"{currentTheme.quote}"</span>
            </div>

          </div>

          {/* Right Action Column: Subgenres & Back to All */}
          <div className="flex flex-col items-start md:items-end gap-4">
            
            <button
              onClick={onResetTheme}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/35 text-white backdrop-blur-md border border-white/30 text-xs font-semibold transition-all cursor-pointer shadow hover:scale-102 active:scale-98"
              title="Voltar para a visualização com todos os temas da Livrotec"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ver Todos os Temas</span>
            </button>

            {/* Subgenre Filters */}
            {availableTags.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 backdrop-blur-md max-w-xs md:text-right space-y-2">
                <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider block">
                  Filtrar Subgênero:
                </span>
                <div className="flex flex-wrap gap-1.5 justify-start md:justify-end">
                  <button
                    onClick={() => onSelectTag(null)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      selectedTag === null
                        ? 'bg-amber-400 text-[#1c1c1c] shadow'
                        : 'bg-white/15 text-white hover:bg-white/30'
                    }`}
                  >
                    Todos
                  </button>
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => onSelectTag(tag === selectedTag ? null : tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        selectedTag === tag
                          ? 'bg-amber-400 text-[#1c1c1c] shadow'
                          : 'bg-white/15 text-white hover:bg-white/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
