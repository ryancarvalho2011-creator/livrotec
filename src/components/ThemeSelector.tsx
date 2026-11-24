import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Feather, 
  BookOpen, 
  LayoutGrid,
  ChevronRight,
  Search,
  Scroll,
  Newspaper,
  Drama,
  BookMarked,
  Globe,
  Layers,
  Landmark,
  UserCheck,
  Sun,
  SpellCheck
} from 'lucide-react';
import { ThemeConfig, ThemeId, Book } from '../types';
import { THEMES } from '../data/libraryData';

interface ThemeSelectorProps {
  activeTheme: ThemeId;
  onSelectTheme: (themeId: ThemeId) => void;
  books: Book[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isDarkMode?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  activeTheme,
  onSelectTheme,
  books,
  searchQuery,
  setSearchQuery,
  isDarkMode = false
}) => {
  // Helper icon renderer
  const renderThemeIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Heart':
        return <Heart className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'Feather':
        return <Feather className={className} />;
      case 'Scroll':
        return <Scroll className={className} />;
      case 'Newspaper':
        return <Newspaper className={className} />;
      case 'Drama':
        return <Drama className={className} />;
      case 'BookMarked':
        return <BookMarked className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Landmark':
        return <Landmark className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'Sun':
        return <Sun className={className} />;
      case 'SpellCheck':
        return <SpellCheck className={className} />;
      default:
        return <BookOpen className={className} />;
    }
  };

  const getBookCountForTheme = (themeId: ThemeId) => {
    if (themeId === 'todos') return books.length;
    return books.filter(b => b.theme === themeId).length;
  };

  return (
    <section id="theme-selector-section" className="w-full pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar positioned directly above "Oque vamos ler hoje?" */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center shadow-xs">
            <Search className={`w-4 h-4 sm:w-5 sm:h-5 absolute left-4 pointer-events-none ${
              isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
            }`} />
            <input
              id="theme-search-bar"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, autor, gênero ou tema..."
              className={`w-full pl-11 sm:pl-12 pr-10 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base rounded-2xl focus:outline-none transition-all shadow-xs ${
                isDarkMode
                  ? 'bg-[#152238] text-white placeholder-slate-400 border border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
                  : 'bg-[#ffffff] text-[#1c1c1c] placeholder-[#8c8273] border border-[#1c1c1c]/20 focus:border-[#1c1c1c] focus:ring-2 focus:ring-[#1c1c1c]/10'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute right-3.5 text-xs px-2 py-1 rounded-lg cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-800 text-slate-300 hover:text-white' 
                    : 'bg-[#ede8df] text-[#5c5549] hover:text-[#1c1c1c]'
                }`}
                title="Limpar busca"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Section Heading with "Oque vamos ler hoje?" */}
        <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7 border-b pb-5 ${
          isDarkMode ? 'border-slate-800' : 'border-[#1c1c1c]/15'
        }`}>
          <div>
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-medium tracking-normal font-delicate italic ${
              isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
            }`}>
              Oque vamos ler hoje?
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl mt-1 font-normal ${
              isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'
            }`}>
              Navegue pelos temas escolares da <strong className={isDarkMode ? 'text-amber-400' : 'text-[#1c1c1c] font-semibold'}>Livrotec</strong>. Cada seção possui seu acervo exclusivo e ambientação temática:
            </p>
          </div>

          {/* All themes toggle button */}
          <div className="flex items-center gap-2">
            <button
              id="theme-btn-all"
              onClick={() => onSelectTheme('todos')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                activeTheme === 'todos'
                  ? isDarkMode
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-md font-black scale-102'
                    : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-sm scale-102'
                  : isDarkMode
                  ? 'bg-slate-800 text-slate-200 border-slate-700 hover:border-amber-400 hover:text-amber-300'
                  : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20 hover:bg-[#e4ddcf] hover:border-[#1c1c1c]/40'
              }`}
            >
              <LayoutGrid className="w-4 h-4 text-amber-500" />
              <span>Ver Todos os Títulos ({books.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Thematic Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-3 no-scrollbar">
          <button
            onClick={() => onSelectTheme('todos')}
            className={`text-xs px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
              activeTheme === 'todos'
                ? isDarkMode
                  ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                  : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-xs'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20 hover:border-[#1c1c1c]/50'
            }`}
          >
            Todos os Gêneros ({books.length})
          </button>

          {THEMES.map((t) => {
            const isSelected = activeTheme === t.id;
            const count = getBookCountForTheme(t.id);

            return (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                      : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20 hover:border-[#1c1c1c]/50'
                }`}
              >
                {renderThemeIcon(t.iconName, 'w-3.5 h-3.5')}
                <span>{t.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({count})</span>
              </button>
            );
          })}
        </div>

        {/* 14 Thematic Category Cards with High-Res Thematic Backgrounds */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {THEMES.map((theme: ThemeConfig) => {
            const isSelected = activeTheme === theme.id;
            const count = getBookCountForTheme(theme.id);

            return (
              <button
                key={theme.id}
                id={`theme-btn-${theme.id}`}
                onClick={() => onSelectTheme(theme.id)}
                className={`group relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-300 transform active:scale-98 cursor-pointer border ${
                  isSelected
                    ? isDarkMode
                      ? 'ring-2 ring-amber-400 border-transparent shadow-xl scale-[1.02]'
                      : 'ring-2 ring-[#1c1c1c] border-transparent shadow-xl scale-[1.02]'
                    : isDarkMode
                    ? 'border-slate-800 hover:border-amber-400/60 hover:-translate-y-1 hover:shadow-lg'
                    : 'border-[#1c1c1c]/20 hover:border-[#1c1c1c]/60 hover:-translate-y-1 hover:shadow-lg'
                }`}
                style={{
                  minHeight: '210px',
                }}
              >
                {/* 1. Thematic Background Image with Zoom on Hover */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${theme.bgImage})`,
                  }}
                  role="img"
                  aria-label={`Fundo temático de ${theme.name}`}
                />

                {/* 2. Balanced Darkening Gradient to preserve the background image visibility */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/15 transition-opacity duration-300 ${
                    isSelected ? 'opacity-85' : 'opacity-75 group-hover:opacity-55'
                  }`}
                />

                {/* 3. Thematic Color Glow Accent Overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundColor: theme.accentColor }}
                />

                {/* 4. Active Corner Badge Indicator */}
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 z-20 flex items-center gap-1 bg-[#f7f5f0] text-[#1c1c1c] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow border border-[#1c1c1c]/20">
                    <span>Selecionado</span>
                  </div>
                )}

                {/* 5. Thematic Content Card */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="p-2.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md shadow-inner transition-transform group-hover:scale-105"
                      style={{ color: theme.accentColor }}
                    >
                      {renderThemeIcon(theme.iconName, 'w-5 h-5')}
                    </div>

                    {!isSelected && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-black/60 text-[#f7f5f0] border border-white/15 backdrop-blur-xs">
                        {count} {count === 1 ? 'obra' : 'obras'}
                      </span>
                    )}
                  </div>

                  {/* Bottom Info: Title & Subtitle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white font-delicate tracking-wide drop-shadow group-hover:text-[#f7f5f0] transition-colors">
                        {theme.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all" />
                    </div>

                    <p className="text-xs text-white/90 font-normal line-clamp-1 mt-0.5 drop-shadow">
                      {theme.tagline}
                    </p>

                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/20">
                      <span 
                        className="text-[10px] uppercase font-medium tracking-wider px-2 py-0.5 rounded bg-black/60 text-[#f7f5f0]"
                        style={{ borderLeft: `3px solid ${theme.accentColor}` }}
                      >
                        {theme.badge}
                      </span>
                      <span className="text-[11px] text-white/80 italic font-delicate">
                        {theme.mood}
                      </span>
                    </div>
                  </div>

                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
