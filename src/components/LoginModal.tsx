import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  BookOpen, 
  GraduationCap, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  School,
  CheckCircle2,
  X
} from 'lucide-react';
import { UserSession } from '../types';
import { SCHOOL_CLASSES } from '../data/libraryData';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onLogin: (session: UserSession) => void;
  currentUser: UserSession | null;
  initialTab?: 'reader' | 'admin';
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  currentUser: _currentUser,
  initialTab = 'reader'
}) => {
  // Helper to guarantee tab is strictly 'reader' or 'admin', even if an event object was passed
  const sanitizeTab = (tab?: unknown): 'reader' | 'admin' => {
    return tab === 'admin' ? 'admin' : 'reader';
  };

  const [activeTab, setActiveTab] = useState<'reader' | 'admin'>(() => sanitizeTab(initialTab));

  // Sync initial tab whenever modal opens or initialTab updates
  useEffect(() => {
    if (isOpen) {
      setActiveTab(sanitizeTab(initialTab));
      setAdminError('');
      setAdminPassword('');
      setShowPassword(false);
    } else {
      setAdminError('');
      setAdminPassword('');
      setReaderName('');
      setShowPassword(false);
    }
  }, [isOpen, initialTab]);

  // Reader Form State
  const [readerName, setReaderName] = useState('');
  const [readerClass, setReaderClass] = useState<string>(SCHOOL_CLASSES[0]);

  // Admin Form State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleSwitchTab = (tab: 'reader' | 'admin') => {
    setActiveTab(tab);
    setAdminError('');
    setAdminPassword('');
  };

  const handleReaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerName.trim()) return;

    const session: UserSession = {
      role: 'reader',
      name: readerName.trim(),
      studentClass: readerClass,
      loginTime: new Date().toISOString()
    };

    setReaderName('');
    setAdminError('');
    onLogin(session);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');

    const cleanUser = adminUsername.trim().toLowerCase();
    const cleanPass = adminPassword.trim();

    // Required credentials as requested:
    // Nome/usuário: kaua.vandaiki
    // Senha: marilia.da.vida
    if (cleanUser === 'kaua.vandaiki' && cleanPass === 'marilia.da.vida') {
      const session: UserSession = {
        role: 'admin',
        name: 'Kaua Vandaiki',
        username: 'kaua.vandaiki',
        loginTime: new Date().toISOString()
      };
      setAdminUsername('');
      setAdminPassword('');
      setAdminError('');
      onLogin(session);
    } else {
      setAdminError('Usuário ou senha de administrador incorretos. Por favor, verifique os dados.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c1c1c]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#fcfbfa] border border-[#1c1c1c]/25 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            id="btn-close-login-modal"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border border-[#1c1c1c]/20 transition-colors shadow-xs cursor-pointer"
            title="Fechar / Explorar sem login"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Top Header & School Brand */}
        <div className="bg-[#1c1c1c] text-[#f7f5f0] p-6 text-center relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-32 h-32 bg-[#8b261d]/20 rounded-full blur-xl pointer-events-none" />

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#2e2b26] border border-[#f7f5f0]/20 text-[#f7f5f0] shadow-md mb-3">
            <BookOpen className="w-7 h-7 text-amber-300" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-semibold font-delicate tracking-tight text-[#f7f5f0]">
              Livrotec
            </h1>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400 text-[#1c1c1c]">
              Acesso
            </span>
          </div>

          <p className="text-xs text-[#c8bfb0] flex items-center justify-center gap-1.5 mt-1 font-medium">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            Ceti Gov. Alberto Tavares Silva
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="p-6 sm:p-7">
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#ede8df] rounded-2xl border border-[#1c1c1c]/15 mb-6">
            
            {/* Leitor Tab */}
            <button
              id="tab-btn-reader"
              type="button"
              onClick={() => handleSwitchTab('reader')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'reader'
                  ? 'bg-[#1c1c1c] text-[#f7f5f0] shadow-sm ring-1 ring-[#1c1c1c]'
                  : 'text-[#5c5549] hover:text-[#1c1c1c] hover:bg-[#e4ddcf]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Leitor (Aluno)</span>
            </button>

            {/* ADM Tab */}
            <button
              id="tab-btn-admin"
              type="button"
              onClick={() => handleSwitchTab('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#8b261d] text-[#ffffff] shadow-sm ring-1 ring-[#8b261d]'
                  : 'text-[#5c5549] hover:text-[#1c1c1c] hover:bg-[#e4ddcf]'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>ADM (Gestão)</span>
            </button>

          </div>

          {/* TAB 1: LEITOR */}
          {activeTab === 'reader' && (
            <form key="reader-form" onSubmit={handleReaderSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-[#5c5549] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  Bem-vindo à Livrotec! O acesso de leitor é livre para todos os alunos e professores explorarem o acervo e fazerem empréstimos.
                </p>
              </div>

              <div>
                <label htmlFor="login-input-reader-name" className="block text-xs font-bold text-[#1c1c1c] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8b261d]" />
                  Nome do Leitor(a) / Aluno(a) *
                </label>
                <input
                  id="login-input-reader-name"
                  type="text"
                  required
                  value={readerName}
                  onChange={(e) => setReaderName(e.target.value)}
                  placeholder="Digite seu nome (qualquer um)..."
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] placeholder-[#8c8273] focus:outline-none focus:border-[#1c1c1c] focus:ring-2 focus:ring-[#1c1c1c]/10 transition-all font-medium"
                  autoFocus
                />
                <p className="text-[11px] text-[#7d7567] mt-1">
                  Você pode usar seu nome próprio ou apelido de leitura.
                </p>
              </div>

              <div>
                <label htmlFor="login-select-reader-class" className="block text-xs font-bold text-[#1c1c1c] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-[#8b261d]" />
                  Turma (Ensino Médio):
                </label>
                <select
                  id="login-select-reader-class"
                  value={readerClass}
                  onChange={(e) => setReaderClass(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c] font-medium cursor-pointer"
                >
                  {SCHOOL_CLASSES.map((turma) => (
                    <option key={turma} value={turma}>
                      {turma}
                    </option>
                  ))}
                </select>
              </div>

              <button
                id="login-btn-reader-submit"
                type="submit"
                disabled={!readerName.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#2e2b26] disabled:bg-[#8c8273] text-[#f7f5f0] text-sm font-bold shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                <span>Entrar como Leitor</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2 text-xs font-semibold text-[#7d7567] hover:text-[#1c1c1c] transition-colors text-center cursor-pointer"
                >
                  Continuar explorando como visitante sem login →
                </button>
              )}
            </form>
          )}

          {/* TAB 2: ADM (kaua.vandaiki & marilia.da.vida) */}
          {activeTab === 'admin' && (
            <form key="admin-form" onSubmit={handleAdminSubmit} className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-rose-950/10 border border-rose-900/20 text-xs text-[#5c5549] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8b261d] shrink-0 mt-0.5" />
                <p>
                  Área restrita à administração da Livrotec. Requer nome de usuário e senha autorizados.
                </p>
              </div>

              {adminError && (
                <div className="p-3 rounded-xl bg-red-100 border border-red-300 text-xs font-semibold text-red-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{adminError}</span>
                </div>
              )}

              <div>
                <label htmlFor="login-input-admin-user" className="block text-xs font-bold text-[#1c1c1c] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#8b261d]" />
                  Usuário de Administrador (Nome) *
                </label>
                <input
                  id="login-input-admin-user"
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => {
                    setAdminUsername(e.target.value);
                    setAdminError('');
                  }}
                  placeholder="Ex: kaua.vandaiki"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-xl bg-white border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] placeholder-[#8c8273] focus:outline-none focus:border-[#8b261d] focus:ring-2 focus:ring-[#8b261d]/15 transition-all font-medium"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="login-input-admin-pass" className="block text-xs font-bold text-[#1c1c1c] mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#8b261d]" />
                  Senha do Administrador *
                </label>
                <div className="relative">
                  <input
                    id="login-input-admin-pass"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setAdminError('');
                    }}
                    placeholder="Digite a senha de administrador..."
                    autoComplete="current-password"
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-white border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] placeholder-[#8c8273] focus:outline-none focus:border-[#8b261d] focus:ring-2 focus:ring-[#8b261d]/15 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#8c8273] hover:text-[#1c1c1c] transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Quick helper tip for test convenience */}
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-[#5c5549] space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span>Usuário: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#1c1c1c] border border-amber-300">kaua.vandaiki</code></span>
                  <span>Senha: <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-[#1c1c1c] border border-amber-300">marilia.da.vida</code></span>
                </div>
                <button
                  id="login-btn-autofill-admin"
                  type="button"
                  onClick={() => {
                    setAdminUsername('kaua.vandaiki');
                    setAdminPassword('marilia.da.vida');
                    setAdminError('');
                  }}
                  className="w-full py-1 text-[11px] font-bold text-[#8b261d] hover:bg-amber-100/80 rounded-lg transition-colors cursor-pointer border border-amber-300/60"
                >
                  ⚡ Preencher Credenciais Automaticamente
                </button>
              </div>

              <button
                id="login-btn-admin-submit"
                type="submit"
                disabled={!adminUsername.trim() || !adminPassword.trim()}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#8b261d] hover:bg-[#6e1e17] disabled:bg-[#8c8273] text-[#ffffff] text-sm font-bold shadow-md hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Entrar como Administrador</span>
              </button>
            </form>
          )}

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-[#1c1c1c]/10 text-center text-xs text-[#7d7567]">
            Livrotec • Sistema de Gestão e Biblioteca Digital Escolar
          </div>
        </div>

      </div>
    </div>
  );
};
