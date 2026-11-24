import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Bookmark, 
  Volume2, 
  VolumeX, 
  Heart,
  Trash2,
  User,
  MessageSquare,
  Quote
} from 'lucide-react';
import { Book, StudentLoan, UserSession, BookReview } from '../types';
import { THEMES } from '../data/libraryData';
import { ReviewsSection } from './ReviewsSection';
import { BookCover } from './BookCover';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onStartLoan: (book: Book) => void;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
  currentUser?: UserSession | null;
  activeBookLoans?: StudentLoan[];
  onDeleteBook?: (bookId: string) => void;
  reviews?: BookReview[];
  onAddReview?: (review: Omit<BookReview, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeReview?: (reviewId: string) => void;
  isDarkMode?: boolean;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onStartLoan,
  isFavorite,
  onToggleFavorite,
  currentUser,
  activeBookLoans = [],
  onDeleteBook,
  reviews = [],
  onAddReview,
  onLikeReview,
  isDarkMode = false
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'preview' | 'reviews' | 'location' | 'adm_readers'>('info');
  const [isReadingSpeech, setIsReadingSpeech] = useState(false);

  // Guarantee speech is cancelled on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!book) return null;

  const themeConfig = THEMES.find((t) => t.id === book.theme);
  const isAvailable = book.availableCopies > 0;
  const isAdmin = currentUser?.role === 'admin';
  const bookReviews = reviews.filter((r) => r.bookId === book.id);

  // Check if current user has an active loan for this book
  const myActiveLoanForThisBook = activeBookLoans.find(
    (l) =>
      currentUser?.name &&
      l.studentName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()
  );

  // Simple Web Speech Synthesis preview read aloud in pt-BR
  const toggleSpeechExcerpt = () => {
    if (!('speechSynthesis' in window)) return;

    if (isReadingSpeech) {
      window.speechSynthesis.cancel();
      setIsReadingSpeech(false);
    } else {
      const textToRead = `${book.title}, por ${book.author}. ${book.previewExcerpt}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.onend = () => setIsReadingSpeech(false);
      utterance.onerror = () => setIsReadingSpeech(false);
      window.speechSynthesis.speak(utterance);
      setIsReadingSpeech(true);
    }
  };

  const handleClose = () => {
    if ('speechSynthesis' in window && isReadingSpeech) {
      window.speechSynthesis.cancel();
    }
    setIsReadingSpeech(false);
    onClose();
  };

  const handleDeleteBookClick = () => {
    if (!onDeleteBook) return;
    const confirmed = window.confirm(`Administrador: Deseja realmente remover "${book.title}" do acervo da Livrotec?`);
    if (confirmed) {
      handleClose();
      onDeleteBook(book.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-3xl border rounded-3xl shadow-2xl overflow-hidden my-8 transition-colors ${
          isDarkMode 
            ? 'bg-[#111c30] border-slate-700 text-white' 
            : 'bg-[#fcfbfa] border-[#1c1c1c]/25 text-[#1c1c1c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header backdrop subtle ambient glow */}
        {themeConfig && (
          <div 
            className="absolute top-0 left-0 right-0 h-28 opacity-15 pointer-events-none"
            style={{
              backgroundImage: `url(${themeConfig.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}

        {/* Close button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 z-20 p-2.5 rounded-full border transition-colors shadow-xs cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
              : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/20'
          }`}
          aria-label="Fechar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal content body */}
        <div className="relative z-10 p-6 sm:p-8">
          
          {/* Active User Loan Alert Banner */}
          {myActiveLoanForThisBook && (
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-xs flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <p className="font-bold text-amber-500">
                    Você possui 1 exemplar deste livro emprestado!
                  </p>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'}`}>
                    Prazo de devolução: <strong>{myActiveLoanForThisBook.dueDate}</strong> • Ticket: <code>#{myActiveLoanForThisBook.id.slice(-6).toUpperCase()}</code>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold text-[10px] uppercase shrink-0">
                Em sua posse
              </span>
            </div>
          )}

          {/* Main Top Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* Book Cover Visual */}
            <div className="sm:col-span-4 flex flex-col items-center">
              <div className="relative aspect-[3/4] w-48 sm:w-full rounded-2xl overflow-hidden shadow-lg border border-black/20 bg-[#ede8df] dark:bg-slate-800">
                <BookCover book={book} />
                {themeConfig && (
                  <span 
                    className="absolute top-3 left-3 z-20 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-slate-950 shadow-xs"
                    style={{ backgroundColor: themeConfig.accentColor }}
                  >
                    {themeConfig.name}
                  </span>
                )}
              </div>

              {/* Favorite toggle under image */}
              <button
                onClick={() => onToggleFavorite(book.id)}
                className={`mt-4 flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/10 border-rose-500/40 text-rose-500'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                    : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c] hover:bg-[#e4ddcf]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? 'Salvo nos Favoritos' : 'Adicionar aos Favoritos'}</span>
              </button>
            </div>

            {/* Book Info Column */}
            <div className="sm:col-span-8 space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                    {book.readingAge}
                  </span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>Ano {book.year}</span>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>• {book.pages} páginas</span>
                </div>

                <h2 className={`text-2xl sm:text-3xl font-semibold font-delicate leading-tight ${
                  isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
                }`}>
                  {book.title}
                </h2>
                <p className={`text-sm sm:text-base font-normal mt-1 ${
                  isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
                }`}>
                  Autor(a): <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-[#1c1c1c]'}`}>{book.author}</span>
                </p>
              </div>

              {/* Rating & Availability */}
              <div className={`flex flex-wrap items-center gap-3 py-2.5 border-y ${
                isDarkMode ? 'border-slate-800' : 'border-[#1c1c1c]/15'
              }`}>
                <div className="flex items-center gap-1.5 text-amber-500 font-medium text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{book.rating.toFixed(1)} / 5.0</span>
                </div>
                <div className={`h-4 w-px ${isDarkMode ? 'bg-slate-700' : 'bg-[#1c1c1c]/15'}`} />
                <div className="text-xs">
                  <span className={isAvailable ? 'text-emerald-500 font-medium' : 'text-rose-500 font-medium'}>
                    {isAvailable ? `Disponível (${book.availableCopies} de ${book.totalCopies} cópias no acervo)` : 'Esgotado no momento'}
                  </span>
                </div>

                {/* Only Admin sees global loan count badge */}
                {isAdmin && activeBookLoans.length > 0 && (
                  <div className="text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    {activeBookLoans.length} exemplar(es) em circulação
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className={`flex border-b gap-3 overflow-x-auto custom-scrollbar ${
                isDarkMode ? 'border-slate-800' : 'border-[#1c1c1c]/15'
              }`}>
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-2 text-xs font-medium transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                    activeTab === 'info'
                      ? isDarkMode ? 'border-amber-400 text-amber-400 font-bold' : 'border-[#1c1c1c] text-[#1c1c1c] font-bold'
                      : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-[#7d7567] hover:text-[#1c1c1c]'
                  }`}
                >
                  Sinopse & Detalhes
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`pb-2 text-xs font-medium transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'preview'
                      ? isDarkMode ? 'border-amber-400 text-amber-400 font-bold' : 'border-[#1c1c1c] text-[#1c1c1c] font-bold'
                      : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-[#7d7567] hover:text-[#1c1c1c]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Ler Amostra</span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 text-xs font-medium transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? isDarkMode ? 'border-amber-400 text-amber-400 font-bold' : 'border-[#1c1c1c] text-[#1c1c1c] font-bold'
                      : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-[#7d7567] hover:text-[#1c1c1c]'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Avaliações ({bookReviews.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('location')}
                  className={`pb-2 text-xs font-medium transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === 'location'
                      ? isDarkMode ? 'border-amber-400 text-amber-400 font-bold' : 'border-[#1c1c1c] text-[#1c1c1c] font-bold'
                      : isDarkMode ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-transparent text-[#7d7567] hover:text-[#1c1c1c]'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Localização na Escola</span>
                </button>

                {/* TAB EXCLUSIVA DE QUEM ALUGOU - SOMENTE VISÍVEL PARA O ADMINISTRADOR */}
                {isAdmin && (
                  <button
                    onClick={() => setActiveTab('adm_readers')}
                    className={`pb-2 text-xs font-bold transition-colors cursor-pointer border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                      activeTab === 'adm_readers'
                        ? 'border-amber-400 text-amber-400'
                        : 'border-transparent text-amber-500/70 hover:text-amber-400'
                    }`}
                    title="Aba sigilosa e restrita aos administradores"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                    <span>Quem Alugou ({activeBookLoans.length}) [ADM]</span>
                  </button>
                )}
              </div>

              {/* Tab 1: Info & Synopsis */}
              {activeTab === 'info' && (
                <div className="space-y-3 pt-1 animate-in fade-in">
                  <p className={`text-sm leading-relaxed font-normal ${
                    isDarkMode ? 'text-slate-300' : 'text-[#38332b]'
                  }`}>
                    {book.synopsis}
                  </p>

                  {book.sampleQuote && (
                    <div className={`relative p-4 sm:p-5 rounded-2xl border transition-all my-2 shadow-xs ${
                      isDarkMode 
                        ? 'bg-slate-900/90 border-amber-400/30 text-amber-200' 
                        : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c]'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isDarkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-[#1c1c1c]/10 text-[#8b261d]'
                        }`}>
                          <Quote className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider block ${
                            isDarkMode ? 'text-amber-400' : 'text-[#8b261d]'
                          }`}>
                            Frase Marcante da Obra
                          </span>
                          <blockquote className={`text-base sm:text-lg font-medium italic leading-relaxed font-delicate ${
                            isDarkMode ? 'text-amber-100' : 'text-[#1c1c1c]'
                          }`}>
                            "{book.sampleQuote}"
                          </blockquote>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {book.tags.map((tag, idx) => (
                      <span key={idx} className={`text-xs px-2.5 py-1 rounded-lg font-medium border ${
                        isDarkMode 
                          ? 'bg-slate-800 text-slate-300 border-slate-700' 
                          : 'bg-[#ede8df] text-[#4a4439] border-[#1c1c1c]/10'
                      }`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Excerpt Preview */}
              {activeTab === 'preview' && (
                <div className="space-y-3 pt-1 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'
                    }`}>
                      Trecho da Obra:
                    </span>
                    <button
                      onClick={toggleSpeechExcerpt}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors cursor-pointer font-medium ${
                        isDarkMode 
                          ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                          : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/20'
                      }`}
                      title="Ouvir leitura em voz alta"
                    >
                      {isReadingSpeech ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-amber-500" />}
                      <span>{isReadingSpeech ? 'Parar Áudio' : 'Ouvir Trecho'}</span>
                    </button>
                  </div>

                  <div className={`p-4 sm:p-5 rounded-2xl border text-base sm:text-lg leading-relaxed font-delicate italic max-h-56 overflow-y-auto custom-scrollbar ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-slate-100' 
                      : 'bg-[#ede8df] border-[#1c1c1c]/15 text-[#1c1c1c]'
                  }`}>
                    "{book.previewExcerpt}"
                  </div>
                  <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'}`}>
                    *Prévia escolar para apreciação do estudante. Obra completa disponível na Livrotec.
                  </p>
                </div>
              )}

              {/* Tab 3: Reviews and Star Ratings */}
              {activeTab === 'reviews' && (
                <div className="animate-in fade-in max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  <ReviewsSection
                    bookId={book.id}
                    bookTitle={book.title}
                    reviews={reviews}
                    onAddReview={onAddReview || (() => {})}
                    onLikeReview={onLikeReview || (() => {})}
                    currentUser={currentUser}
                    isDarkMode={isDarkMode}
                  />
                </div>
              )}

              {/* Tab 4: School Library Map Location */}
              {activeTab === 'location' && (
                <div className="space-y-3 pt-1 animate-in fade-in">
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-[#ede8df] border-[#1c1c1c]/15'
                  }`}>
                    <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm font-delicate">
                      <MapPin className="w-4 h-4" />
                      <span>{book.location}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'}`}>
                      Dirija-se ao setor indicado na sala da <strong className={isDarkMode ? 'text-amber-400' : 'text-[#1c1c1c]'}>Livrotec</strong> da sua escola. As etiquetas nas lombadas seguem a cor do tema ({themeConfig?.name}).
                    </p>
                    <div className={`flex items-center gap-2 pt-2 text-[11px] border-t ${
                      isDarkMode ? 'text-slate-400 border-slate-800' : 'text-[#5c5549] border-[#1c1c1c]/15'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Identificação do Código Escolar: #BIB-{book.id.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 5: Readers & Loans List - STRICTLY ADMIN ONLY */}
              {activeTab === 'adm_readers' && isAdmin && (
                <div className="space-y-3 pt-1 animate-in fade-in">
                  <div className={`p-4 rounded-2xl border space-y-2 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className={`flex items-center justify-between text-xs font-bold border-b pb-1.5 ${
                      isDarkMode ? 'text-amber-400 border-slate-800' : 'text-amber-900 border-amber-200'
                    }`}>
                      <span>Empréstimos Registrados Desta Obra:</span>
                      <span>{activeBookLoans.length} exemplar(es) retirado(s)</span>
                    </div>

                    {activeBookLoans.length === 0 ? (
                      <p className={`text-xs py-3 text-center italic ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>
                        Nenhum exemplar deste título está atualmente emprestado. Todos disponíveis na estante da Livrotec.
                      </p>
                    ) : (
                      <div className="space-y-2 pt-1">
                        {activeBookLoans.map((loan) => (
                          <div key={loan.id} className={`p-3 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs ${
                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-amber-200 text-[#1c1c1c]'
                          }`}>
                            <div>
                              <p className="font-bold flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-amber-500" />
                                <span>{loan.studentName}</span>
                                <span className={`text-[11px] font-normal ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>({loan.studentClass})</span>
                              </p>
                              <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'}`}>
                                Matrícula: <code>{loan.registrationNumber || 'N/A'}</code> • Retirada: {loan.loanDate} • Devolução: <strong className="text-amber-500">{loan.dueDate}</strong>
                              </p>
                            </div>
                            <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded self-start sm:self-auto">
                              #{loan.id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className={`mt-8 pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
            isDarkMode ? 'border-slate-800' : 'border-[#1c1c1c]/15'
          }`}>
            <div className={`text-xs flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-[#5c5549]'}`}>
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Prazo de empréstimo estudantil: <strong className={isDarkMode ? 'text-white' : 'text-[#1c1c1c]'}>14 dias</strong> (renovável)</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isAdmin && onDeleteBook && (
                <button
                  onClick={handleDeleteBookClick}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-500 hover:text-white text-xs font-bold transition-all cursor-pointer border border-rose-500/30 shadow-2xs"
                  title="Remover livro do acervo (Poder ADM)"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Obra</span>
                </button>
              )}

              <button
                onClick={handleClose}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                    : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/15'
                }`}
              >
                Voltar ao Catálogo
              </button>

              <button
                onClick={() => {
                  handleClose();
                  onStartLoan(book);
                }}
                disabled={!isAvailable}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isAvailable
                    ? isDarkMode
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black shadow-xs active:scale-95'
                      : 'bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] shadow-sm active:scale-95'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    : 'bg-[#ede8df] text-[#8c8273] cursor-not-allowed border border-[#1c1c1c]/10'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-300 fill-current" />
                <span>{isAvailable ? 'Solicitar Empréstimo Escolar' : 'Esgotado (0 Cópias)'}</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
