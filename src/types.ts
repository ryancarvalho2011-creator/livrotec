export type ThemeId = 
  | 'todos'
  | 'romances'
  | 'novelas'
  | 'poesia'
  | 'contos'
  | 'cronicas'
  | 'teatro'
  | 'literatura-brasileira'
  | 'literatura-estrangeira'
  | 'antologias'
  | 'ficcao'
  | 'historia'
  | 'biografia'
  | 'historia-do-piaui'
  | 'dicionarios';

export type UserRole = 'reader' | 'admin';

export interface UserSession {
  role: UserRole;
  name: string;
  username?: string;
  studentClass?: string;
  loginTime: string;
  avatarUrl?: string;
}

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  bgImage: string;
  gradient: string;
  accentColor: string;
  borderHoverColor: string;
  textColor: string;
  iconName: string;
  badge: string;
  mood: string;
  quote: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  theme: ThemeId;
  coverImage: string;
  pages: number;
  year: number;
  synopsis: string;
  rating: number;
  availableCopies: number;
  totalCopies: number;
  location: string;
  tags: string[];
  readingAge: string;
  sampleQuote: string;
  previewExcerpt: string;
  publisher?: string;
}

export interface StudentLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  theme: ThemeId;
  studentName: string;
  studentClass: string;
  registrationNumber: string;
  loanDate: string;
  dueDate: string;
  status: 'active' | 'returned';
}

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  userClass?: string;
  rating: number;
  comment: string;
  createdAt: string;
  likes: number;
  isVerifiedStudent?: boolean;
  avatarUrl?: string;
}

export type ReaderArchetype = 'explorer' | 'detective' | 'thrillseeker' | 'romantic' | 'thinker';

export interface QuizOption {
  id: string;
  text: string;
  archetype: ReaderArchetype;
  iconName?: string;
}

export interface QuizQuestion {
  id: number;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export interface QuizResultProfile {
  archetype: ReaderArchetype;
  title: string;
  badge: string;
  description: string;
  habits: string[];
  traits?: string[];
  recommendedThemes: ThemeId[];
  recommendedBookIds: string[];
  color: string;
  icon?: string;
}
