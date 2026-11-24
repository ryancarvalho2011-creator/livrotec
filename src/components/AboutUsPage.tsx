import React from 'react';
import { Sparkles, Users, GraduationCap, Instagram, BookOpen, ExternalLink } from 'lucide-react';

interface AboutUsPageProps {
  onBackToCatalog: () => void;
  isDarkMode?: boolean;
}

interface Creator {
  name: string;
  role: string;
  instagramHandle?: string;
  instagramUrl?: string;
  bio: string;
  avatarColor: string;
  tag: string;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ 
  onBackToCatalog,
  isDarkMode = false
}) => {
  const creators: Creator[] = [
    {
      name: 'Kauã',
      role: 'Idealizador & Desenvolvimento',
      instagramHandle: 'kaua.meloz',
      instagramUrl: 'https://instagram.com/kaua.meloz',
      bio: 'Apaixonado por tecnologia e inovação, responsável pela concepção da Livrotec e estruturação do catálogo digital da escola.',
      avatarColor: '#8b261d',
      tag: 'Desenvolvedor'
    },
    {
      name: 'Domynique',
      role: 'Curadoria & Design',
      instagramHandle: 'domyyz_',
      instagramUrl: 'https://instagram.com/domyyz_',
      bio: 'Criativa e detalhista, auxiliou no design visual e seleção editorial das obras literárias para encantar os estudantes.',
      avatarColor: '#b45309',
      tag: 'Design & Acervo'
    },
    {
      name: 'Anderson',
      role: 'Apoio Editorial & Cultura',
      instagramHandle: 'anderson._hxz',
      instagramUrl: 'https://instagram.com/anderson._hxz',
      bio: 'Incentivador de projetos culturais e incentivo ao livro físico na comunidade escolar do Ceti Gov. Alberto Tavares Silva.',
      avatarColor: '#1e3a8a',
      tag: 'Cultura Escolar'
    },
    {
      name: 'Gabi',
      role: 'Comunicação & Conteúdo',
      instagramHandle: 'ikgaar0',
      instagramUrl: 'https://instagram.com/ikgaar0',
      bio: 'Dedicada à difusão da leitura e catalogação temática, conectando alunos aos seus gêneros literários favoritos.',
      avatarColor: '#047857',
      tag: 'Pesquisa & Leitura'
    },
    {
      name: 'Vida',
      role: 'Desenvolvimento & Estruturação',
      instagramHandle: 'rafaelyzl_',
      instagramUrl: 'https://instagram.com/rafaelyzl_',
      bio: 'Focada na organização do acervo e experiência dos leitores para facilitar a consulta das obras da biblioteca escolar.',
      avatarColor: '#6b21a8',
      tag: 'Organização Técnica'
    },
    {
      name: 'Davy',
      role: 'Design & Acervo da Livrotec',
      instagramHandle: 'davysz._',
      instagramUrl: 'https://www.instagram.com/davysz._/',
      bio: 'Responsável pelo design e organização do acervo da Livrotec, assegurando uma identidade visual atraente e catálogo acolhedor para os alunos.',
      avatarColor: '#0284c7',
      tag: 'Design & Acervo'
    }
  ];

  return (
    <div className={`min-h-screen transition-colors font-sans-delicate animate-in fade-in duration-300 ${
      isDarkMode ? 'bg-[#0b1324] text-[#f8fafc]' : 'bg-[#faf8f5] text-[#1c1c1c]'
    }`}>
      
      {/* Top Header Bar without exit button */}
      <div className={`border-b sticky top-0 z-30 backdrop-blur-md transition-colors ${
        isDarkMode ? 'border-slate-800 bg-[#0f172a]/95' : 'border-[#1c1c1c]/15 bg-[#ffffff]/95'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-bold font-delicate tracking-wider ${
              isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
            }`}>
              Livrotec
            </span>
            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
              isDarkMode ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/15'
            }`}>
              Quem Somos
            </span>
          </div>

          <div className={`flex items-center gap-2 text-xs ${
            isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
          }`}>
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span className="font-bold">Ceti Gov. Alberto Tavares Silva</span>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold shadow-xs ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-amber-400' 
              : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c]'
          }`}>
            <Users className="w-3.5 h-3.5 text-amber-500" />
            <span>Quem Somos</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl font-bold tracking-tight font-delicate ${
            isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
          }`}>
            Conheça os Criadores da Livrotec
          </h1>

          <p className={`text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal ${
            isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
          }`}>
            A <strong className={isDarkMode ? 'text-amber-400' : 'text-[#1c1c1c]'}>Livrotec</strong> é uma iniciativa desenvolvida por estudantes do <strong>Ceti Gov. Alberto Tavares Silva</strong> com o propósito de aproximar os jovens do universo da leitura, digitalizar o acervo e tornar o acesso aos livros escolares mais prático, dinâmico e inspirador.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {creators.map((creator) => (
            <div
              key={creator.name}
              className={`group border rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between ${
                isDarkMode 
                  ? 'bg-[#152238] border-slate-700/80 hover:border-amber-400 text-white' 
                  : 'bg-[#ffffff] border-[#1c1c1c]/15 hover:border-[#1c1c1c]/40 text-[#1c1c1c]'
              }`}
            >
              <div>
                {/* Top Badge & Avatar */}
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold font-delicate shadow-md"
                    style={{ backgroundColor: creator.avatarColor }}
                  >
                    {creator.name.charAt(0)}
                  </div>
                  <span className={`text-[11px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-slate-900 text-amber-300 border-slate-700' 
                      : 'bg-[#ede8df] text-[#1c1c1c] border-[#1c1c1c]/15'
                  }`}>
                    {creator.tag}
                  </span>
                </div>

                {/* Name & Role */}
                <h2 className={`text-2xl font-bold font-delicate ${
                  isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
                }`}>
                  {creator.name}
                </h2>
                <p className="text-xs font-bold text-amber-500 mt-0.5">
                  {creator.role}
                </p>

                {/* Bio */}
                <p className={`text-xs leading-relaxed mt-3 font-normal ${
                  isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
                }`}>
                  {creator.bio}
                </p>
              </div>

              {/* Instagram Link Section */}
              <div className={`pt-5 mt-5 border-t ${
                isDarkMode ? 'border-slate-800' : 'border-[#1c1c1c]/10'
              }`}>
                {creator.instagramHandle ? (
                  <a
                    href={creator.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between w-full px-3.5 py-2 rounded-xl border transition-all text-xs font-bold group/link shadow-2xs ${
                      isDarkMode 
                        ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 hover:border-amber-400' 
                        : 'bg-[#ede8df] hover:bg-[#e4ddcf] text-[#1c1c1c] border-[#1c1c1c]/15'
                    }`}
                    title={`Ver Instagram de ${creator.name}`}
                  >
                    <span className="flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-pink-500 group-hover/link:scale-110 transition-transform" />
                      <span>@{creator.instagramHandle}</span>
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ) : (
                  <div className={`flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl border ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    <Instagram className="w-4 h-4" />
                    <span>Perfil Escolar</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Project Mission Banner */}
        <div className={`border rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-lg ${
          isDarkMode 
            ? 'bg-[#152238] border-slate-700 text-white' 
            : 'bg-[#ede8df] border-[#1c1c1c]/20 text-[#1c1c1c]'
        }`}>
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-500 text-xs font-black uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Nossa Missão</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-bold font-delicate ${
              isDarkMode ? 'text-white' : 'text-[#1c1c1c]'
            }`}>
              Transformar a biblioteca em um ponto de encontro com a imaginação
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-[#5c5549]'
            }`}>
              O projeto foi pensado para enriquecer a experiência literária de todos os alunos do Ceti Gov. Alberto Tavares Silva, incentivando o hábito da leitura, facilitando a escolha de novos livros por temas visuais e descomplicando o sistema de retiradas da biblioteca.
            </p>
            <div className="pt-3">
              <button
                onClick={onBackToCatalog}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
                  isDarkMode 
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black' 
                    : 'bg-[#1c1c1c] hover:bg-[#2e2b26] text-[#f7f5f0]'
                }`}
              >
                <span>Explorar Livros do Acervo</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Class Signature & Official Instagram Section */}
        <div className={`mt-10 border rounded-3xl p-6 sm:p-8 relative overflow-hidden transition-all shadow-md text-center flex flex-col items-center justify-center gap-4 ${
          isDarkMode 
            ? 'bg-gradient-to-b from-[#131e33] to-[#0f172a] border-slate-700/80 text-white' 
            : 'bg-gradient-to-b from-[#ffffff] to-[#f4efe6] border-[#1c1c1c]/15 text-[#1c1c1c]'
        }`}>
          {/* Subtle decorative glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-20 bg-gradient-to-r from-pink-500/15 via-purple-500/15 to-amber-500/15 blur-2xl pointer-events-none rounded-full" />

          {/* Badge: Turma de Desenvolvimento de Sistemas */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-bold tracking-wide uppercase ${
            isDarkMode 
              ? 'bg-slate-800/80 border-slate-700 text-amber-300' 
              : 'bg-[#ede8df] border-[#1c1c1c]/15 text-[#1c1c1c]'
          }`}>
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>Turma de Desenvolvimento de Sistemas • CETI Gov. Alberto Tavares Silva</span>
          </div>

          {/* Inspiring class caption / legenda */}
          <p className={`text-base sm:text-lg font-medium max-w-xl leading-relaxed italic ${
            isDarkMode ? 'text-slate-200' : 'text-[#2e2b26]'
          }`}>
            &ldquo;Pequenos passos, grandes ideias e um futuro inteiro para programar. 💻🚀&rdquo;
          </p>

          {/* Official Instagram Button with hover animation */}
          <div className="pt-1">
            <a
              href="https://www.instagram.com/1serie_d.sistemas/"
              target="_blank"
              rel="noopener noreferrer"
              className={`group/ig inline-flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-xl hover:scale-[1.03] active:scale-95 cursor-pointer font-bold text-sm sm:text-base ${
                isDarkMode 
                  ? 'bg-slate-800 hover:bg-slate-700/90 text-white border-slate-700 hover:border-pink-500/60' 
                  : 'bg-white hover:bg-white text-[#1c1c1c] border-[#1c1c1c]/20 hover:border-pink-500/50'
              }`}
              title="Acessar Instagram oficial da turma: @1serie_d.sistemas"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-xs group-hover/ig:rotate-6 group-hover/ig:scale-110 transition-transform">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[10px] uppercase font-semibold opacity-70 tracking-wider">
                  Instagram da Turma
                </span>
                <span className="font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent group-hover/ig:from-pink-500 group-hover/ig:to-amber-500 transition-all">
                  @1serie_d.sistemas
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover/ig:text-pink-500 group-hover/ig:translate-x-0.5 transition-all ml-1" />
            </a>
          </div>

          <p className={`text-[11px] ${
            isDarkMode ? 'text-slate-400' : 'text-[#736b5e]'
          }`}>
            Siga nossa turma e acompanhe os próximos projetos e inovações da Livrotec.
          </p>
        </div>

      </div>
    </div>
  );
};
