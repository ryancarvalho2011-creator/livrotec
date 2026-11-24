import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  BookMarked, 
  GraduationCap, 
  User, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  Sun,
  Moon,
  BookPlus,
  Compass,
  Camera
} from 'lucide-react';
import { ThemeId, UserSession } from '../types';

interface HeaderProps {
  activeTheme: ThemeId;
  setActiveTheme: (theme: ThemeId) => void;
  loanCount: number;
  onOpenLoans: () => void;
  onRandomBook: () => void;
  totalBooksCount: number;
  currentUser: UserSession | null;
  onOpenLogin: (initialTab?: 'reader' | 'admin') => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAddBook?: () => void;
  onOpenProfileModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTheme: _activeTheme,
  setActiveTheme,
  loanCount,
  onOpenLoans,
  onRandomBook,
  totalBooksCount: _totalBooksCount,
  currentUser,
  onOpenLogin,
  onLogout,
  isDarkMode,
  onToggleDarkMode,
  onOpenAddBook,
  onOpenProfileModal
}) => {
  const [isOofing, setIsOofing] = useState(false);

  // Web Audio API fallback synthesizer for the iconic Roblox "OOF / UGH" sound
  const synthesizeRobloxUgh = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const duration = 0.32;

      // Vocal pitch slide: starts ~300Hz, drops steeply down to ~150Hz
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'triangle';

      [osc1, osc2].forEach((osc) => {
        osc.frequency.setValueAtTime(290, now);
        osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(145, now + duration);
      });

      // Vocal tract formant filtering (classic "oo-ff / u-gh" resonance)
      const formant1 = ctx.createBiquadFilter();
      formant1.type = 'bandpass';
      formant1.frequency.setValueAtTime(520, now);
      formant1.Q.setValueAtTime(3.0, now);

      const formant2 = ctx.createBiquadFilter();
      formant2.type = 'lowpass';
      formant2.frequency.setValueAtTime(1300, now);

      // Volume envelope: punchy attack, sustained vocal body, rapid cutoff
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.025);
      gain.gain.setValueAtTime(0.45, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(formant1);
      osc2.connect(formant1);
      formant1.connect(formant2);
      formant2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch (err) {
      console.warn('Audio synthesis fallback error:', err);
    }
  };

  // Play the iconic Roblox "UGH / OOF" sound
  const playRobloxUghSound = () => {
    setIsOofing(true);
    setTimeout(() => setIsOofing(false), 600);

    try {
      const audio = new Audio('https://www.myinstants.com/media/sounds/roblox-death-sound_1.mp3');
      audio.volume = 0.85;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          synthesizeRobloxUgh();
        });
      }
    } catch {
      synthesizeRobloxUgh();
    }
  };

  const handleLivrotecClick = () => {
    playRobloxUghSound();
    setActiveTheme('todos');
  };

  return (
    <header 
      id="livrotec-header" 
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors shadow-xs ${
        isDarkMode 
          ? 'bg-[#0a1815]/95 border-emerald-900/60 text-white' 
          : 'bg-[#0f4d36] border-[#0a3827] text-white shadow-sm'
      }`}
    >
      {/* Institutional Top Tri-color Accent Bar: Verde, Amarelo/Ouro, Vermelho e Azul (Piauí / Brasil / Escola) */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-600 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
          
          {/* Left Column: User Status Profile Badge */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-start">
            {currentUser ? (
              <div className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl border text-xs shadow-2xs ${
                isDarkMode 
                  ? 'bg-slate-800/90 border-slate-700 text-white' 
                  : 'bg-white/10 border-white/20 text-white backdrop-blur-xs'
              }`}>
                {/* User Avatar with Profile Photo / Camera Trigger */}
                <button
                  type="button"
                  onClick={onOpenProfileModal}
                  className="relative group/avatar shrink-0 cursor-pointer rounded-full focus:outline-hidden"
                  title="Alterar ou personalizar foto de perfil"
                >
                  {currentUser.avatarUrl ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 shadow-sm ring-1 ring-white/30">
                      <img 
                        src={currentUser.avatarUrl} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Camera className="w-3 h-3 text-amber-300" />
                      </div>
                    </div>
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/40 shadow-xs relative ${
                      currentUser.role === 'admin' 
                        ? 'bg-rose-600 text-amber-200' 
                        : isDarkMode
                        ? 'bg-amber-400 text-slate-950 font-black'
                        : 'bg-white text-[#0f4d36] font-bold'
                    }`}>
                      {currentUser.role === 'admin' ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <span className="text-xs font-black uppercase font-delicate">
                          {currentUser.name.charAt(0)}
                        </span>
                      )}
                      <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white">
                        <Camera className="w-3 h-3 text-amber-300" />
                      </div>
                    </div>
                  )}
                  {/* Subtle camera badge indicator */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-slate-950 border border-white dark:border-slate-800 shadow-2xs">
                    <Camera className="w-2 h-2 text-slate-950" />
                  </span>
                </button>

                <div 
                  onClick={onOpenProfileModal}
                  className="leading-tight cursor-pointer group/name"
                  title="Clique para editar sua foto de perfil"
                >
                  <div className="flex items-center gap-1.5">
                    <span className={`font-bold truncate max-w-[120px] sm:max-w-[170px] group-hover/name:underline underline-offset-2 ${
                      isDarkMode ? 'text-white' : 'text-white'
                    }`}>
                      {currentUser.name}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      currentUser.role === 'admin' 
                        ? 'bg-amber-400 text-[#1c1c1c]' 
                        : isDarkMode
                        ? 'bg-slate-700 text-slate-200'
                        : 'bg-emerald-800 text-emerald-100 border border-emerald-400/30'
                    }`}>
                      {currentUser.role === 'admin' ? 'ADM' : 'Leitor'}
                    </span>
                  </div>
                  <span className={`text-[10px] block truncate max-w-[130px] ${
                    isDarkMode ? 'text-slate-400' : 'text-emerald-100/90'
                  }`}>
                    {currentUser.role === 'admin' ? 'Gestão Escolar' : currentUser.studentClass || 'Estudante'}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  className={`ml-1 flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer font-bold text-[11px] ${
                    isDarkMode 
                      ? 'bg-slate-700 hover:bg-slate-600 text-rose-300' 
                      : 'bg-rose-500/20 hover:bg-rose-600 text-rose-100 border border-rose-400/30'
                  }`}
                  title="Sair da conta"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-header-login"
                onClick={() => onOpenLogin('reader')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  isDarkMode 
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black' 
                    : 'bg-white hover:bg-emerald-50 text-[#0f4d36] font-bold shadow-sm'
                }`}
                title="Fazer Login na Livrotec"
              >
                <LogIn className="w-4 h-4 text-emerald-700 dark:text-amber-300" />
                <span>Fazer Login</span>
              </button>
            )}

            {/* School Open Badge */}
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-100'
            }`}>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-xs"></span>
              <span className="font-medium tracking-wide">Acervo Aberto</span>
            </div>
          </div>

          {/* Center Column: Centered "Livrotec" Logo & School Library Editorial Branding */}
          <div className="flex justify-center items-center">
            <button 
              id="btn-livrotec-logo"
              onClick={handleLivrotecClick}
              className={`relative flex items-center gap-3.5 sm:gap-4 group text-center transition-all hover:scale-[1.02] active:scale-95 cursor-pointer select-none ${
                isOofing ? 'scale-110 rotate-[-2deg]' : ''
              }`}
              title="Roblox Ugh! / Oof! & Voltar ao início da Livrotec"
            >
              <div className={`relative flex items-center justify-center w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-2xl shadow-md transition-all shrink-0 border-2 ${
                isDarkMode 
                  ? 'bg-slate-800 text-amber-400 border-amber-400/50 group-hover:bg-slate-700' 
                  : 'bg-white text-[#0f4d36] border-white/90 group-hover:bg-emerald-50 shadow-sm'
              }`}>
                <BookOpen className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform ${
                  isOofing ? 'scale-125 text-amber-300' : 'group-hover:scale-110'
                }`} />
                {/* Static indicator without ping / pulsing animation */}
                <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                  <span className={`relative inline-flex rounded-full h-3 w-3 bg-amber-400 border-2 ${
                    isDarkMode ? 'border-slate-800' : 'border-[#0f4d36]'
                  }`}></span>
                </span>
                {isOofing && (
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white font-black text-[11px] px-2 py-0.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                    OOF! 💀
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start sm:items-center">
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight font-delicate transition-colors leading-none ${
                    isDarkMode 
                      ? 'text-white group-hover:text-amber-400' 
                      : 'text-white group-hover:text-amber-300 drop-shadow-xs'
                  }`}>
                    Livrotec
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md whitespace-nowrap shadow-2xs border ${
                    isDarkMode 
                      ? 'bg-slate-800 text-amber-300 border-slate-700' 
                      : 'bg-white/15 text-white border-white/30 backdrop-blur-xs'
                  }`}>
                    Ceti Gov. Alberto Tavares Silva
                  </span>
                </div>
                <p className={`text-[11px] sm:text-xs flex items-center gap-1 font-medium mt-0.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-emerald-100/95'
                }`}>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  Arquivo & Biblioteca Estudantil
                </p>
              </div>
            </button>
          </div>

          {/* Right Column: Dark Mode Toggle + Actions & Student Tools */}
          <div className="flex items-center justify-center sm:justify-end gap-2 w-full lg:w-auto">
            
            {/* Surprise Book Button (Indicação) */}
            <button
              id="btn-surprise-book"
              onClick={onRandomBook}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer border ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-xs'
              }`}
              title="Indicação aleatória de livro do acervo"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Indicação</span>
            </button>

            {/* Quiz do Leitor Shortcut Button */}
            <button
              id="btn-header-quiz"
              onClick={() => {
                document.getElementById('quiz-do-leitor-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all shadow-xs hover:scale-[1.02] active:scale-95 cursor-pointer border ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' 
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-xs'
              }`}
              title="Quiz do Leitor: descubra seu perfil e recomendações de livros"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Quiz</span>
            </button>

            {/* Admin Add Book Button - Apenas exibido para Administrador */}
            {currentUser?.role === 'admin' && (
              <button
                id="btn-admin-add-book"
                onClick={() => onOpenAddBook?.()}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-black rounded-xl transition-all shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer border ring-2 ${
                  isDarkMode 
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 ring-amber-400/20' 
                    : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400 ring-white/30'
                }`}
                title="Cadastrar novo livro no acervo da Livrotec"
              >
                <BookPlus className="w-4 h-4 text-white dark:text-slate-950" />
                <span className="whitespace-nowrap">Adicionar Livro</span>
              </button>
            )}

            {/* My Loans Drawer Button */}
            <button
              id="btn-my-loans-drawer"
              onClick={onOpenLoans}
              className={`relative flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm group cursor-pointer border ${
                isDarkMode 
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-400 font-black' 
                  : 'bg-white hover:bg-emerald-50 text-[#0f4d36] border-white shadow-xs'
              }`}
            >
              <BookMarked className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${
                isDarkMode ? 'text-slate-950' : 'text-[#0f4d36]'
              }`} />
              <span>Empréstimos</span>
              {loanCount > 0 ? (
                <span className={`font-black px-1.5 py-0.2 rounded-full text-[10px] sm:text-[11px] shadow-xs ${
                  isDarkMode ? 'bg-slate-950 text-amber-300' : 'bg-rose-600 text-white'
                }`}>
                  {loanCount}
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  isDarkMode ? 'text-slate-950/70 bg-amber-300' : 'text-[#0f4d36]/80 bg-emerald-100'
                }`}>
                  0
                </span>
              )}
            </button>

            {/* Dark Mode Switch Toggle Button */}
            <button
              id="btn-toggle-dark-mode"
              onClick={onToggleDarkMode}
              className={`p-2 rounded-xl transition-all cursor-pointer border shadow-2xs hover:scale-105 active:scale-95 ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700' 
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25 backdrop-blur-xs'
              }`}
              title={isDarkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-white animate-in spin-in-180 duration-300" />
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
