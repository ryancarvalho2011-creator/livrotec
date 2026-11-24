import React from 'react';
import { Star, MapPin, BookOpen, Eye, Bookmark, CheckCircle2, AlertCircle, Heart, MessageSquare } from 'lucide-react';
import { Book } from '../types';
import { THEMES } from '../data/libraryData';
import { BookCover } from './BookCover';

interface BookCardProps {
  book: Book;
  onOpenDetails: (book: Book) => void;
  onOpenPreview: (book: Book) => void;
  onStartLoan: (book: Book) => void;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
  borrowedCount?: number;
  userLoanDueDate?: string | null;
  isDarkMode?: boolean;
  reviewsCount?: number;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onOpenDetails,
  onOpenPreview,
  onStartLoan,
  isFavorite,
  onToggleFavorite,
  borrowedCount = 0,
  userLoanDueDate = null,
  isDarkMode = false,
  reviewsCount = 0
}) => {
  const themeConfig = THEMES.find((t) => t.id === book.theme);
  const isAvailable = book.availableCopies > 0;

  return (
    <div
      id={`book-card-${book.id}`}
      className={`group relative flex flex-col justify-between rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border ${
        isDarkMode
          ? 'bg-[#131d31] hover:bg-[#18253d] border-slate-700/80 hover:border-amber-400/50 text-white'
          : 'bg-[#ffffff] hover:bg-[#fcfbfa] border-[#1c1c1c]/15 hover:border-[#1c1c1c]/40 text-[#1c1c1c]'
      }`}
    >
      {/* Top section: Image & Badges */}
      <div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#ede8df] dark:bg-slate-800 mb-3.5 shadow-sm border border-black/10">
          <BookCover book={book} />

          {/* Theme Pill on top-left */}
          {themeConfig && (
            <div 
              className="absolute top-2.5 left-2.5 z-20 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-slate-950 shadow-xs backdrop-blur-xs"
              style={{ backgroundColor: themeConfig.accentColor }}
            >
              {themeConfig.name}
            </div>
          )}

          {/* User borrowed active badge overlay */}
          {userLoanDueDate && (
            <div className="absolute bottom-2.5 left-2.5 z-20 text-[9px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 border border-amber-500 shadow-md animate-pulse">
              Com você até {userLoanDueDate}
            </div>
          )}

          {/* Favorite heart button top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(book.id);
            }}
            className={`absolute top-2.5 right-2.5 z-20 p-2 rounded-full border transition-colors shadow-xs cursor-pointer ${
              isDarkMode 
                ? 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-rose-400 border-slate-700' 
                : 'bg-[#f7f5f0]/90 hover:bg-[#ffffff] text-[#5c5549] hover:text-[#8b261d] border-[#1c1c1c]/20'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Favoritar livro'}
            aria-label="Favoritar"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#8b261d] text-[#8b261d] dark:fill-rose-500 dark:text-rose-500' : ''}`} />
          </button>

          {/* Age tag on bottom-right */}
          <div className="absolute bottom-2.5 right-2.5 z-20 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-white border border-white/20 backdrop-blur-xs">
            {book.readingAge}
          </div>

          {/* Quick Preview Hover Overlay */}
          <button
            onClick={() => onOpenPreview(book)}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer backdrop-blur-xs"
          >
            <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-slate-950 text-xs font-bold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform border border-black/20">
              <Eye className="w-4 h-4 text-amber-600" />
              <span>Ler Amostra</span>
            </span>
          </button>
        </div>

        {/* Book Information */}
        <div className="space-y-1.5">
          <div className={`flex items-center justify-between gap-1 text-[11px] ${
            isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
          }`}>
            <span>{book.year} • {book.pages} págs</span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{book.rating.toFixed(1)}</span>
              {reviewsCount > 0 && (
                <span className={`text-[10px] font-normal flex items-center gap-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
                }`}>
                  <MessageSquare className="w-2.5 h-2.5" />({reviewsCount})
                </span>
              )}
            </div>
          </div>

          <h3 
            onClick={() => onOpenDetails(book)}
            className={`font-semibold text-lg hover:text-amber-500 transition-colors cursor-pointer line-clamp-1 font-delicate ${
              isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
            }`}
            title={book.title}
          >
            {book.title}
          </h3>

          <p className={`text-xs font-medium line-clamp-1 ${
            isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'
          }`}>
            de <span className={isDarkMode ? 'text-slate-200 font-semibold' : 'text-[#1c1c1c] font-semibold'}>{book.author}</span>
          </p>

          <p className={`text-xs line-clamp-2 pt-1 leading-relaxed font-normal ${
            isDarkMode ? 'text-slate-300' : 'text-[#6e6659]'
          }`}>
            {book.synopsis}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1.5">
            {book.tags.slice(0, 2).map((tag, idx) => (
              <span
                key={idx}
                className={`text-[10px] px-2 py-0.5 rounded font-medium border ${
                  isDarkMode 
                    ? 'bg-slate-800 text-slate-300 border-slate-700' 
                    : 'bg-[#ede8df] text-[#4a4439] border-[#1c1c1c]/10'
                }`}
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* School Library Shelf Location */}
          <div className={`flex items-center gap-1.5 text-[11px] pt-2 border-t ${
            isDarkMode ? 'text-slate-400 border-slate-800' : 'text-[#5c5549] border-[#1c1c1c]/10'
          }`}>
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">{book.location}</span>
          </div>
        </div>
      </div>

      {/* Bottom status & action buttons */}
      <div className={`mt-4 pt-3 border-t space-y-2.5 ${
        isDarkMode ? 'border-slate-800' : 'border-[#1c1c1c]/10'
      }`}>
        {/* Availability indicator */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isAvailable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  Disponível ({book.availableCopies}/{book.totalCopies})
                </span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-rose-600 dark:text-rose-400 font-bold text-[11px]">
                  Esgotado (0/{book.totalCopies})
                </span>
              </>
            )}
          </div>
          {borrowedCount > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isDarkMode ? 'bg-amber-400/20 text-amber-400' : 'text-[#8b261d] bg-[#8b261d]/10'
            }`}>
              {borrowedCount} emp.
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenDetails(book)}
            className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/15'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Detalhes</span>
          </button>

          <button
            onClick={() => onStartLoan(book)}
            disabled={!isAvailable}
            className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isAvailable
                ? isDarkMode
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-xs active:scale-95'
                  : 'bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] shadow-sm active:scale-95'
                : isDarkMode
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-[#ede8df] text-[#8c8273] border border-[#1c1c1c]/10 cursor-not-allowed'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-300 fill-current" />
            <span>{isAvailable ? 'Emprestar' : 'Esgotado'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
