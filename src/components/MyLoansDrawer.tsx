import React, { useState } from 'react';
import { 
  X, 
  BookMarked, 
  Calendar, 
  CheckCircle2, 
  RotateCcw, 
  BookOpen, 
  User, 
  Search, 
  ShieldCheck,
  Lock,
  LogIn,
  Layers,
  GraduationCap
} from 'lucide-react';
import { StudentLoan, UserSession } from '../types';
import { THEMES } from '../data/libraryData';

interface MyLoansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loans: StudentLoan[];
  onReturnBook: (loanId: string, bookId: string) => void;
  currentUser?: UserSession | null;
  onOpenLogin?: () => void;
}

export const MyLoansDrawer: React.FC<MyLoansDrawerProps> = ({
  isOpen,
  onClose,
  loans,
  onReturnBook,
  currentUser,
  onOpenLogin
}) => {
  const [drawerSearch, setDrawerSearch] = useState('');
  const [returnSuccessMsg, setReturnSuccessMsg] = useState('');

  if (!isOpen) return null;

  const isAdmin = currentUser?.role === 'admin';
  const isReader = currentUser?.role === 'reader' && !!currentUser?.name;

  // Filter loans based on role
  // ADM: sees ALL loans
  // Reader: sees ONLY their own personal loans
  // Visitor: sees 0 loans (restricted privacy screen)
  const accessibleLoans = isAdmin
    ? loans
    : isReader
    ? loans.filter(
        (l) =>
          l.studentName.toLowerCase().trim() === currentUser.name.toLowerCase().trim() ||
          (currentUser.username && l.studentName.toLowerCase().trim() === currentUser.username.toLowerCase().trim())
      )
    : [];

  const filteredLoans = accessibleLoans.filter((l) => {
    if (!drawerSearch.trim()) return true;
    const q = drawerSearch.toLowerCase().trim();
    return (
      l.bookTitle.toLowerCase().includes(q) ||
      l.studentName.toLowerCase().includes(q) ||
      l.studentClass.toLowerCase().includes(q) ||
      l.registrationNumber.toLowerCase().includes(q) ||
      l.bookAuthor.toLowerCase().includes(q)
    );
  });

  const activeLoans = filteredLoans.filter((l) => l.status === 'active');
  const returnedLoans = filteredLoans.filter((l) => l.status === 'returned');

  const totalActiveAll = accessibleLoans.filter((l) => l.status === 'active').length;
  const totalReturnedAll = accessibleLoans.filter((l) => l.status === 'returned').length;

  const handleReturnWithFeedback = (loanId: string, bookId: string, title: string) => {
    onReturnBook(loanId, bookId);
    setReturnSuccessMsg(`"${title}" devolvido ao acervo com sucesso!`);
    setTimeout(() => {
      setReturnSuccessMsg('');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1c1c1c]/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-[#fcfbfa] border-l border-[#1c1c1c]/20 p-5 sm:p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]/15">
              <div className="flex items-center gap-2.5">
                {currentUser?.avatarUrl ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shadow-xs shrink-0">
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-xl text-[#f7f5f0] border ${
                    isAdmin ? 'bg-[#8b261d] border-amber-400/30' : 'bg-[#1c1c1c] border-[#1c1c1c]'
                  }`}>
                    {isAdmin ? <ShieldCheck className="w-5 h-5 text-amber-300" /> : <BookMarked className="w-5 h-5 text-amber-300" />}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#1c1c1c] font-delicate">
                      {isAdmin ? 'Empréstimos Gerais (ADM)' : isReader ? 'Meus Empréstimos' : 'Controle de Empréstimos'}
                    </h2>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded ${
                      isAdmin ? 'bg-amber-400 text-[#1c1c1c]' : 'bg-[#ede8df] text-[#5c5549]'
                    }`}>
                      {isAdmin ? 'Visão ADM' : isReader ? 'Privado' : 'Sigiloso'}
                    </span>
                  </div>
                  <p className="text-xs text-[#5c5549]">
                    {isAdmin
                      ? 'Visão completa de todos os alunos do CETI'
                      : isReader
                      ? `Leitor: ${currentUser.name} (${currentUser.studentClass || 'Estudante'})`
                      : 'Acesso restrito à Administração da Livrotec'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-[#ede8df] text-[#1c1c1c] hover:bg-[#e4ddcf] border border-[#1c1c1c]/15 transition-colors cursor-pointer"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notification alert on return */}
            {returnSuccessMsg && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{returnSuccessMsg}</span>
              </div>
            )}

            {/* VISITOR / NOT LOGGED IN STATE */}
            {!currentUser && (
              <div className="mt-6 p-6 rounded-2xl bg-[#ede8df] border border-[#1c1c1c]/15 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-[#1c1c1c] text-amber-300 flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1c1c1c] font-delicate">
                    Privacidade e Sigilo do Acervo
                  </h3>
                  <p className="text-xs text-[#5c5549] mt-2 leading-relaxed">
                    Por diretriz da escola, <strong>apenas o Administrador</strong> pode ver quem alugou cada livro. Os estudantes autenticados têm acesso exclusivamente aos seus próprios livros emprestados.
                  </p>
                </div>

                {onOpenLogin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenLogin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] text-xs font-bold shadow-md cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-amber-300" />
                    <span>Fazer Login (Leitor ou ADM)</span>
                  </button>
                )}
              </div>
            )}

            {/* LOGGED IN CONTENT (READER OR ADMIN) */}
            {currentUser && (
              <>
                {/* Quick Stat Summary Counters */}
                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  <div className="p-3 rounded-xl bg-[#ede8df] border border-[#1c1c1c]/15 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#7d7567] block tracking-wider">
                      {isAdmin ? 'Empréstimos Ativos' : 'Livros em Minha Posse'}
                    </span>
                    <span className="text-xl font-bold text-[#8b261d] font-delicate">
                      {totalActiveAll}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#ede8df] border border-[#1c1c1c]/15 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#7d7567] block tracking-wider">
                      {isAdmin ? 'Total Devolvidos' : 'Meus Devolvidos'}
                    </span>
                    <span className="text-xl font-bold text-emerald-700 font-delicate">
                      {totalReturnedAll}
                    </span>
                  </div>
                </div>

                {/* Search within accessible loans */}
                {accessibleLoans.length > 0 && (
                  <div className="mt-4 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7d7567]" />
                    <input
                      type="text"
                      value={drawerSearch}
                      onChange={(e) => setDrawerSearch(e.target.value)}
                      placeholder={isAdmin ? "Buscar aluno, livro, turma ou matrícula..." : "Buscar nos meus livros..."}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#ede8df] border border-[#1c1c1c]/15 text-xs text-[#1c1c1c] placeholder-[#7d7567] focus:outline-none focus:border-[#1c1c1c]"
                    />
                    {drawerSearch && (
                      <button
                        onClick={() => setDrawerSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[#7d7567] hover:text-[#1c1c1c]"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                )}

                {/* Active Loans Section */}
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1c1c1c] flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                      <span>{isAdmin ? `Empréstimos em Andamento (${activeLoans.length})` : `Meus Livros Ativos (${activeLoans.length})`}</span>
                    </h3>
                  </div>

                  {activeLoans.length === 0 ? (
                    <div className="p-8 text-center bg-[#ede8df] rounded-2xl border border-[#1c1c1c]/15 space-y-2">
                      <BookOpen className="w-8 h-8 text-[#8c8273] mx-auto" />
                      <p className="text-sm font-bold text-[#1c1c1c] font-bodoni">
                        {drawerSearch ? 'Nenhum empréstimo encontrado para esta busca.' : isAdmin ? 'Nenhum empréstimo ativo na escola.' : 'Você não possui nenhum livro emprestado no momento.'}
                      </p>
                      <p className="text-xs text-[#5c5549]">
                        {isReader
                          ? 'Escolha qualquer livro com exemplares disponíveis no catálogo e clique em "Solicitar Empréstimo".'
                          : 'Quando os estudantes retirarem livros, os registros completos aparecerão aqui.'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeLoans.map((loan) => {
                        const theme = THEMES.find((t) => t.id === loan.theme);
                        return (
                          <div
                            key={loan.id}
                            className="p-4 rounded-2xl bg-[#ffffff] border border-[#1c1c1c]/15 hover:border-[#1c1c1c]/30 transition-all space-y-3 shadow-xs"
                          >
                            {/* Book Top Row */}
                            <div className="flex gap-3 items-start">
                              <img
                                src={loan.bookCover}
                                alt={loan.bookTitle}
                                referrerPolicy="no-referrer"
                                className="w-14 h-20 object-cover rounded-lg shadow-xs shrink-0 border border-[#1c1c1c]/15"
                              />
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                                  <span 
                                    className="text-[9px] font-black uppercase px-2 py-0.5 rounded text-slate-950 shadow-xs"
                                    style={{ backgroundColor: theme?.accentColor || '#f59e0b' }}
                                  >
                                    {theme?.name}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-[#5c5549] bg-[#ede8df] px-1.5 py-0.5 rounded">
                                    #{loan.id.slice(-6).toUpperCase()}
                                  </span>
                                </div>
                                <h4 className="text-sm font-bold text-[#1c1c1c] truncate font-bodoni leading-tight">
                                  {loan.bookTitle}
                                </h4>
                                <p className="text-xs text-[#5c5549] truncate">Autor(a): {loan.bookAuthor}</p>
                              </div>
                            </div>

                            {/* Detailed Student and Loan Info Grid */}
                            <div className="p-3 rounded-xl bg-[#ede8df] border border-[#1c1c1c]/10 text-xs space-y-2">
                              {isAdmin && (
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                  <div>
                                    <span className="text-[10px] text-[#7d7567] block uppercase font-bold">Aluno(a):</span>
                                    <span className="font-bold text-[#1c1c1c] flex items-center gap-1">
                                      <User className="w-3 h-3 text-[#8b261d]" />
                                      {loan.studentName}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] text-[#7d7567] block uppercase font-bold">Turma & Matrícula:</span>
                                    <span className="font-bold text-[#1c1c1c]">{loan.studentClass} • <code className="text-[#8b261d]">{loan.registrationNumber}</code></span>
                                  </div>
                                </div>
                              )}

                              <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[11px]">
                                <div className="flex items-center gap-1 text-[#5c5549]">
                                  <span>Retirado em: {loan.loanDate}</span>
                                </div>
                                <div className="flex items-center gap-1 text-[#8b261d] font-bold">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>Devolver até: <strong>{loan.dueDate}</strong></span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                onClick={() => handleReturnWithFeedback(loan.id, loan.bookId, loan.bookTitle)}
                                className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-[#ede8df] hover:bg-[#8b261d] hover:text-[#ffffff] border border-[#1c1c1c]/20 text-[#1c1c1c] font-bold transition-all cursor-pointer active:scale-95 shadow-2xs"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>{isAdmin ? 'Dar Baixa (Devolver ao Acervo)' : 'Devolver Exemplar'}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* History of returned */}
                  {returnedLoans.length > 0 && (
                    <div className="pt-4 mt-6 border-t border-[#1c1c1c]/15 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c5549]">
                        {isAdmin ? `Histórico Geral de Devolvidos (${returnedLoans.length})` : `Meus Livros Devolvidos (${returnedLoans.length})`}
                      </h4>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                        {returnedLoans.map((r) => (
                          <div key={r.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#ede8df] text-xs text-[#5c5549] border border-[#1c1c1c]/10">
                            <div className="truncate max-w-[240px]">
                              <span className="font-bold text-[#1c1c1c] block truncate">{r.bookTitle}</span>
                              {isAdmin && (
                                <span className="text-[10px] text-[#7d7567]">Por: {r.studentName} ({r.studentClass})</span>
                              )}
                            </div>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold flex items-center gap-1 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" /> Devolvido
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}

          </div>

          {/* Footer Info */}
          <div className="pt-4 mt-4 border-t border-[#1c1c1c]/15 text-center">
            <p className="text-[11px] text-[#7d7567] flex items-center justify-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-[#8b261d]" />
              <span>Livrotec • Ceti Gov. Alberto Tavares Silva</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
