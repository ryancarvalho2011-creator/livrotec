import React, { useState } from 'react';
import { X, Sparkles, Shuffle, Star, ArrowRight } from 'lucide-react';
import { Book, ThemeId } from '../types';
import { THEMES } from '../data/libraryData';
import { BookCover } from './BookCover';

interface SurpriseBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export const SurpriseBookModal: React.FC<SurpriseBookModalProps> = ({
  isOpen,
  onClose,
  books,
  onSelectBook,
}) => {
  const [selectedMoodTheme, setSelectedMoodTheme] = useState<ThemeId | 'random'>('random');
  const [pickedBook, setPickedBook] = useState<Book | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen) return null;

  const handlePickRandom = (themeFilter?: ThemeId | 'random') => {
    setIsSpinning(true);
    const filter = themeFilter || selectedMoodTheme;

    let pool = books;
    if (filter !== 'random') {
      pool = books.filter((b) => b.theme === filter);
    }

    if (pool.length === 0) pool = books;

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setPickedBook(pool[randomIndex]);
      setIsSpinning(false);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1c1c]/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#fcfbfa] border border-[#1c1c1c]/25 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border border-[#1c1c1c]/20 transition-colors shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-[#1c1c1c] text-[#f7f5f0] border border-[#1c1c1c] mb-1 shadow-xs">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1c1c1c] font-delicate">
            Indicação Literária da Livrotec
          </h2>
          <p className="text-xs text-[#5c5549] max-w-sm mx-auto">
            Não sabe o que ler hoje? Deixe o oráculo escolar da Livrotec sortear uma recomendação perfeita para você!
          </p>
        </div>

        {/* Mood filter pill selector */}
        <div className="space-y-2 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] block text-center">
            Escolha seu gênero de interesse:
          </span>
          <div className="flex flex-wrap justify-center gap-1.5">
            <button
              onClick={() => { setSelectedMoodTheme('random'); handlePickRandom('random'); }}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer border ${
                selectedMoodTheme === 'random'
                  ? 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c]'
                  : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/15 hover:bg-[#e4ddcf]'
              }`}
            >
              🎲 Qualquer Tema
            </button>
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedMoodTheme(t.id); handlePickRandom(t.id); }}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer border ${
                  selectedMoodTheme === t.id
                    ? 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] font-bold'
                    : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/15 hover:bg-[#e4ddcf]'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Drawn Book Result */}
        {pickedBook ? (
          <div className={`p-4 rounded-2xl bg-[#ede8df] border border-[#1c1c1c]/20 space-y-3 transition-opacity ${isSpinning ? 'opacity-30' : 'opacity-100'}`}>
            <div className="flex gap-4 items-center">
              <div className="w-16 h-24 rounded-xl overflow-hidden shadow border border-[#1c1c1c]/15 shrink-0">
                <BookCover book={pickedBook} size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#1c1c1c] text-[#f7f5f0]">
                    {pickedBook.theme.toUpperCase()}
                  </span>
                  <span className="text-xs text-amber-600 flex items-center gap-1 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    {pickedBook.rating.toFixed(1)}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#1c1c1c] truncate font-bodoni">
                  {pickedBook.title}
                </h3>
                <p className="text-xs text-[#5c5549]">{pickedBook.author}</p>
                {pickedBook.sampleQuote && (
                  <p className="text-sm sm:text-base text-[#1c1c1c] line-clamp-3 mt-1.5 italic font-delicate bg-[#f7f5f0] p-2 rounded-xl border border-[#1c1c1c]/10">
                    "{pickedBook.sampleQuote}"
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1c1c1c]/15">
              <span className="text-[11px] text-[#5c5549]">
                Local: {pickedBook.location}
              </span>
              <button
                onClick={() => {
                  onClose();
                  onSelectBook(pickedBook);
                }}
                className="flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] transition-colors cursor-pointer"
              >
                <span>Ver Livro</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <button
              onClick={() => handlePickRandom()}
              disabled={isSpinning}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Shuffle className={`w-4 h-4 text-amber-300 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Sorteando...' : 'Sortear Recomendação'}</span>
            </button>
          </div>
        )}

        {pickedBook && (
          <div className="text-center pt-4">
            <button
              onClick={() => handlePickRandom()}
              disabled={isSpinning}
              className="text-xs text-[#5c5549] hover:text-[#1c1c1c] underline cursor-pointer font-medium"
            >
              Tentar outro livro aleatório
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
