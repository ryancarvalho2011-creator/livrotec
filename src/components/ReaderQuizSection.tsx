import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Bookmark, 
  Star,
  Award,
  Compass,
  Heart,
  Ghost,
  Swords,
  Brain,
  Zap,
  Coffee,
  Search,
  Eye,
  Skull,
  BookMarked,
  Flame,
  Feather,
  Ship,
  Castle,
  Crown,
  Trophy,
  Lightbulb,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { Book, ReaderArchetype, QuizResultProfile } from '../types';
import { QUIZ_QUESTIONS, PROFILES_MAP } from '../data/quizData';
import { THEMES } from '../data/libraryData';
import { BookCover } from './BookCover';

interface ReaderQuizSectionProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
  onStartLoan: (book: Book) => void;
  isDarkMode?: boolean;
  sessionResetKey?: number;
}

export const ReaderQuizSection: React.FC<ReaderQuizSectionProps> = ({
  books,
  onSelectBook,
  onStartLoan,
  isDarkMode = false,
  sessionResetKey = 0
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, ReaderArchetype>>({});
  const [resultProfile, setResultProfile] = useState<QuizResultProfile | null>(null);

  // Automatically reset quiz progress, answers and results when session resets
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResultProfile(null);
  }, [sessionResetKey]);

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  const handleSelectOption = (archetype: ReaderArchetype) => {
    const updatedAnswers = { ...answers, [currentQuestion.id]: archetype };
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate outcome profile by most frequent archetype
      const counts: Record<string, number> = {
        explorer: 0,
        detective: 0,
        thrillseeker: 0,
        romantic: 0,
        thinker: 0
      };

      Object.values(updatedAnswers).forEach((arch: ReaderArchetype) => {
        const key = String(arch);
        counts[key] = (counts[key] || 0) + 1;
      });

      let winner: ReaderArchetype = 'explorer';
      let maxCount = -1;
      Object.entries(counts).forEach(([arch, count]) => {
        if (count > maxCount) {
          maxCount = count;
          winner = arch as ReaderArchetype;
        }
      });

      const profile = PROFILES_MAP[winner] || PROFILES_MAP.explorer;
      setResultProfile(profile);

      // Smoothly scroll to the quiz section to showcase the results
      setTimeout(() => {
        document.getElementById('quiz-do-leitor-section')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResultProfile(null);
  };

  const handleJumpToQuestion = (index: number) => {
    if (index <= Object.keys(answers).length) {
      setCurrentQuestionIndex(index);
      setResultProfile(null);
    }
  };

  // Curated recommended books calculated safely and dynamically
  const recommendedBooks = useMemo(() => {
    if (!resultProfile) return [];

    const curated: Book[] = [];
    const targetIds = resultProfile.recommendedBookIds || [];
    
    // 1. Direct ID matches from profile's curated list in exact priority order
    for (const id of targetIds) {
      const found = books.find((b) => b.id === id);
      if (found && !curated.some((b) => b.id === found.id)) {
        curated.push(found);
      }
    }

    // 2. Supplementary matches from themes if fewer than 3
    if (curated.length < 3 && resultProfile.recommendedThemes?.length) {
      for (const theme of resultProfile.recommendedThemes) {
        const themeBooks = books.filter(
          (b) => b.theme === theme && !curated.some((c) => c.id === b.id)
        );
        for (const b of themeBooks) {
          curated.push(b);
          if (curated.length >= 3) break;
        }
        if (curated.length >= 3) break;
      }
    }

    // 3. Fallback to any available books if still under 3
    if (curated.length < 3) {
      for (const b of books) {
        if (!curated.some((c) => c.id === b.id)) {
          curated.push(b);
          if (curated.length >= 3) break;
        }
      }
    }

    return curated.slice(0, 3);
  }, [resultProfile, books]);

  const getOptionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Moon': return <Ghost className="w-4 h-4 text-purple-400" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'Search': return <Search className="w-4 h-4 text-blue-400" />;
      case 'Brain': return <Brain className="w-4 h-4 text-indigo-400" />;
      case 'Swords': return <Swords className="w-4 h-4 text-red-400" />;
      case 'Eye': return <Eye className="w-4 h-4 text-cyan-400" />;
      case 'Ghost': return <Ghost className="w-4 h-4 text-emerald-400" />;
      case 'Heart': return <Heart className="w-4 h-4 text-pink-400" />;
      case 'Skull': return <Skull className="w-4 h-4 text-rose-500" />;
      case 'Compass': return <Compass className="w-4 h-4 text-amber-500" />;
      case 'Flame': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'BookMarked': return <BookMarked className="w-4 h-4 text-amber-500" />;
      case 'Feather': return <Feather className="w-4 h-4 text-emerald-400" />;
      case 'Ship': return <Ship className="w-4 h-4 text-cyan-500" />;
      case 'Castle': return <Castle className="w-4 h-4 text-purple-500" />;
      case 'Crown': return <Crown className="w-4 h-4 text-amber-400" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case 'Trophy': return <Trophy className="w-4 h-4 text-amber-500" />;
      case 'Lightbulb': return <Lightbulb className="w-4 h-4 text-yellow-400" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4 text-rose-400" />;
      case 'Award': return <Award className="w-4 h-4 text-amber-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const getArchetypeVisual = (archetype: ReaderArchetype) => {
    switch (archetype) {
      case 'explorer':
        return {
          icon: <Compass className="w-8 h-8 text-slate-950" />,
          emoji: '⚡',
          matchTag: '98% Afinidade com seu perfil'
        };
      case 'detective':
        return {
          icon: <Search className="w-8 h-8 text-slate-950" />,
          emoji: '🔍',
          matchTag: '99% Mente Analítica'
        };
      case 'thrillseeker':
        return {
          icon: <Ghost className="w-8 h-8 text-slate-950" />,
          emoji: '🖤',
          matchTag: '97% Intensidade Pura'
        };
      case 'romantic':
        return {
          icon: <Heart className="w-8 h-8 text-slate-950" />,
          emoji: '💖',
          matchTag: '99% Conexão Emocional'
        };
      case 'thinker':
        return {
          icon: <Brain className="w-8 h-8 text-slate-950" />,
          emoji: '🧠',
          matchTag: '98% Pensamento Crítico'
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-slate-950" />,
          emoji: '✨',
          matchTag: '100% Match Literário'
        };
    }
  };

  return (
    <section 
      id="quiz-do-leitor-section" 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-12 scroll-mt-24"
    >
      <div className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
        isDarkMode 
          ? 'bg-[#111c30] border-slate-700/80 text-white' 
          : 'bg-[#ffffff] border-[#1c1c1c]/15 text-[#1c1c1c]'
      }`}>
        
        {/* Top Header Banner of the Quiz Section */}
        <div className={`p-6 sm:p-8 border-b flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
          isDarkMode 
            ? 'bg-[#0d1627] border-slate-800' 
            : 'bg-[#ede8df] border-[#1c1c1c]/12'
        }`}>
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-400 text-slate-950 font-bold shadow-md shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  isDarkMode ? 'bg-slate-800 text-amber-300' : 'bg-[#1c1c1c] text-[#f7f5f0]'
                }`}>
                  Interativo • Quiz do Leitor
                </span>
                <span className="text-xs text-amber-500 font-bold hidden sm:inline">
                  CETI Alberto Tavares Silva
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-delicate tracking-tight mt-1">
                Descubra Seu Perfil de Leitor
              </h2>
              <p className={`text-xs sm:text-sm mt-0.5 ${
                isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
              }`}>
                Responda a 5 perguntas rápidas e receba recomendações exclusivas do acervo da Livrotec.
              </p>
            </div>
          </div>

          {resultProfile && (
            <button
              onClick={handleRestartQuiz}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border self-end md:self-auto hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' 
                  : 'bg-[#faf8f5] hover:bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Refazer Quiz</span>
            </button>
          )}
        </div>

        {/* Quiz Content: Questions OR Result */}
        <div className="p-6 sm:p-10">
          {!resultProfile ? (
            /* Active Question State */
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
              
              {/* Progress & Stepper */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className={isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'}>
                    Pergunta <strong className={isDarkMode ? 'text-white' : 'text-[#1c1c1c]'}>{currentQuestionIndex + 1}</strong> de {totalQuestions}
                  </span>
                  <span className="text-amber-500 font-bold">
                    {Math.round(progressPercent)}% Concluído
                  </span>
                </div>

                {/* Progress bar track */}
                <div className={`w-full h-2.5 rounded-full overflow-hidden ${
                  isDarkMode ? 'bg-slate-800' : 'bg-[#ede8df]'
                }`}>
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Question steps indicator pills */}
                <div className="flex items-center justify-center gap-2 pt-1">
                  {QUIZ_QUESTIONS.map((q, idx) => {
                    const isAnswered = answers[q.id] !== undefined;
                    const isCurrent = idx === currentQuestionIndex;
                    return (
                      <button
                        key={q.id}
                        onClick={() => handleJumpToQuestion(idx)}
                        disabled={!isAnswered && idx > currentQuestionIndex}
                        className={`h-2 rounded-full transition-all cursor-pointer ${
                          isCurrent 
                            ? 'w-8 bg-amber-400' 
                            : isAnswered 
                            ? 'w-4 bg-emerald-500' 
                            : 'w-2 bg-slate-300 dark:bg-slate-700 opacity-40'
                        }`}
                        title={`Ir para Pergunta ${idx + 1}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Question Title & Subtitle */}
              <div className="text-center sm:text-left space-y-1.5 pt-2">
                <h3 className="text-xl sm:text-2xl font-bold font-delicate leading-snug">
                  {currentQuestion.title}
                </h3>
                <p className={`text-xs sm:text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
                }`}>
                  {currentQuestion.subtitle}
                </p>
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-3 sm:gap-3.5">
                {currentQuestion.options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.archetype;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.archetype)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group shadow-xs hover:translate-x-1 ${
                        isSelected 
                          ? isDarkMode
                            ? 'bg-amber-400/15 border-amber-400 text-white ring-2 ring-amber-400/40'
                            : 'bg-amber-50 border-amber-500 text-[#1c1c1c] ring-2 ring-amber-500/20'
                          : isDarkMode 
                          ? 'bg-[#152238] border-slate-700 hover:border-amber-400/80 hover:bg-[#1a2b47] text-slate-200' 
                          : 'bg-[#ede8df]/70 border-[#1c1c1c]/15 hover:border-[#1c1c1c]/50 hover:bg-[#e4ddcf] text-[#1c1c1c]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 pr-3">
                        <div className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:scale-110 ${
                          isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-[#1c1c1c]/10 shadow-xs'
                        }`}>
                          {getOptionIcon(opt.iconName)}
                        </div>
                        <span className="text-xs sm:text-sm font-medium leading-relaxed">
                          {opt.text}
                        </span>
                      </div>

                      <ArrowRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                        isSelected ? 'text-amber-500' : 'opacity-40'
                      }`} />
                    </button>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Result Profile View */
            <div className="space-y-8 animate-in zoom-in-95 duration-300">
              
              {/* Profile Card */}
              <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden shadow-lg ${
                isDarkMode 
                  ? 'bg-[#152238] border-slate-700 text-white' 
                  : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c]'
              }`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center text-3xl sm:text-4xl shadow-md shrink-0">
                    {resultProfile.icon ? (
                      <span>{resultProfile.icon}</span>
                    ) : (
                      getArchetypeVisual(resultProfile.archetype).icon
                    )}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                        {resultProfile.badge || 'Seu Arquétipo Literário'}
                      </span>
                      <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {getArchetypeVisual(resultProfile.archetype).matchTag}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold font-delicate">
                      {resultProfile.title}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-normal ${
                      isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
                    }`}>
                      {resultProfile.description}
                    </p>
                  </div>
                </div>

                {/* Trait & Habits Chips */}
                <div className="mt-5 pt-4 border-t border-inherit/20 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-amber-500 mr-1 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Suas Características:
                  </span>
                  {(resultProfile.habits || resultProfile.traits || []).map((trait, idx) => (
                    <span 
                      key={idx}
                      className={`text-xs font-semibold px-3 py-1 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-slate-900 border-slate-700 text-amber-300' 
                          : 'bg-white border-[#1c1c1c]/15 text-[#1c1c1c] shadow-2xs'
                      }`}
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Books Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-amber-500" />
                    <h4 className="text-lg font-bold font-delicate">
                      Livros Recomendados Para Você no Acervo
                    </h4>
                  </div>
                  <span className="text-xs font-bold text-amber-500">
                    {recommendedBooks.length} obras selecionadas
                  </span>
                </div>

                {recommendedBooks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendedBooks.map((book) => {
                      const themeConfig = THEMES.find((t) => t.id === book.theme);
                      return (
                        <div
                          key={book.id}
                          className={`p-4 rounded-2xl border flex flex-col justify-between transition-all hover:shadow-lg group hover:-translate-y-1 ${
                            isDarkMode 
                              ? 'bg-[#152238] border-slate-700/80 hover:border-amber-400' 
                              : 'bg-[#faf8f5] border-[#1c1c1c]/15 hover:border-[#1c1c1c]/40'
                          }`}
                        >
                          <div className="flex gap-3.5">
                            <div className="w-16 sm:w-20 aspect-2/3 shrink-0 rounded-xl overflow-hidden shadow border border-black/10">
                              <BookCover book={book} size="sm" />
                            </div>

                            <div className="min-w-0 flex-1 flex flex-col justify-between">
                              <div>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded inline-block mb-1 ${
                                  isDarkMode ? 'bg-slate-800 text-amber-300' : 'bg-[#ede8df] text-[#1c1c1c]'
                                }`}>
                                  {themeConfig?.name || book.theme}
                                </span>
                                <h5 className="font-bold text-xs sm:text-sm line-clamp-2 leading-tight">
                                  {book.title}
                                </h5>
                                <p className={`text-[11px] truncate mt-0.5 ${
                                  isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
                                }`}>
                                  {book.author}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 mt-2">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  book.availableCopies > 0 
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300' 
                                    : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                                }`}>
                                  {book.availableCopies > 0 ? `${book.availableCopies} disp.` : 'Emprestado'}
                                </span>
                                <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  {book.rating}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Actions */}
                          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-inherit/15">
                            <button
                              onClick={() => onSelectBook(book)}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer text-center ${
                                isDarkMode 
                                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                                  : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/15'
                              }`}
                            >
                              Ver Obra
                            </button>

                            <button
                              onClick={() => onStartLoan(book)}
                              disabled={book.availableCopies <= 0}
                              className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer text-center flex items-center justify-center gap-1 ${
                                book.availableCopies > 0
                                  ? isDarkMode
                                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                                    : 'bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0]'
                                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              <Bookmark className="w-3 h-3" />
                              <span>Retirar</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-amber-500/30">
                    <p className="text-sm font-medium">Nenhum livro encontrado diretamente para esse arquétipo no momento.</p>
                  </div>
                )}

                {/* Footer restart call to action */}
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleRestartQuiz}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-xs hover:scale-105 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' 
                        : 'bg-[#faf8f5] hover:bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Fazer o Teste Novamente com Novas Respostas</span>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </section>
  );
};

