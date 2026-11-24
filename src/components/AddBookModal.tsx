import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  BookPlus,
  Sparkles,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Quote,
  Star,
  Building,
  ShieldCheck,
  Tag,
  Clipboard,
  Link2,
  Check,
  Search,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Book, ThemeId } from '../types';
import { THEMES } from '../data/libraryData';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: Book) => void;
  isDarkMode: boolean;
}

const COVER_PRESETS: { label: string; theme: ThemeId; url: string }[] = [
  {
    label: 'Romances',
    theme: 'romances',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Novelas',
    theme: 'novelas',
    url: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Poesia',
    theme: 'poesia',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Contos',
    theme: 'contos',
    url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Crônicas',
    theme: 'cronicas',
    url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Teatro',
    theme: 'teatro',
    url: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Literatura Brasileira',
    theme: 'literatura-brasileira',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Literatura Estrangeira',
    theme: 'literatura-estrangeira',
    url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Antologias',
    theme: 'antologias',
    url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Ficção',
    theme: 'ficcao',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'História',
    theme: 'historia',
    url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Biografia',
    theme: 'biografia',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'História do Piauí',
    theme: 'historia-do-piaui',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800&auto=format&fit=crop'
  },
  {
    label: 'Dicionários',
    theme: 'dicionarios',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800&auto=format&fit=crop'
  }
];

