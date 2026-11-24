import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Bookmark, Calendar, User, Award, School, Sparkles, Printer, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book, StudentLoan, UserSession } from '../types';
import { THEMES, SCHOOL_CLASSES } from '../data/libraryData';

interface LoanModalProps {
  book: Book | null;
  onClose: () => void;
  onConfirmLoan: (loan: Omit<StudentLoan, 'id'>) => void;
  currentUser?: UserSession | null;
  onOpenLoans?: () => void;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  book,
  onClose,
  onConfirmLoan,
  currentUser,
  onOpenLoans,
}) => {
  const [studentName, setStudentName] = useState(currentUser?.name || '');
  const [studentClass, setStudentClass] = useState(currentUser?.studentClass || SCHOOL_CLASSES[0]);
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [completedTicketId, setCompletedTicketId] = useState('');
  const [savedLoanDetails, setSavedLoanDetails] = useState<{
    studentName: string;
    studentClass: string;
    registrationNumber: string;
    loanDate: string;
    dueDate: string;
    ticketId: string;
  } | null>(null);

  // Reset modal state when opened or book changes
  useEffect(() => {
    if (book) {
      setIsSuccess(false);
      setCompletedTicketId('');
      setSavedLoanDetails(null);
      setStudentName(currentUser?.name || '');
      setStudentClass(currentUser?.studentClass || SCHOOL_CLASSES[0]);
      setRegistrationNumber('');
    }
  }, [book, currentUser]);

  if (!book) return null;

  const handleModalClose = () => {
    setIsSuccess(false);
    setCompletedTicketId('');
    setSavedLoanDetails(null);
    onClose();
  };

  const themeConfig = THEMES.find((t) => t.id === book.theme);

  // Calculate default dates
  const today = new Date();
  const loanDateStr = today.toLocaleDateString('pt-BR');
  
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);
  const dueDateStr = dueDate.toLocaleDateString('pt-BR');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const ticketId = `BIB-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalMatricula = registrationNumber.trim() || `MAT-${Math.floor(1000 + Math.random() * 9000)}`;
    
    setCompletedTicketId(ticketId);
    setSavedLoanDetails({
      studentName: studentName.trim(),
      studentClass,
      registrationNumber: finalMatricula,
      loanDate: loanDateStr,
      dueDate: dueDateStr,
      ticketId,
    });

    onConfirmLoan({
      bookId: book.id,
      bookTitle: book.title,
      bookAuthor: book.author,
      bookCover: book.coverImage,
      theme: book.theme,
      studentName: studentName.trim(),
      studentClass,
      registrationNumber: finalMatricula,
      loanDate: loanDateStr,
      dueDate: dueDateStr,
      status: 'active',
    });

    setIsSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1c1c1c]/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#fcfbfa] border border-[#1c1c1c]/25 rounded-3xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border border-[#1c1c1c]/20 transition-colors shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!isSuccess ? (
          /* Form Mode */
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2 text-[#8b261d]">
              <School className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Livrotec • Empréstimo Escolar
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-[#1c1c1c] font-delicate">
              Ficha de Retirada do Livro
            </h2>

            {/* Selected Book Mini Card */}
            <div className="flex items-center gap-3.5 p-3.5 my-4 rounded-2xl bg-[#ede8df] border border-[#1c1c1c]/15">
              <img
                src={book.coverImage}
                alt={book.title}
                referrerPolicy="no-referrer"
                className="w-12 h-16 object-cover rounded-lg shadow-xs shrink-0 border border-[#1c1c1c]/15"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[9px] font-medium uppercase px-2 py-0.5 rounded text-slate-950 shadow-xs"
                    style={{ backgroundColor: themeConfig?.accentColor || '#f59e0b' }}
                  >
                    {themeConfig?.name}
                  </span>
                  <span className="text-[11px] text-[#5c5549]">{book.location}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#1c1c1c] truncate font-delicate mt-0.5">
                  {book.title}
                </h3>
                <p className="text-xs text-[#5c5549] truncate">Autor(a): {book.author}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1c1c1c] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                  <User className="w-3.5 h-3.5 text-[#8b261d]" />
                  Nome Completo do Aluno(a) *
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ex: Beatriz Silva Santos"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] placeholder-[#8c8273] focus:outline-none focus:border-[#1c1c1c] focus:ring-2 focus:ring-[#1c1c1c]/10"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#1c1c1c] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <School className="w-3.5 h-3.5 text-[#8b261d]" />
                    Turma (Ensino Médio):
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] focus:outline-none focus:border-[#1c1c1c]"
                  >
                    {SCHOOL_CLASSES.map((turma) => (
                      <option key={turma} value={turma}>
                        {turma}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1c1c1c] mb-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5 text-[#8b261d]" />
                    Nº de Matrícula (Opcional):
                  </label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="Ex: 2026849"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#ffffff] border border-[#1c1c1c]/20 text-sm text-[#1c1c1c] placeholder-[#8c8273] focus:outline-none focus:border-[#1c1c1c]"
                  />
                </div>
              </div>

              {/* Loan Terms */}
              <div className="p-3.5 rounded-xl bg-[#ede8df] border border-[#1c1c1c]/15 text-xs text-[#1c1c1c] space-y-1">
                <div className="flex items-center justify-between font-bold text-[#1c1c1c]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#8b261d]" /> Prazo de Devolução:
                  </span>
                  <span className="bg-[#1c1c1c] text-[#f7f5f0] px-2 py-0.5 rounded text-[11px] font-mono">{dueDateStr} (14 dias)</span>
                </div>
                <p className="text-[11px] text-[#5c5549] pt-1">
                  *O estudante se compromete a preservar o exemplar e devolvê-lo na biblioteca escolar no prazo estipulado.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2.5 rounded-xl bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] text-xs font-bold border border-[#1c1c1c]/15 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] text-xs font-bold shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Bookmark className="w-4 h-4 text-amber-300" />
                  <span>Confirmar Retirada</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Digital School Ticket Voucher */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-800 shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-emerald-700">
                Empréstimo Registrado com Sucesso!
              </span>
              <h2 className="text-2xl font-black text-[#1c1c1c] font-bodoni mt-1">
                Comprovante Escolar Digital
              </h2>
              <p className="text-xs text-[#5c5549] mt-1">
                Apresente este comprovante ao bibliotecário(a) para retirar seu livro. O empréstimo já foi contabilizado em "Meus Empréstimos".
              </p>
            </div>

            {/* Voucher Card in Vintage Library Checkout Ticket Style */}
            <div className="p-5 rounded-2xl bg-[#ede8df] border-2 border-dashed border-[#1c1c1c]/30 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-[#1c1c1c]/15 pb-2">
                <div className="flex items-center gap-1.5">
                  <School className="w-4 h-4 text-[#8b261d]" />
                  <span className="text-xs font-black text-[#1c1c1c] font-bodoni tracking-wider">Livrotec • Comprovante de Retirada</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#1c1c1c] bg-[#ffffff] px-2.5 py-0.5 rounded border border-[#1c1c1c]/15">
                  Ticket: {savedLoanDetails?.ticketId || completedTicketId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="p-2 rounded-lg bg-[#ffffff]/60 border border-[#1c1c1c]/10 flex items-center gap-2">
                  {currentUser?.avatarUrl && (
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400 shadow-2xs shrink-0">
                      <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <span className="text-[10px] text-[#7d7567] block uppercase font-bold">Aluno(a):</span>
                    <span className="font-bold text-[#1c1c1c] text-sm">{savedLoanDetails?.studentName || studentName}</span>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-[#ffffff]/60 border border-[#1c1c1c]/10">
                  <span className="text-[10px] text-[#7d7567] block uppercase font-bold">Turma / Matrícula:</span>
                  <span className="font-bold text-[#1c1c1c]">{savedLoanDetails?.studentClass || studentClass} • <code className="font-mono text-xs text-[#8b261d]">{savedLoanDetails?.registrationNumber || registrationNumber}</code></span>
                </div>
                <div className="p-2 rounded-lg bg-[#ffffff]/60 border border-[#1c1c1c]/10">
                  <span className="text-[10px] text-[#7d7567] block uppercase font-bold">Livro Emprestado:</span>
                  <span className="font-bold text-[#1c1c1c] truncate block">{book.title}</span>
                  <span className="text-[11px] text-[#5c5549]">de {book.author}</span>
                </div>
                <div className="p-2 rounded-lg bg-[#8b261d]/10 border border-[#8b261d]/20">
                  <span className="text-[10px] text-[#8b261d] block uppercase font-bold">Prazo de Devolução:</span>
                  <span className="font-bold text-[#8b261d] text-sm flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {savedLoanDetails?.dueDate || dueDateStr}
                  </span>
                  <span className="text-[10px] text-[#5c5549]">Retirado em: {savedLoanDetails?.loanDate || loanDateStr}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1c1c1c]/15 flex items-center justify-between text-[11px] text-[#5c5549]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8b261d]" /> Local: <strong>{book.location}</strong>
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Tema: <strong>{themeConfig?.name}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] text-xs font-bold cursor-pointer border border-[#1c1c1c]/20 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-[#5c5549]" />
                <span>Imprimir Ficha</span>
              </button>

              {onOpenLoans && (
                <button
                  onClick={() => {
                    handleModalClose();
                    onOpenLoans();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#ede8df] hover:bg-[#e4ddcf] text-[#8b261d] text-xs font-bold cursor-pointer border border-[#8b261d]/30 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#8b261d]" />
                  <span>Ver Meus Empréstimos</span>
                </button>
              )}

              <button
                onClick={handleModalClose}
                className="px-6 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0] text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-95"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
