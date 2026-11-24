import { QuizQuestion, QuizResultProfile } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: 'Qual é o seu momento perfeito para mergulhar em um livro?',
    subtitle: 'Escolha a atmosfera que mais combina com seu ritmo.',
    options: [
      {
        id: 'q1-a',
        text: 'À noite, com luz baixa, pronto para tomar sustos e sentir arrepios.',
        archetype: 'thrillseeker',
        iconName: 'Moon'
      },
      {
        id: 'q1-b',
        text: 'Em uma tarde tranquila, com uma playlist relaxante e café/chá.',
        archetype: 'romantic',
        iconName: 'Coffee'
      },
      {
        id: 'q1-c',
        text: 'Entre as aulas ou no transporte, lendo rápido capítulo atrás de capítulo.',
        archetype: 'explorer',
        iconName: 'Zap'
      },
      {
        id: 'q1-d',
        text: 'Com um caderno de anotações tentando desvendar segredos antes do autor.',
        archetype: 'detective',
        iconName: 'Search'
      },
      {
        id: 'q1-e',
        text: 'Em silêncio absoluto para refletir sobre a vida e a sociedade.',
        archetype: 'thinker',
        iconName: 'Brain'
      }
    ]
  },
  {
    id: 2,
    title: 'Que tipo de enredo te prende desde a primeira página?',
    subtitle: 'O que faz você não conseguir fechar o livro?',
    options: [
      {
        id: 'q2-a',
        text: 'Batalhas eletrizantes, superpoderes, magias e missões impossíveis.',
        archetype: 'explorer',
        iconName: 'Swords'
      },
      {
        id: 'q2-b',
        text: 'Crimes misteriosos, pistas enigmáticas e reviravoltas no final.',
        archetype: 'detective',
        iconName: 'Eye'
      },
      {
        id: 'q2-c',
        text: 'Casas mal-assombradas, entidades sinistras e tensão psicológica constante.',
        archetype: 'thrillseeker',
        iconName: 'Ghost'
      },
      {
        id: 'q2-d',
        text: 'Aquele romance "inimigos para amantes" ou encontros marcados pelo destino.',
        archetype: 'romantic',
        iconName: 'Heart'
      },
      {
        id: 'q2-e',
        text: 'Dilemas éticos, conflitos históricos e lições sobre a condição humana.',
        archetype: 'thinker',
        iconName: 'BookMarked'
      }
    ]
  },
  {
    id: 3,
    title: 'Qual é o seu superpoder de leitor?',
    subtitle: 'Todo leitor tem uma habilidade secreta.',
    options: [
      {
        id: 'q3-a',
        text: 'Consigo prever o culpado ou o segredo antes da metade do livro!',
        archetype: 'detective',
        iconName: 'Compass'
      },
      {
        id: 'q3-b',
        text: 'Devoro 50 capítulos de mangá ou aventura numa velocidade recorde.',
        archetype: 'explorer',
        iconName: 'Flame'
      },
      {
        id: 'q3-c',
        text: 'Não tenho medo de histórias macabras e adoro o desconhecido.',
        archetype: 'thrillseeker',
        iconName: 'Skull'
      },
      {
        id: 'q3-d',
        text: 'Me apego profundamente aos personagens e sinto todas as emoções deles.',
        archetype: 'romantic',
        iconName: 'Sparkles'
      },
      {
        id: 'q3-e',
        text: 'Grifo frases marcantes e guardo lições que levo para a vida toda.',
        archetype: 'thinker',
        iconName: 'Feather'
      }
    ]
  },
  {
    id: 4,
    title: 'Se você pudesse viver em um universo fictício, para onde iria?',
    subtitle: 'Escolha seu destino dos sonhos.',
    options: [
      {
        id: 'q4-a',
        text: 'Para um mundo com piratas lendários, demônios e heróis destemidos.',
        archetype: 'explorer',
        iconName: 'Ship'
      },
      {
        id: 'q4-b',
        text: 'Para as ruas de Londres na era vitoriana investigando casos enigmáticos.',
        archetype: 'detective',
        iconName: 'Compass'
      },
      {
        id: 'q4-c',
        text: 'Para a cidadezinha isolada de Derry ou um casarão gótico cheio de mistérios.',
        archetype: 'thrillseeker',
        iconName: 'Castle'
      },
      {
        id: 'q4-d',
        text: 'Para bailes da alta sociedade do século XIX ou um romance contemporâneo doce.',
        archetype: 'romantic',
        iconName: 'Crown'
      },
      {
        id: 'q4-e',
        text: 'Para uma biblioteca histórica clássica repleta de sabedoria e filosofia.',
        archetype: 'thinker',
        iconName: 'BookOpen'
      }
    ]
  },
  {
    id: 5,
    title: 'O que você mais busca ao terminar uma leitura na Livrotec?',
    subtitle: 'Qual é o impacto que você deseja sentir?',
    options: [
      {
        id: 'q5-a',
        text: 'A adrenalina de ter participado de uma grande jornada épica.',
        archetype: 'explorer',
        iconName: 'Trophy'
      },
      {
        id: 'q5-b',
        text: 'A sensação de "como eu não percebi esse detalhe antes?!".',
        archetype: 'detective',
        iconName: 'Lightbulb'
      },
      {
        id: 'q5-c',
        text: 'O coração acelerado e a vontade de contar a história para assustar os amigos.',
        archetype: 'thrillseeker',
        iconName: 'Flame'
      },
      {
        id: 'q5-d',
        text: 'O coração quentinho e lágrimas de emoção pura.',
        archetype: 'romantic',
        iconName: 'HeartHandshake'
      },
      {
        id: 'q5-e',
        text: 'Uma nova perspectiva sobre a sociedade, respeito e crescimento pessoal.',
        archetype: 'thinker',
        iconName: 'Award'
      }
    ]
  }
];

