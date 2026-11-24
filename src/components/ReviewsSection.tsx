import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  User, 
  Send, 
  Sparkles,
  Award
} from 'lucide-react';
import { BookReview, UserSession } from '../types';
import { SCHOOL_CLASSES } from '../data/libraryData';

interface ReviewsSectionProps {
  bookId: string;
  bookTitle: string;
  reviews: BookReview[];
  onAddReview: (review: Omit<BookReview, 'id' | 'createdAt' | 'likes'>) => void;
  onLikeReview: (reviewId: string) => void;
  currentUser?: UserSession | null;
  isDarkMode?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  bookId,
  bookTitle: _bookTitle,
  reviews,
  onAddReview,
  onLikeReview,
  currentUser,
  isDarkMode = false
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState(currentUser?.name || '');
  const [studentClass, setStudentClass] = useState(currentUser?.studentClass || SCHOOL_CLASSES[0]);
  const [comment, setComment] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const bookReviews = reviews.filter((r) => r.bookId === bookId);

  // Calculate average rating
  const averageRating = bookReviews.length > 0
    ? (bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Por favor, informe seu nome.');
      return;
    }
    if (!comment.trim()) {
      setErrorMessage('Por favor, escreva um comentário sobre a obra.');
      return;
    }

    onAddReview({
      bookId,
      userName: name.trim(),
      userClass: studentClass.trim() || 'Estudante',
      rating,
      comment: comment.trim(),
      isVerifiedStudent: true,
      avatarUrl: currentUser?.avatarUrl
    });

    setComment('');
    setHasSubmitted(true);
    setErrorMessage('');
    setTimeout(() => setHasSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 pt-1">
      
      {/* Top Review Summary Box */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isDarkMode 
          ? 'bg-[#152238] border-slate-700/80' 
          : 'bg-[#ede8df] border-[#1c1c1c]/15'
      }`}>
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-400 text-slate-950 font-black shadow-xs min-w-[70px]">
            <span className="text-2xl font-black font-delicate leading-none">{averageRating}</span>
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-2.5 h-2.5 fill-current text-slate-950" />
              ))}
            </div>
          </div>

          <div>
            <h4 className={`text-base font-bold font-delicate ${isDarkMode ? 'text-white' : 'text-[#1c1c1c]'}`}>
              Avaliações da Comunidade Escolar
            </h4>
            <p className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'}`}>
              Baseado em <strong className={isDarkMode ? 'text-amber-400' : 'text-[#1c1c1c]'}>{bookReviews.length} opinião(ões)</strong> de alunos do Ceti Gov. Alberto Tavares Silva
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-amber-400' 
              : 'bg-white border-[#1c1c1c]/15 text-[#8b261d]'
          }`}>
            <Award className="w-3.5 h-3.5" />
            <span>Opiniões Verificadas</span>
          </span>
        </div>
      </div>

      {/* Review Submission Form */}
      <form 
        onSubmit={handleSubmit}
        className={`p-4 sm:p-5 rounded-2xl border space-y-4 ${
          isDarkMode 
            ? 'bg-[#18253d] border-slate-700/80' 
            : 'bg-white border-[#1c1c1c]/15 shadow-2xs'
        }`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-inherit/20 pb-3">
          <h5 className={`text-sm font-bold font-delicate flex items-center gap-1.5 ${
            isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
          }`}>
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>Escreva sua Avaliação sobre este Livro</span>
          </h5>

          {/* Interactive Star Picker */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(null)}
                className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                title={`${star} estrela(s)`}
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    (hoverRating !== null ? star <= hoverRating : star <= rating)
                      ? 'fill-amber-400 text-amber-400'
                      : isDarkMode
                      ? 'text-slate-600'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            {errorMessage}
          </div>
        )}

        {hasSubmitted && (
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Sua avaliação foi publicada com sucesso! Obrigado por incentivar a leitura.</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={`text-[11px] font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'}`}>
              Seu Nome:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Kaua Melo"
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-400' 
                  : 'bg-[#faf8f5] border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
              }`}
            />
          </div>

          <div>
            <label className={`text-[11px] font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'}`}>
              Turma (Ensino Médio):
            </label>
            <select
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none transition-all font-medium ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-400' 
                  : 'bg-[#faf8f5] border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
              }`}
            >
              {SCHOOL_CLASSES.map((turma) => (
                <option key={turma} value={turma}>
                  {turma}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={`text-[11px] font-semibold block mb-1 ${isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'}`}>
            O que você achou da história? (Comentário):
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Conte aos outros estudantes o que achou dos personagens, do enredo ou do ritmo da leitura..."
            className={`w-full px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none transition-all resize-none ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-700 text-white focus:border-amber-400' 
                : 'bg-[#faf8f5] border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
            }`}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publicar Avaliação</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-3">
        <h5 className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'}`}>
          Opiniões Registradas ({bookReviews.length}):
        </h5>

        {bookReviews.length === 0 ? (
          <div className={`p-6 rounded-2xl border text-center ${
            isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-[#ede8df]/50 border-[#1c1c1c]/10 text-[#7d7567]'
          }`}>
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-amber-500 opacity-60" />
            <p className="text-xs">Seja o primeiro estudante a avaliar esta obra!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookReviews.map((rev) => (
              <div
                key={rev.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isDarkMode 
                    ? 'bg-[#152238] border-slate-800 text-slate-200' 
                    : 'bg-white border-[#1c1c1c]/10 text-[#1c1c1c] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {rev.avatarUrl ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shadow-2xs shrink-0">
                        <img 
                          src={rev.avatarUrl} 
                          alt={rev.userName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : currentUser && rev.userName.toLowerCase().trim() === currentUser.name.toLowerCase().trim() && currentUser.avatarUrl ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shadow-2xs shrink-0">
                        <img 
                          src={currentUser.avatarUrl} 
                          alt={rev.userName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs font-delicate shrink-0 shadow-2xs">
                        {rev.userName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs">{rev.userName}</span>
                        {rev.isVerifiedStudent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Leitor
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] block ${isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'}`}>
                        {rev.userClass || 'Ensino Médio'} • {rev.createdAt}
                      </span>
                    </div>
                  </div>

                  {/* Stars for this review */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= rev.rating
                            ? 'fill-amber-400 text-amber-400'
                            : isDarkMode
                            ? 'text-slate-700'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className={`text-xs leading-relaxed mt-1 ${isDarkMode ? 'text-slate-300' : 'text-[#363229]'}`}>
                  "{rev.comment}"
                </p>

                {/* Bottom Helpful Button */}
                <div className="mt-3 pt-2 border-t border-inherit/15 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => onLikeReview(rev.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      isDarkMode 
                        ? 'hover:bg-slate-800 text-slate-400 hover:text-amber-400' 
                        : 'hover:bg-[#ede8df] text-[#7d7567] hover:text-[#1c1c1c]'
                    }`}
                    title="Marcar como útil"
                  >
                    <ThumbsUp className="w-3 h-3 text-amber-500" />
                    <span>Útil ({rev.likes})</span>
                  </button>

                  <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-[#9c9384]'}`}>
                    Livrotec Feedback Escolar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
