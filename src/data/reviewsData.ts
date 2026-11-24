import { BookReview } from '../types';

export const INITIAL_REVIEWS: BookReview[] = [
  {
    id: 'rev-1',
    bookId: 'book-romance-8',
    userName: 'Kaua Melo',
    userClass: '2º Ano D.S',
    rating: 5,
    comment: 'Capitães da Areia é um dos maiores clássicos que já li! A história de Pedro Bala e do trapiche em Salvador é emocionante demais.',
    createdAt: '2026-08-15',
    likes: 24,
    isVerifiedStudent: true
  },
  {
    id: 'rev-2',
    bookId: 'book-lit-brasil-1',
    userName: 'Beatriz Costa',
    userClass: '1º Ano Administração',
    rating: 5,
    comment: 'Dom Casmurro tem uma narrativa genial. Machado de Assis constrói a dúvida e o ciúme de Bento Santiago com maestria.',
    createdAt: '2026-08-18',
    likes: 19,
    isVerifiedStudent: true
  },
  {
    id: 'rev-3',
    bookId: 'book-biografia-1',
    userName: 'Mariana Silva',
    userClass: '3º Ano Marketing Digital',
    rating: 5,
    comment: 'Eu Sou Malala é inspirador para qualquer estudante! Mostra a importância inegociável da educação e da coragem.',
    createdAt: '2026-08-20',
    likes: 27,
    isVerifiedStudent: true
  },
  {
    id: 'rev-4',
    bookId: 'book-hist-piaui-1',
    userName: 'Gabriel Santos',
    userClass: '3º Ano Guia de Turismo',
    rating: 5,
    comment: 'Estudos de História do Piauí de Odilon Nunes é leitura obrigatória para entender a formação de nossa terra e nossa identidade.',
    createdAt: '2026-08-21',
    likes: 18,
    isVerifiedStudent: true
  },
  {
    id: 'rev-5',
    bookId: 'book-lit-estrang-1',
    userName: 'Lucas Andrade',
    userClass: '2º Ano D.S',
    rating: 5,
    comment: 'Admirável Mundo Novo impressiona pela atualidade! Uma reflexão profunda sobre tecnologia, liberdade e humanidade.',
    createdAt: '2026-08-22',
    likes: 16,
    isVerifiedStudent: true
  },
  {
    id: 'rev-6',
    bookId: 'book-cronicas-1',
    userName: 'Camila Rocha',
    userClass: '2º Ano Guia de Turismo',
    rating: 5,
    comment: 'A Vida que Ninguém Vê da Eliane Brum emociona em cada crônica. Dá visibilidade a vidas extraordinárias que passam despercebidas.',
    createdAt: '2026-08-23',
    likes: 21,
    isVerifiedStudent: true
  }
];

export const POPULAR_STATS: Record<string, { loanCount: number; viewsCount: number; badgeText: string; ranking: number }> = {
  'book-romance-8': { loanCount: 48, viewsCount: 230, badgeText: '⭐ Mais Procurado', ranking: 1 },
  'book-lit-brasil-1': { loanCount: 45, viewsCount: 215, badgeText: '🏆 Clássico Essencial', ranking: 2 },
  'book-biografia-1': { loanCount: 42, viewsCount: 198, badgeText: '✨ Inspiração Global', ranking: 3 },
  'book-hist-piaui-1': { loanCount: 38, viewsCount: 175, badgeText: '🏛️ Memória Piauiense', ranking: 4 },
  'book-lit-estrang-1': { loanCount: 35, viewsCount: 160, badgeText: '🌍 Distopia Marcante', ranking: 5 },
  'book-cronicas-1': { loanCount: 32, viewsCount: 150, badgeText: '📰 Crônicas Imperdíveis', ranking: 6 }
};