export const PROFILES_MAP: Record<string, QuizResultProfile> = {
  explorer: {
    archetype: 'explorer',
    title: 'O Explorador de Mundos',
    badge: '⚡ Aventureiro & Curioso',
    color: '#f59e0b',
    icon: '⚡',
    description: 'Você busca viagens épicas, imaginação transbordante e descobertas surpreendentes. Não gosta de mesmice e se transporta com facilidade para mundos distantes!',
    habits: [
      'Lê com entusiasmo narrativas de aventura e novos horizontes',
      'Fascinado por viagens no tempo, ilhas distantes e sociedades inventivas',
      'Adora personagens corajosos que desafiam os limites do conhecido'
    ],
    traits: [
      'Lê com entusiasmo narrativas de aventura e novos horizontes',
      'Fascinado por viagens no tempo, ilhas distantes e sociedades inventivas',
      'Adora personagens corajosos que desafiam os limites do conhecido'
    ],
    recommendedThemes: ['literatura-estrangeira', 'ficcao', 'contos'],
    recommendedBookIds: ['book-lit-estrang-2', 'book-ficcao-1', 'book-contos-2', 'book-romance-1']
  },
  detective: {
    archetype: 'detective',
    title: 'O Investigador de Enigmas',
    badge: '🔍 Mente Analítica & Perspicaz',
    color: '#0284c7',
    icon: '🔍',
    description: 'Você repara em cada pista, palavra e detalhe da narrativa. Para você, desvendar a psicologia dos personagens e as entrelinhas é a melhor parte da leitura!',
    habits: [
      'Analisa os motivos ocultos e as intenções dos personagens',
      'Aprecia reviravoltas psicológicas e contos enigmáticos',
      'Não se contenta com o óbvio e busca o significado profundo'
    ],
    traits: [
      'Analisa os motivos ocultos e as intenções dos personagens',
      'Aprecia reviravoltas psicológicas e contos enigmáticos',
      'Não se contenta com o óbvio e busca o significado profundo'
    ],
    recommendedThemes: ['contos', 'literatura-brasileira', 'romances'],
    recommendedBookIds: ['book-contos-1', 'book-lit-brasil-1', 'book-romance-7', 'book-cronicas-1']
  },
  thrillseeker: {
    archetype: 'thrillseeker',
    title: 'O Caçador de Intensidade',
    badge: '🔥 Corajoso & Inquieto',
    color: '#dc2626',
    icon: '🔥',
    description: 'Você busca narrativas arrebatadoras, conflitos humanos decisivos e emoções fortes que desafiam o comodismo e tocam na realidade crua.',
    habits: [
      'Gosta de leituras eletrizantes que tiram o fôlego',
      'Aprecia peças dramáticas, tragédias e lutas históricas',
      'Busca reflexões profundas sobre liberdade e sobrevivência'
    ],
    traits: [
      'Gosta de leituras eletrizantes que tiram o fôlego',
      'Aprecia peças dramáticas, tragédias e lutas históricas',
      'Busca reflexões profundas sobre liberdade e sobrevivência'
    ],
    recommendedThemes: ['teatro', 'historia', 'romances'],
    recommendedBookIds: ['book-teatro-1', 'book-historia-1', 'book-romance-2', 'book-poesia-4']
  },
  romantic: {
    archetype: 'romantic',
    title: 'O Romântico & Poético',
    badge: '💖 Sensível & Apaixonado',
    color: '#db2777',
    icon: '💖',
    description: 'Você se conecta profundamente com as emoções humanas, valoriza versos marcantes, cartas sinceras e histórias sobre a ternura dos afetos.',
    habits: [
      'Guarda versos e frases poéticas que tocam o coração',
      'Se emociona com encontros, desencontros e laços verdadeiros',
      'Prefere leituras que alimentam a esperança e a beleza da vida'
    ],
    traits: [
      'Guarda versos e frases poéticas que tocam o coração',
      'Se emociona com encontros, desencontros e laços verdadeiros',
      'Prefere leituras que alimentam a esperança e a beleza da vida'
    ],
    recommendedThemes: ['poesia', 'novelas', 'romances'],
    recommendedBookIds: ['book-poesia-2', 'book-novela-2', 'book-romance-9', 'book-romance-4']
  },
  thinker: {
    archetype: 'thinker',
    title: 'O Pensador Crítico',
    badge: '🧠 Histórico & Reflexivo',
    color: '#7c3aed',
    icon: '🧠',
    description: 'Você lê para expandir horizontes, compreender as raízes da sociedade, a história de sua terra e os dilemas éticos da cidadania.',
    habits: [
      'Reflete sobre o contexto histórico e social de cada obra',
      'Valoriza documentos, pesquisas e memórias da sua cultura',
      'Lê para adquirir consciência crítica e transformar o mundo'
    ],
    traits: [
      'Reflete sobre o contexto histórico e social de cada obra',
      'Valoriza documentos, pesquisas e memórias da sua cultura',
      'Lê para adquirir consciência crítica e transformar o mundo'
    ],
    recommendedThemes: ['historia-do-piaui', 'historia', 'biografia'],
    recommendedBookIds: ['book-hist-piaui-1', 'book-historia-2', 'book-biografia-1', 'book-lit-estrang-1']
  }
};