export const AddBookModal: React.FC<AddBookModalProps> = ({
  isOpen,
  onClose,
  onAddBook,
  isDarkMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [theme, setTheme] = useState<ThemeId>('romances');
  const [coverImage, setCoverImage] = useState('');
  const [isSearchingCover, setIsSearchingCover] = useState(false);
  const [pages, setPages] = useState<number | ''>(280);
  const [year, setYear] = useState<number | ''>(2026);
  const [totalCopies, setTotalCopies] = useState<number | ''>(3);
  const [location, setLocation] = useState('Estante A - Prateleira 1');
  const [readingAge, setReadingAge] = useState('14+');
  const [rating, setRating] = useState<number>(4.8);
  const [publisher, setPublisher] = useState('');
  const [tagsInput, setTagsInput] = useState('Literatura, Leitura Escolar');
  const [sampleQuote, setSampleQuote] = useState('');
  const [previewExcerpt, setPreviewExcerpt] = useState('');
  const [synopsis, setSynopsis] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Global paste handler for images or image URLs
  useEffect(() => {
    if (!isOpen) return;

    const handleWindowPaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            const blob = items[i].getAsFile();
            if (blob) {
              const reader = new FileReader();
              reader.onload = (loadEvt) => {
                const result = loadEvt.target?.result as string;
                if (result) {
                  setCoverImage(result);
                  setErrorMessage('');
                  setCopiedNotification(true);
                  setTimeout(() => setCopiedNotification(false), 2500);
                }
              };
              reader.readAsDataURL(blob);
              return;
            }
          }
        }
      }

      // Check if text pasted is an image URL
      const text = e.clipboardData?.getData('text');
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image'))) {
        const isLikelyImage = text.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) || text.startsWith('data:image') || text.includes('unsplash.com') || text.includes('images.');
        if (isLikelyImage && !coverImage) {
          setCoverImage(text.trim());
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2500);
        }
      }
    };

    window.addEventListener('paste', handleWindowPaste);
    return () => {
      window.removeEventListener('paste', handleWindowPaste);
    };
  }, [isOpen, coverImage]);

  const handlePasteClipboardClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setCoverImage(text.trim());
          setErrorMessage('');
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2500);
        } else {
          setErrorMessage('Nenhum link ou texto encontrado na área de transferência.');
        }
      } else {
        setErrorMessage('Use o atalho Ctrl+V para colar a imagem diretamente.');
      }
    } catch {
      setErrorMessage('Pressione Ctrl+V no teclado para colar a imagem ou o link da capa.');
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        setCoverImage(result);
        setErrorMessage('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAutoSearchCover = async () => {
    if (!title.trim()) {
      setErrorMessage('Digite ao menos o título do livro para buscar a capa automaticamente.');
      return;
    }
    setIsSearchingCover(true);
    setErrorMessage('');
    try {
      const q = encodeURIComponent(`${title.trim()} ${author.trim()}`.trim());
      const response = await fetch(`https://openlibrary.org/search.json?q=${q}&limit=5`);
      if (response.ok) {
        const data = await response.json();
        let foundCover = '';
        if (data.docs && data.docs.length > 0) {
          for (const doc of data.docs) {
            if (doc.cover_i && doc.cover_i > 0) {
              foundCover = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
              break;
            }
          }
        }
        if (foundCover) {
          setCoverImage(foundCover);
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 3000);
        } else {
          setErrorMessage('Capa específica não encontrada no catálogo global. Você pode colar o link, usar imagem padrão ou enviar arquivo.');
        }
      } else {
        setErrorMessage('Não foi possível consultar o catálogo no momento. Cole a URL da capa.');
      }
    } catch {
      setErrorMessage('Falha na busca automática. Cole a URL da capa manualmente ou envie o arquivo.');
    } finally {
      setIsSearchingCover(false);
    }
  };

  const handleSelectPreset = (url: string, suggestedTheme?: ThemeId) => {
    setCoverImage(url);
    if (suggestedTheme && suggestedTheme !== 'todos') {
      setTheme(suggestedTheme);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!title.trim()) {
      setErrorMessage('Por favor, insira o título do livro.');
      return;
    }
    if (!author.trim()) {
      setErrorMessage('Por favor, insira o nome do autor/autora.');
      return;
    }
    if (!synopsis.trim()) {
      setErrorMessage('Por favor, insira uma sinopse para o livro.');
      return;
    }

    const finalCover = coverImage.trim() || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop';
    const finalPages = Number(pages) || 250;
    const finalYear = Number(year) || new Date().getFullYear();
    const finalTotalCopies = Math.max(1, Number(totalCopies) || 1);
    const finalTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const newBook: Book = {
      id: `book-custom-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      theme: theme === 'todos' ? 'acao' : theme,
      coverImage: finalCover,
      pages: finalPages,
      year: finalYear,
      synopsis: synopsis.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 4.5)),
      availableCopies: finalTotalCopies,
      totalCopies: finalTotalCopies,
      location: location.trim() || 'Estante Central',
      tags: finalTags.length > 0 ? finalTags : ['Livrotec', 'Ensino Médio'],
      readingAge: readingAge.trim() || 'Livre',
      sampleQuote: sampleQuote.trim() || `"${title.trim()}" é uma obra indispensável do acervo da Livrotec.`,
      previewExcerpt: previewExcerpt.trim() || synopsis.trim(),
      publisher: publisher.trim() || 'Edição Escolar'
    };

    onAddBook(newBook);
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

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1c1c1c]/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden my-6 border transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-[#faf8f5] border-[#1c1c1c]/25 text-[#1c1c1c]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-400 text-slate-950 shadow-sm">
              <BookPlus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold font-delicate tracking-tight">
                  Adicionar Novo Livro
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                  Painel ADM
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                Cadastre novos títulos diretamente no acervo escolar da Livrotec
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }`}
            title="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold font-delicate text-emerald-600 dark:text-emerald-400">
              Livro Adicionado com Sucesso!
            </h3>
            <p className="text-sm opacity-80 max-w-md mx-auto">
              "{title}" já está disponível para visualização e empréstimo para os estudantes do Ensino Médio.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto custom-scrollbar space-y-6">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-current/10">
                <FileText className="w-4 h-4 text-[#8b261d] dark:text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  1. Informações Básicas da Obra
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Título do Livro: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Admirável Mundo Novo"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Autor / Autora: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Ex: Aldous Huxley"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Tema / Gênero:
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as ThemeId)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all font-medium ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  >
                    {THEMES.filter((t) => t.id !== 'todos').map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Ano de Lançamento:
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(e.target.value === '' ? '' : Number(e.target.value))}
                    min={1800}
                    max={2030}
                    placeholder="2026"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Número de Páginas:
                  </label>
                  <input
                    type="number"
                    value={pages}
                    onChange={(e) => setPages(e.target.value === '' ? '' : Number(e.target.value))}
                    min={1}
                    max={3000}
                    placeholder="320"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Cover Image & Preview */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-current/10">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#8b261d] dark:text-amber-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider">
                    2. Imagem da Capa (Colar URL ou Arquivo)
                  </h3>
                </div>
                {copiedNotification && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 animate-in fade-in slide-in-from-right-2">
                    <Check className="w-3.5 h-3.5" /> Capa colada com sucesso!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 flex items-center justify-between">
                      <span>URL ou Cole a Imagem da Capa:</span>
                      <span className="text-[10px] opacity-70 font-normal">Aceita Ctrl+V de qualquer imagem</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="Cole o link da imagem (ex: https://... ou dê Ctrl+V)"
                        className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                            : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                        }`}
                      />
                      <Link2 className="w-4 h-4 absolute left-3 top-3 opacity-50" />
                      {coverImage && (
                        <button
                          type="button"
                          onClick={() => setCoverImage('')}
                          className="absolute right-2.5 top-2.5 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 opacity-60 hover:opacity-100 cursor-pointer"
                          title="Limpar imagem"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Actions: Auto Search, Paste from Clipboard & Upload from file */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleAutoSearchCover}
                      disabled={isSearchingCover}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-all shadow-2xs hover:scale-[1.02] active:scale-95 ${
                        isDarkMode
                          ? 'bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 border-emerald-500/50'
                          : 'bg-emerald-100 hover:bg-emerald-200 text-[#0f4d36] border-emerald-300 font-bold'
                      }`}
                      title="Buscar capa real na base global de livros"
                    >
                      {isSearchingCover ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>{isSearchingCover ? 'Buscando Capa...' : 'Buscar Capa Automática'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handlePasteClipboardClick}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-all shadow-2xs hover:scale-[1.02] active:scale-95 ${
                        isDarkMode
                          ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border-amber-400/40'
                          : 'bg-amber-100 hover:bg-amber-200 text-[#8b261d] border-amber-300'
                      }`}
                      title="Colar imagem ou link copiado da área de transferência"
                    >
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Colar (Ctrl+V)</span>
                    </button>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border cursor-pointer transition-all ${
                        isDarkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                          : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/20'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload do Arquivo</span>
                    </button>
                  </div>

                  {/* Quick Presets */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                      Sugestões de Capas de Alta Qualidade:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {COVER_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectPreset(preset.url, preset.theme)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition-all ${
                            coverImage === preset.url
                              ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                              : isDarkMode
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                              : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#5c5549] border-[#1c1c1c]/15'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Preview Box */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl border text-center border-dashed border-current/20">
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-2 opacity-75">
                    Pré-visualização
                  </span>
                  <div className="w-24 h-36 rounded-lg overflow-hidden shadow-md bg-black/10 flex items-center justify-center border border-current/20 relative group">
                    {coverImage ? (
                      <img
                        src={coverImage}
                        alt="Preview Capa"
                        className="w-full h-full object-cover"
                        onError={() => setErrorMessage('A URL da imagem parece inválida ou não pôde ser carregada.')}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-center p-2">
                        <BookOpen className="w-7 h-7 opacity-40" />
                        <span className="text-[9px] opacity-50">Cole ou escolha uma capa</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Physical Library & Copies Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-current/10">
                <Layers className="w-4 h-4 text-[#8b261d] dark:text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  3. Acervo Físico, Localização & Classificação
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Total de Exemplares:
                  </label>
                  <input
                    type="number"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(e.target.value === '' ? '' : Number(e.target.value))}
                    min={1}
                    max={50}
                    placeholder="3"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Localização na Estante:
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Estante A1 / Prateleira 3"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Classificação Indicativa:
                  </label>
                  <select
                    value={readingAge}
                    onChange={(e) => setReadingAge(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all font-medium ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  >
                    <option value="Livre">Livre para Todos</option>
                    <option value="10+">10+ Anos</option>
                    <option value="12+">12+ Anos</option>
                    <option value="14+">14+ Anos</option>
                    <option value="16+">16+ Anos</option>
                    <option value="18+">18+ Anos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Nota / Avaliação (1 a 5):
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#8b261d] dark:text-amber-400" />
                    Editora:
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Ex: Companhia das Letras, Rocco, Intrínseca"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#8b261d] dark:text-amber-400" />
                    Tags / Palavras-chave (separadas por vírgula):
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Ex: Ficção, Mistério, Ensino Médio, Destaque"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                        : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Texts, Sinopse, Quote and Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-current/10">
                <Quote className="w-4 h-4 text-[#8b261d] dark:text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  4. Sinopse, Frase Marcante & Trecho de Leitura
                </h3>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Sinopse Completa: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Escreva a sinopse do livro que aparecerá na ficha e detalhes..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Frase Marcante da Obra (Citação):
                </label>
                <input
                  type="text"
                  value={sampleQuote}
                  onChange={(e) => setSampleQuote(e.target.value)}
                  placeholder="Ex: 'Até que você torne o inconsciente consciente, ele direcionará sua vida e você o chamará de destino.'"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5">
                  Trecho para Leitura Inicial (Amostra / Degustação):
                </label>
                <textarea
                  rows={2}
                  value={previewExcerpt}
                  onChange={(e) => setPreviewExcerpt(e.target.value)}
                  placeholder="Trecho das primeiras páginas para o estudante ler na aba 'Ler Amostra'..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-400'
                      : 'bg-white border-[#1c1c1c]/20 text-[#1c1c1c] focus:border-[#1c1c1c]'
                  }`}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-current/10 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                    : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#5c5549] border-[#1c1c1c]/20'
                }`}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.02] active:scale-95 ${
                  isDarkMode
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                    : 'bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0]'
                }`}
              >
                <BookPlus className="w-4 h-4" />
                <span>Salvar e Adicionar ao Acervo</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
