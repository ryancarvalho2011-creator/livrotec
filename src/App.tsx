import React, { useState, useEffect, useMemo } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  ThemeSelector 
} from './components/ThemeSelector';
import { 
  ThemeBanner 
} from './components/ThemeBanner';
import { 
  BookCard 
} from './components/BookCard';
import { 
  BookDetailModal 
} from './components/BookDetailModal';
import { 
  LoanModal 
} from './components/LoanModal';
import { 
  MyLoansDrawer 
} from './components/MyLoansDrawer';
import { 
  SurpriseBookModal 
} from './components/SurpriseBookModal';
import { 
  AboutUsPage 
} from './components/AboutUsPage';
import { 
  LoginModal 
} from './components/LoginModal';
import { 
  AddBookModal 
} from './components/AddBookModal';
import { 
  ProfilePhotoModal 
} from './components/ProfilePhotoModal';
import { 
  PopularBooksSection 
} from './components/PopularBooksSection';
import { 
  ReaderQuizSection 
} from './components/ReaderQuizSection';
import { 
  THEMES, 
  INITIAL_BOOKS,
  randomizeBookCopies 
} from './data/libraryData';
import { 
  INITIAL_REVIEWS 
} from './data/reviewsData';
import { 
  Book, 
  ThemeId, 
  StudentLoan,
  UserSession,
  BookReview
} from './types';
import { 
  SlidersHorizontal, 
  Heart, 
  Check, 
  BookX,
  Users,
  Flame,
  BookPlus,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

export default function App() {
  // Local storage keys
  const STORAGE_BOOKS_KEY = 'livrotec_books_v16_covers';
  const STORAGE_LOANS_KEY = 'livrotec_student_loans_v16';
  const STORAGE_FAVORITES_KEY = 'livrotec_favorites_v16';
  const STORAGE_USER_KEY = 'livrotec_user_session_v1';
  const STORAGE_DARK_MODE_KEY = 'livrotec_dark_mode_v1';
  const STORAGE_REVIEWS_KEY = 'livrotec_reviews_v16';
  const STORAGE_USER_AVATARS_KEY = 'livrotec_user_avatars_v1';

  // Helper to get persistent account key for profile photos
  const getUserAvatarAccountKey = (user: UserSession | null) => {
    if (!user) return null;
    if (user.role === 'admin') {
      return `admin_${user.username || 'kaua.vandaiki'}`;
    }
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.studentClass || 'aluno').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `reader_${cleanName}_${cleanClass}`;
  };

  // 1. Dark Mode State (persisted)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_DARK_MODE_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_DARK_MODE_KEY, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // 2. User & Auth State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    if (saved) {
      try {
        const parsed: UserSession = JSON.parse(saved);
        // Sync with persistent avatars registry
        const registryRaw = localStorage.getItem(STORAGE_USER_AVATARS_KEY);
        if (registryRaw) {
          try {
            const avatarsMap: Record<string, string> = JSON.parse(registryRaw);
            const accountKey = parsed.role === 'admin' 
              ? `admin_${parsed.username || 'kaua.vandaiki'}`
              : `reader_${parsed.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}_${(parsed.studentClass || 'aluno').toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
            if (avatarsMap[accountKey]) {
              parsed.avatarUrl = avatarsMap[accountKey];
            }
          } catch {
            // ignore
          }
        }
        return parsed;
      } catch (e) {
        console.error('Error loading user session', e);
      }
    }
    return null;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(() => {
    return !localStorage.getItem(STORAGE_USER_KEY);
  });

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [currentView, setCurrentView] = useState<'catalog' | 'about'>('catalog');

  // 3. Books State - strictly restricted to official catalog
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem(STORAGE_BOOKS_KEY);
    if (saved) {
      try {
        const parsed: Book[] = JSON.parse(saved);
        // Only keep books that belong to the new official list
        const validBooks = parsed
          .filter((savedBook) => INITIAL_BOOKS.some((b) => b.id === savedBook.id))
          .map((savedBook) => {
            const fresh = INITIAL_BOOKS.find((b) => b.id === savedBook.id);
            return fresh
              ? {
                  ...savedBook,
                  title: fresh.title,
                  author: fresh.author,
                  theme: fresh.theme,
                  tags: fresh.tags,
                  synopsis: fresh.synopsis,
                  sampleQuote: fresh.sampleQuote,
                  previewExcerpt: fresh.previewExcerpt,
                  location: fresh.location,
                  coverImage: fresh.coverImage,
                  year: fresh.year,
                  pages: fresh.pages,
                  publisher: fresh.publisher,
                  rating: fresh.rating,
                  readingAge: fresh.readingAge
                }
              : savedBook;
          });

        const missingInitial = INITIAL_BOOKS.filter((b) => !validBooks.some((vb) => vb.id === b.id));
        if (validBooks.length > 0) {
          return [...validBooks, ...missingInitial];
        }
      } catch (e) {
        console.error('Error loading saved books', e);
      }
    }
    return randomizeBookCopies(INITIAL_BOOKS);
  });

  // 4. Loans State
  const [loans, setLoans] = useState<StudentLoan[]>(() => {
    const saved = localStorage.getItem(STORAGE_LOANS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading loans', e);
      }
    }
    return [];
  });

  // User-scoped favorites storage key to prevent cross-account data leakage
  const getUserFavoritesKey = (user: UserSession | null) => {
    if (!user) return 'livrotec_guest_favorites_session';
    const identifier = user.username || user.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    return `livrotec_favorites_user_${identifier}`;
  };

  // 5. Favorites State (strictly scoped per user account to prevent cross-account leakage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const savedUser = localStorage.getItem(STORAGE_USER_KEY);
    if (savedUser) {
      try {
        const parsedUser: UserSession = JSON.parse(savedUser);
        const userFavKey = `livrotec_favorites_user_${parsedUser.username || parsedUser.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const savedFavs = localStorage.getItem(userFavKey);
        if (savedFavs) {
          return JSON.parse(savedFavs);
        }
        const legacy = localStorage.getItem(STORAGE_FAVORITES_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localStorage.setItem(userFavKey, JSON.stringify(parsed));
            return parsed;
          }
        }
      } catch (e) {
        console.error('Error loading initial favorites', e);
      }
    }
    return [];
  });

  // Session keys for complete quiz & state reset
  const [quizSessionKey, setQuizSessionKey] = useState<number>(0);
  const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

  // 6. Reviews State
  const [reviews, setReviews] = useState<BookReview[]>(() => {
    const saved = localStorage.getItem(STORAGE_REVIEWS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading reviews', e);
      }
    }
    return INITIAL_REVIEWS;
  });

  // Filters & Navigation
  const [activeTheme, setActiveTheme] = useState<ThemeId>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'title' | 'pages' | 'year'>('rating');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Modals & Drawers
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<Book | null>(null);
  const [selectedBookForLoan, setSelectedBookForLoan] = useState<Book | null>(null);
  const [isLoansDrawerOpen, setIsLoansDrawerOpen] = useState(false);
  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [loginInitialTab, setLoginInitialTab] = useState<'reader' | 'admin'>('reader');

  // Persist books and loans to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_BOOKS_KEY, JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(STORAGE_LOANS_KEY, JSON.stringify(loans));
  }, [loans]);

  // Persist favorites specifically to the active account key
  useEffect(() => {
    if (currentUser) {
      const userFavKey = getUserFavoritesKey(currentUser);
      localStorage.setItem(userFavKey, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [currentUser]);

  // Auth Handlers
  const handleOpenLogin = (tab?: 'reader' | 'admin' | unknown) => {
    const validTab: 'reader' | 'admin' = tab === 'admin' ? 'admin' : 'reader';
    setLoginInitialTab(validTab);
    setIsLoginModalOpen(true);
  };

  const handleLogin = (session: UserSession) => {
    // 0. Restore user-specific profile avatar if already saved in registry
    const accountKey = getUserAvatarAccountKey(session);
    if (accountKey) {
      try {
        const savedRegistry = localStorage.getItem(STORAGE_USER_AVATARS_KEY);
        if (savedRegistry) {
          const avatarsMap: Record<string, string> = JSON.parse(savedRegistry);
          if (avatarsMap[accountKey]) {
            session.avatarUrl = avatarsMap[accountKey];
          }
        }
      } catch (e) {
        console.warn('Error reading avatar registry', e);
      }
    }

    setCurrentUser(session);
    setIsLoginModalOpen(false);

    // 1. Load user-specific favorites
    const userFavKey = getUserFavoritesKey(session);
    try {
      const savedUserFavs = localStorage.getItem(userFavKey);
      if (savedUserFavs) {
        setFavorites(JSON.parse(savedUserFavs));
      } else {
        const legacy = localStorage.getItem(STORAGE_FAVORITES_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFavorites(parsed);
            localStorage.setItem(userFavKey, JSON.stringify(parsed));
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      }
    } catch {
      setFavorites([]);
    }

    // 2. Reset navigation & temporary filters
    setActiveTheme('todos');
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedYear(null);
    setSortBy('rating');
    setOnlyAvailable(false);
    setShowOnlyFavorites(false);

    // 3. Reset quiz to fresh state for this user
    setQuizSessionKey((prev) => prev + 1);

    // 4. Return to main catalog and scroll to top
    setCurrentView('catalog');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  const handleUpdateAvatar = (newAvatarUrl: string | undefined) => {
    if (!currentUser) return;
    const accountKey = getUserAvatarAccountKey(currentUser);
    if (!accountKey) return;

    try {
      const savedRegistry = localStorage.getItem(STORAGE_USER_AVATARS_KEY);
      const avatarsMap: Record<string, string> = savedRegistry ? JSON.parse(savedRegistry) : {};

      if (newAvatarUrl) {
        avatarsMap[accountKey] = newAvatarUrl;
      } else {
        delete avatarsMap[accountKey];
      }

      localStorage.setItem(STORAGE_USER_AVATARS_KEY, JSON.stringify(avatarsMap));
    } catch (e) {
      console.error('Error saving user avatar to registry', e);
    }

    const updatedUser: UserSession = {
      ...currentUser,
      avatarUrl: newAvatarUrl
    };

    setCurrentUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.error('Error saving user session', e);
    }
  };

  const handleLogout = () => {
    // 1. Clear authentication session
    setCurrentUser(null);
    setIsProfileModalOpen(false);
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      sessionStorage.clear();

      // Clear any temporary quiz or session keys in localStorage
      const tempStorageKeys = [
        'livrotec_quiz_answers',
        'livrotec_quiz_result',
        'livrotec_quiz_progress',
        'livrotec_quiz_completed',
        'livrotec_temp_session',
        'livrotec_guest_favorites_session'
      ];
      tempStorageKeys.forEach((k) => {
        try {
          localStorage.removeItem(k);
        } catch {
          // ignore
        }
      });
    } catch (e) {
      console.warn('Error clearing storage on logout', e);
    }

    // 2. Redirect to main catalog view
    setCurrentView('catalog');

    // 3. Clear all temporary navigation states, search, and active filters
    setActiveTheme('todos');
    setSearchQuery('');
    setSelectedTag(null);
    setSelectedYear(null);
    setSortBy('rating');
    setOnlyAvailable(false);
    setShowOnlyFavorites(false);

    // 4. Clear temporary markings: unselect all favorites/hearts
    setFavorites([]);

    // 5. Close all modals, popups, and drawers
    setSelectedBookForDetails(null);
    setSelectedBookForLoan(null);
    setIsLoansDrawerOpen(false);
    setIsSurpriseModalOpen(false);
    setIsAddBookModalOpen(false);
    setIsLoginModalOpen(false);
    setLoginInitialTab('reader');

    // 6. Stop any active text-to-speech audio narration
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // 7. Reset all quizzes completely (clears answers, options, results, and progress)
    setQuizSessionKey((prev) => prev + 1);

    // 8. Scroll immediately to the top of the page
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }

    // 9. Display temporary feedback notice
    setLogoutNotice('Você saiu da conta. Sessão, filtros e quizzes foram reiniciados com sucesso.');
    setTimeout(() => {
      setLogoutNotice(null);
    }, 4000);
  };

  // Review Handlers
  const handleAddReview = (newReviewData: Omit<BookReview, 'id' | 'createdAt' | 'likes'>) => {
    const newRev: BookReview = {
      ...newReviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('pt-BR'),
      likes: 0
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const handleLikeReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  // Admin Catalog Management
  const handleAddBook = (newBook: Book) => {
    setBooks((prev) => [newBook, ...prev]);
    setActiveTheme('todos');
    setSelectedTag(null);
    setSearchQuery('');
    setCurrentView('catalog');
  };

  const handleDeleteBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    setFavorites((prev) => prev.filter((id) => id !== bookId));
    if (selectedBookForDetails?.id === bookId) {
      setSelectedBookForDetails(null);
    }
  };

  const handleUpdateBookCopies = (bookId: string, delta: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id === bookId) {
          const newTotal = Math.max(1, b.totalCopies + delta);
          const newAvailable = Math.max(0, Math.min(newTotal, b.availableCopies + delta));
          return {
            ...b,
            totalCopies: newTotal,
            availableCopies: newAvailable
          };
        }
        return b;
      })
    );
  };

  const handleRandomizeCopies = () => {
    setBooks((prev) => randomizeBookCopies(prev));
  };

  const handleResetDefaultCatalog = () => {
    setBooks(randomizeBookCopies(INITIAL_BOOKS));
  };

  const handleClearAllLoans = () => {
    setLoans([]);
    setBooks((prev) => prev.map((b) => ({ ...b, availableCopies: b.totalCopies })));
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
  };

  const handleRenewLoan = (loanId: string, daysToAdd: number = 7) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id === loanId) {
          const parts = loan.dueDate.split('/');
          let currentDue = new Date();
          if (parts.length === 3) {
            currentDue = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          }
          currentDue.setDate(currentDue.getDate() + daysToAdd);
          return {
            ...loan,
            dueDate: currentDue.toLocaleDateString('pt-BR')
          };
        }
        return loan;
      })
    );
  };

  const handleSimulateLoans = () => {
    if (books.length === 0) return;
    const mockStudents = [
      { name: 'Ana Clara Silveira', class: '1º Ano D.S', mat: 'MAT-2024-104' },
      { name: 'Mateus Henrique Ramos', class: '2º Ano D.S', mat: 'MAT-2024-219' },
      { name: 'Beatriz Lima Albuquerque', class: '3º Ano Marketing Digital', mat: 'MAT-2024-308' },
      { name: 'Lucas Gabriel Martins', class: '1º Ano Administração', mat: 'MAT-2024-115' }
    ];

    const today = new Date();
    const loanDateStr = today.toLocaleDateString('pt-BR');
    const due1 = new Date(); due1.setDate(today.getDate() + 14);
    const due2 = new Date(); due2.setDate(today.getDate() + 7);

    const newMockLoans: StudentLoan[] = [];
    const updatedBooks = [...books];

    mockStudents.forEach((student, idx) => {
      const bookIdx = updatedBooks.findIndex((b) => b.availableCopies > 0 && !newMockLoans.some((nl) => nl.bookId === b.id));
      if (bookIdx !== -1) {
        const targetBook = updatedBooks[bookIdx];
        updatedBooks[bookIdx] = {
          ...targetBook,
          availableCopies: targetBook.availableCopies - 1
        };

        newMockLoans.push({
          id: `loan-mock-${Date.now()}-${idx}`,
          bookId: targetBook.id,
          bookTitle: targetBook.title,
          bookAuthor: targetBook.author,
          bookCover: targetBook.coverImage,
          theme: targetBook.theme,
          studentName: student.name,
          studentClass: student.class,
          registrationNumber: student.mat,
          loanDate: loanDateStr,
          dueDate: idx % 2 === 0 ? due1.toLocaleDateString('pt-BR') : due2.toLocaleDateString('pt-BR'),
          status: 'active'
        });
      }
    });

    if (newMockLoans.length > 0) {
      setBooks(updatedBooks);
      setLoans((prev) => [...newMockLoans, ...prev]);
    }
  };

  // Start Loan Flow
  const handleStartLoan = (book: Book) => {
    if (!currentUser) {
      handleOpenLogin('reader');
      return;
    }
    setSelectedBookForLoan(book);
  };

  // Keep active book references reactive to stock changes
  const activeBookForDetails = useMemo(() => {
    if (!selectedBookForDetails) return null;
    return books.find((b) => b.id === selectedBookForDetails.id) || selectedBookForDetails;
  }, [books, selectedBookForDetails]);

  const activeBookForLoan = useMemo(() => {
    if (!selectedBookForLoan) return null;
    return books.find((b) => b.id === selectedBookForLoan.id) || selectedBookForLoan;
  }, [books, selectedBookForLoan]);

  // Current selected theme metadata
  const currentThemeConfig = useMemo(() => {
    return THEMES.find((t) => t.id === activeTheme);
  }, [activeTheme]);

  // Available tags in active theme
  const availableTags = useMemo(() => {
    let pool = books;
    if (activeTheme !== 'todos') {
      pool = books.filter((b) => b.theme === activeTheme);
    }
    const tagsSet = new Set<string>();
    pool.forEach((b) => b.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [books, activeTheme]);

  // Filtered & Sorted Books
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Theme filter
        if (activeTheme !== 'todos' && book.theme !== activeTheme) {
          return false;
        }
        // Year filter
        if (selectedYear !== null && book.year !== selectedYear) {
          return false;
        }
        // Tag filter
        if (selectedTag && !book.tags.includes(selectedTag)) {
          return false;
        }
        // Availability filter
        if (onlyAvailable && book.availableCopies <= 0) {
          return false;
        }
        // Favorites filter
        if (showOnlyFavorites && !favorites.includes(book.id)) {
          return false;
        }
        // Search query filter (matches title, author, category name, theme ID, synopsis and tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const themeName = THEMES.find((t) => t.id === book.theme)?.name.toLowerCase() || '';
          const matchTitle = book.title.toLowerCase().includes(q);
          const matchAuthor = book.author.toLowerCase().includes(q);
          const matchCategory = themeName.includes(q) || book.theme.toLowerCase().includes(q);
          const matchSynopsis = book.synopsis.toLowerCase().includes(q);
          const matchTags = book.tags.some((t) => t.toLowerCase().includes(q));
          const matchYear = String(book.year).includes(q);
          if (!matchTitle && !matchAuthor && !matchCategory && !matchSynopsis && !matchTags && !matchYear) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        if (sortBy === 'year') return b.year - a.year;
        if (sortBy === 'pages') return b.pages - a.pages;
        return 0;
      });
  }, [books, activeTheme, selectedYear, selectedTag, onlyAvailable, showOnlyFavorites, searchQuery, sortBy, favorites]);

  // Toggle favorite
  const handleToggleFavorite = (bookId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId];
      if (currentUser) {
        const userFavKey = getUserFavoritesKey(currentUser);
        try {
          localStorage.setItem(userFavKey, JSON.stringify(updated));
        } catch (e) {
          console.warn('Error saving user favorites', e);
        }
      } else {
        try {
          localStorage.setItem('livrotec_guest_favorites_session', JSON.stringify(updated));
        } catch (e) {
          console.warn('Error saving guest favorites', e);
        }
      }
      return updated;
    });
  };

  // Handle student loan confirmation
  const handleConfirmLoan = (newLoanData: Omit<StudentLoan, 'id'>) => {
    const newLoan: StudentLoan = {
      ...newLoanData,
      id: `loan-${Date.now()}`,
    };

    setLoans((prev) => [newLoan, ...prev]);

    // Decrement available copies of the borrowed book
    setBooks((prev) =>
      prev.map((b) =>
        b.id === newLoanData.bookId
          ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) }
          : b
      )
    );
  };

  // Handle return book
  const handleReturnBook = (loanId: string, bookId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'returned' as const } : l))
    );

    // Increment available copies back
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? { ...b, availableCopies: Math.min(b.totalCopies, b.availableCopies + 1) }
          : b
      )
    );
  };

  // Theme selection handler
  const handleSelectTheme = (themeId: ThemeId) => {
    setActiveTheme(themeId);
    setSelectedTag(null);
    setCurrentView('catalog');
  };

  const handleOpenAboutUs = () => {
    setCurrentView('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLoanCount = useMemo(() => {
    if (currentUser?.role === 'reader' && currentUser.name) {
      return loans.filter(
        (l) =>
          l.status === 'active' &&
          (l.studentName.toLowerCase().trim() === currentUser.name.toLowerCase().trim() ||
            (currentUser.username && l.studentName.toLowerCase().trim() === currentUser.username.toLowerCase().trim()))
      ).length;
    }
    return loans.filter((l) => l.status === 'active').length;
  }, [loans, currentUser]);

  return (
    <div className={`min-h-screen flex flex-col font-sans-delicate transition-colors duration-200 relative ${
      isDarkMode 
        ? 'bg-[#0a1120] text-[#f8fafc] selection:bg-amber-400 selection:text-slate-950' 
        : 'bg-[#faf8f5] text-[#1c1c1c] selection:bg-[#1c1c1c] selection:text-[#f7f5f0]'
    }`}>
      
      {/* Logout Reset Feedback Banner */}
      {logoutNotice && (
        <aside 
          aria-label="Aviso de logout"
          className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md bg-emerald-700 dark:bg-emerald-800 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
          <span className="text-xs font-semibold leading-tight flex-1">{logoutNotice}</span>
          <button 
            onClick={() => setLogoutNotice(null)} 
            className="p-1 hover:bg-emerald-600/60 rounded-lg transition-colors cursor-pointer text-emerald-100"
            title="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* 1. TOP HEADER with Library Name: Livrotec + Dark Mode Toggle */}
      <Header
        activeTheme={activeTheme}
        setActiveTheme={handleSelectTheme}
        loanCount={activeLoanCount}
        onOpenLoans={() => setIsLoansDrawerOpen(true)}
        onRandomBook={() => setIsSurpriseModalOpen(true)}
        totalBooksCount={books.length}
        currentUser={currentUser}
        onOpenLogin={handleOpenLogin}
        onLogout={handleLogout}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAddBook={currentUser?.role === 'admin' ? () => setIsAddBookModalOpen(true) : undefined}
        onOpenProfileModal={currentUser ? () => setIsProfileModalOpen(true) : undefined}
      />

      {/* ADMIN EXCLUSIVE MANAGEMENT BAR */}
      {currentUser?.role === 'admin' && (
        <div className={`border-b transition-colors shadow-sm ${
          isDarkMode 
            ? 'bg-gradient-to-r from-[#1c130c] via-slate-900 to-[#1c130c] border-amber-500/30 text-white' 
            : 'bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-amber-300 text-[#1c1c1c]'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#8b261d]" />
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-black uppercase tracking-wider text-[#8b261d] dark:text-amber-300">
                    Modo Administrador Ativo
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-[#8b261d] text-white">
                    {currentUser.name}
                  </span>
                </div>
                <p className="text-[11px] opacity-75">
                  Você tem acesso total para cadastrar e gerenciar o acervo da Livrotec.
                </p>
              </div>
            </div>

            {/* Quick Action Button for Admin */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center">
              <button
                id="btn-admin-bar-add-book"
                onClick={() => setIsAddBookModalOpen(true)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md hover:scale-[1.03] active:scale-95 cursor-pointer border ring-2 ${
                  isDarkMode
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 border-amber-300 ring-amber-400/30'
                    : 'bg-[#8b261d] hover:bg-[#721f18] text-amber-200 border-amber-400/60 ring-[#8b261d]/20'
                }`}
                title="Abrir formulário de cadastro de novo livro"
              >
                <BookPlus className="w-4 h-4" />
                <span className="whitespace-nowrap">Adicionar Livro ao Banco</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area: Catalog View or About Us Page */}
      {currentView === 'about' ? (
        <main className="flex-1">
          <AboutUsPage onBackToCatalog={handleBackToCatalog} isDarkMode={isDarkMode} />
        </main>
      ) : (
        <main className="flex-1 pb-16">
          
          {/* 2. THEME SELECTOR - Categorias por tema com fundo temático e Barra de Pesquisa */}
          <ThemeSelector
            activeTheme={activeTheme}
            onSelectTheme={handleSelectTheme}
            books={books}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isDarkMode={isDarkMode}
          />

          {/* 3. Thematic Wallpaper Hero Banner */}
          <ThemeBanner
            currentTheme={currentThemeConfig}
            activeTheme={activeTheme}
            onResetTheme={() => handleSelectTheme('todos')}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            availableTags={availableTags}
            totalThemeBooks={filteredBooks.length}
            isDarkMode={isDarkMode}
          />

          {/* 4. POPULAR BOOKS SECTION (Mais escolhidos pelos leitores) - Shown when viewing All Themes */}
          {activeTheme === 'todos' && !searchQuery && (
            <PopularBooksSection
              books={books}
              onOpenBookDetails={(b) => setSelectedBookForDetails(b)}
              onStartLoan={handleStartLoan}
              isDarkMode={isDarkMode}
            />
          )}

          {/* 5. Filter Toolbar & Results Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl border transition-colors shadow-2xs ${
              isDarkMode 
                ? 'bg-[#152238] border-slate-700/80 text-white' 
                : 'bg-[#ffffff] border-[#1c1c1c]/15 text-[#1c1c1c]'
            }`}>
              
              <div className="flex items-center gap-3">
                <span className={`text-base font-medium font-delicate ${
                  isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
                }`}>
                  Exibindo: <span className={isDarkMode ? 'text-amber-400 font-bold text-lg' : 'text-[#1c1c1c] font-bold text-lg'}>{filteredBooks.length}</span> {filteredBooks.length === 1 ? 'obra no acervo' : 'obras no acervo'}
                </span>

                {searchQuery && (
                  <span className={`text-xs px-2.5 py-1 rounded-lg border font-bold font-sans-delicate ${
                    isDarkMode 
                      ? 'bg-slate-800 text-amber-300 border-slate-700' 
                      : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20'
                  }`}>
                    Busca: "{searchQuery}"
                  </span>
                )}
              </div>

              {/* Controls: Sort & Quick Toggles */}
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto font-sans-delicate">
                
                {/* Only Available Toggle */}
                <button
                  onClick={() => setOnlyAvailable(!onlyAvailable)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    onlyAvailable
                      ? isDarkMode
                        ? 'bg-amber-400 border-amber-400 text-slate-950 shadow-xs font-black'
                        : 'bg-[#1c1c1c] border-[#1c1c1c] text-[#f7f5f0] shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-amber-400'
                      : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c] hover:border-[#1c1c1c]/50'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${onlyAvailable ? 'text-current' : 'opacity-40'}`} />
                  <span>Apenas Disponíveis</span>
                </button>

                {/* Favorites Toggle */}
                <button
                  onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    showOnlyFavorites
                      ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                      : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-200 hover:border-rose-400'
                      : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c] hover:border-[#1c1c1c]/50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-white text-white' : 'text-rose-500'}`} />
                  <span>Favoritos ({favorites.length})</span>
                </button>

                {/* Sort By Dropdown */}
                <div className={`flex items-center gap-1.5 border rounded-xl px-2.5 py-1.5 ${
                  isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c]'
                }`}>
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-xs font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="rating" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Mais Bem Avaliados</option>
                    <option value="title" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Ordem Alfabética (A-Z)</option>
                    <option value="year" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Ano de Lançamento</option>
                    <option value="pages" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>Nº de Páginas</option>
                  </select>
                </div>

                {/* Admin Add Book Button */}
                {currentUser?.role === 'admin' && (
                  <button
                    id="btn-admin-toolbar-add-book"
                    onClick={() => setIsAddBookModalOpen(true)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-black transition-all flex items-center gap-1.5 cursor-pointer border shadow-xs hover:scale-[1.02] active:scale-95 ${
                      isDarkMode
                        ? 'bg-amber-400 border-amber-300 text-slate-950 ring-2 ring-amber-400/20'
                        : 'bg-[#8b261d] border-[#8b261d] text-amber-200 ring-2 ring-[#8b261d]/15'
                    }`}
                    title="Adicionar novo livro ao catálogo"
                  >
                    <BookPlus className="w-3.5 h-3.5" />
                    <span>Adicionar Livro</span>
                  </button>
                )}

              </div>

            </div>

            {/* Quick Categories Bar */}
            <div className="flex items-center gap-2 overflow-x-auto py-2 border-b border-current/10 no-scrollbar">
              <span className={`text-xs font-semibold shrink-0 flex items-center gap-1 ${
                isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
              }`}>
                <span>Categoria / Tema:</span>
              </span>

              <button
                onClick={() => handleSelectTheme('todos')}
                className={`text-xs px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  activeTheme === 'todos'
                    ? isDarkMode
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                      : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    : 'bg-[#ede8df] text-[#5c5549] border-[#1c1c1c]/15 hover:border-[#1c1c1c]/40'
                }`}
              >
                Todos ({books.length})
              </button>

              {THEMES.map((t) => {
                const isSelected = activeTheme === t.id;
                const count = books.filter((b) => b.theme === t.id).length;

                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`text-xs px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? isDarkMode
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                          : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                        : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/20 hover:border-[#1c1c1c]/50'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className="text-[10px] opacity-75 font-normal">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Year & Manga Selector Badges */}
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
              <span className={`text-xs font-semibold shrink-0 flex items-center gap-1 ${
                isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'
              }`}>
                <span>Filtrar por Ano / Destaques:</span>
              </span>

              <button
                onClick={() => setSelectedYear(null)}
                className={`text-xs px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedYear === null && activeTheme !== 'manga'
                    ? isDarkMode
                      ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                      : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-400'
                    : 'bg-[#ede8df] text-[#5c5549] border-[#1c1c1c]/15 hover:border-[#1c1c1c]/40'
                }`}
              >
                Todos os Anos
              </button>

              {[2026, 2025, 2024, 2023, 2022, 2021, 2020].map((year) => {
                const isCurrentYearSelected = selectedYear === year;
                const count = books.filter((b) => b.year === year && (activeTheme === 'todos' || b.theme === activeTheme)).length;

                return (
                  <button
                    key={year}
                    onClick={() => {
                      setSelectedYear(isCurrentYearSelected ? null : year);
                    }}
                    className={`text-xs px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isCurrentYearSelected
                        ? isDarkMode
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-black shadow-xs'
                          : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c] shadow-xs'
                        : isDarkMode
                        ? 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-amber-400'
                        : 'bg-[#ede8df] text-[#5c5549] border-[#1c1c1c]/15 hover:border-[#1c1c1c]/40'
                    }`}
                  >
                    <span>{year === 2026 ? '🔥 2026 (Lançamentos)' : year}</span>
                    {count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isCurrentYearSelected
                          ? isDarkMode ? 'bg-slate-950 text-amber-400' : 'bg-white text-slate-900'
                          : isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-black/10 text-slate-700'
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setActiveTheme('manga');
                  setSelectedYear(null);
                }}
                className={`text-xs px-3 py-1 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5 ${
                  activeTheme === 'manga'
                    ? 'bg-orange-600 text-white border-orange-600 font-black shadow-xs'
                    : isDarkMode
                    ? 'bg-slate-800/90 text-orange-400 border-slate-700 hover:border-orange-500'
                    : 'bg-orange-50 text-orange-800 border-orange-200 hover:border-orange-400'
                }`}
              >
                <span>🎌 Melhores Mangás</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 text-current">
                  {books.filter((b) => b.theme === 'manga').length}
                </span>
              </button>
            </div>
          </div>

          {/* 6. Book Cards Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredBooks.length === 0 ? (
              <div className={`py-16 text-center p-8 rounded-3xl border space-y-4 max-w-lg mx-auto shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-900/80 border-slate-800 text-white' 
                  : 'bg-white border-[#1c1c1c]/15 text-[#1c1c1c]'
              }`}>
                <BookX className="w-12 h-12 text-amber-500 mx-auto opacity-70" />
                <div>
                  <h3 className="text-lg font-bold font-delicate">Nenhum livro encontrado</h3>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-[#7d7567]'}`}>
                    Tente alterar os termos da busca ou clique em "Limpar Filtros" para resetar os critérios.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedTag(null);
                    setSelectedYear(null);
                    setOnlyAvailable(false);
                    setShowOnlyFavorites(false);
                    setActiveTheme('todos');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs ${
                    isDarkMode 
                      ? 'bg-amber-400 text-slate-950 font-black hover:bg-amber-300' 
                      : 'bg-[#1c1c1c] text-[#f7f5f0] hover:bg-[#2e2b26]'
                  }`}
                >
                  Limpar Todos os Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
                {filteredBooks.map((book) => {
                  const bookActiveLoans = loans.filter((l) => l.bookId === book.id && l.status === 'active');
                  const userLoan = bookActiveLoans.find(
                    (l) => currentUser?.name && l.studentName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()
                  );
                  const bookReviewsCount = reviews.filter((r) => r.bookId === book.id).length;

                  return (
                    <BookCard
                      key={book.id}
                      book={book}
                      onOpenDetails={(b) => setSelectedBookForDetails(b)}
                      onOpenPreview={(b) => setSelectedBookForDetails(b)}
                      onStartLoan={handleStartLoan}
                      isFavorite={favorites.includes(book.id)}
                      onToggleFavorite={handleToggleFavorite}
                      borrowedCount={bookActiveLoans.length}
                      userLoanDueDate={userLoan ? userLoan.dueDate : null}
                      isDarkMode={isDarkMode}
                      reviewsCount={bookReviewsCount}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 6. Embedded Reader Quiz Section - Exclusive at the end of the site */}
          <ReaderQuizSection
            key={`reader-quiz-${quizSessionKey}`}
            sessionResetKey={quizSessionKey}
            books={books}
            onSelectBook={(b) => setSelectedBookForDetails(b)}
            onStartLoan={handleStartLoan}
            isDarkMode={isDarkMode}
          />

        </main>
      )}

      {/* Modals & Drawers */}
      <BookDetailModal
        book={activeBookForDetails}
        onClose={() => setSelectedBookForDetails(null)}
        onStartLoan={(b) => {
          setSelectedBookForDetails(null);
          handleStartLoan(b);
        }}
        isFavorite={activeBookForDetails ? favorites.includes(activeBookForDetails.id) : false}
        onToggleFavorite={handleToggleFavorite}
        currentUser={currentUser}
        activeBookLoans={activeBookForDetails ? loans.filter((l) => l.bookId === activeBookForDetails.id && l.status === 'active') : []}
        onDeleteBook={handleDeleteBook}
        reviews={reviews}
        onAddReview={handleAddReview}
        onLikeReview={handleLikeReview}
        isDarkMode={isDarkMode}
      />

      <LoanModal
        key={activeBookForLoan ? activeBookForLoan.id : 'no-loan'}
        book={activeBookForLoan}
        onClose={() => setSelectedBookForLoan(null)}
        onConfirmLoan={handleConfirmLoan}
        currentUser={currentUser}
        onOpenLoans={() => setIsLoansDrawerOpen(true)}
      />

      <MyLoansDrawer
        isOpen={isLoansDrawerOpen}
        onClose={() => setIsLoansDrawerOpen(false)}
        loans={loans}
        onReturnBook={handleReturnBook}
        currentUser={currentUser}
        onOpenLogin={() => handleOpenLogin('reader')}
      />

      <SurpriseBookModal
        isOpen={isSurpriseModalOpen}
        onClose={() => setIsSurpriseModalOpen(false)}
        books={books}
        onSelectBook={(b) => setSelectedBookForDetails(b)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
        currentUser={currentUser}
        initialTab={loginInitialTab}
      />

      <AddBookModal
        isOpen={isAddBookModalOpen && currentUser?.role === 'admin'}
        onClose={() => setIsAddBookModalOpen(false)}
        onAddBook={handleAddBook}
        isDarkMode={isDarkMode}
      />

      <ProfilePhotoModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateAvatar={handleUpdateAvatar}
        isDarkMode={isDarkMode}
      />

      {/* 9. Footer with "Sobre Nós" and Clean Editorial Styling */}
      <footer className={`border-t py-8 transition-colors ${
        isDarkMode 
          ? 'bg-[#080d1a] border-slate-800 text-slate-400' 
          : 'bg-[#ede8df] border-[#1c1c1c]/15 text-[#5c5549]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-5 text-xs font-sans-delicate">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <span className={`font-semibold text-base font-delicate tracking-wider ${
              isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
            }`}>
              Livrotec
            </span>
            <span>•</span>
            <span className="font-medium">Ceti Gov. Alberto Tavares Silva</span>
            <span>•</span>
            <span className={`px-2 py-0.5 rounded font-bold border text-[10px] ${
              isDarkMode ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-white text-[#1c1c1c] border-[#1c1c1c]/15'
            }`}>
              SEDUC-PI
            </span>
          </div>

          {/* Sobre Nós Link */}
          <div className="flex items-center gap-3">
            <button
              id="btn-footer-about-us"
              onClick={handleOpenAboutUs}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs ${
                currentView === 'about'
                  ? isDarkMode
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                    : 'bg-[#1c1c1c] text-[#f7f5f0] border-[#1c1c1c]'
                  : isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-white hover:bg-[#faf8f5] text-[#1c1c1c] border-[#1c1c1c]/15'
              }`}
            >
              <Users className="w-4 h-4 text-amber-500" />
              <span>Sobre Nós</span>
            </button>
          </div>

          <div className="text-center md:text-right text-[11px] opacity-80">
            Biblioteca Escolar Informatizada • Desenvolvida por Estudantes
          </div>
        </div>
      </footer>

    </div>
  );
}
