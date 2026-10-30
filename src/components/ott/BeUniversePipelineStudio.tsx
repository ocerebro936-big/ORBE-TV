import React, { useState } from 'react';
import { BeUniverseItem } from '../../types/ott-architecture';
import { Star, Upload, Video, Music, Mic, Award, Users, Check, Clock, RefreshCw, Sparkles, Film } from 'lucide-react';

export const BeUniversePipelineStudio: React.FC = () => {
  const [items, setItems] = useState<BeUniverseItem[]>([
    {
      id: 'bu-talent-01',
      type: 'talent-show',
      title: 'Estrelas de Moçambique 2026',
      season: 'Temporada 3',
      episode: 'Ep. 8 — Semifinal da Zona Sul',
      host: 'Be Universe Studios Maputo',
      status: 'ready',
      viewsCount: 142500,
      coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80',
      description: 'O maior caça-talentos vocal e performático do país, descobrindo vozes em Maputo, Beira e Nampula.',
      duration: '58 min',
      storageGb: 14.8
    },
    {
      id: 'bu-reality-02',
      type: 'reality',
      title: 'Casa dos Criadores Maputo',
      season: 'Temporada 1',
      episode: 'Ep. 14 — Desafio de Produção Viral',
      host: 'Be Universe Originals',
      status: 'airing-247',
      viewsCount: 289000,
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=80',
      description: '12 criadores de conteúdo e músicos isolados em uma mansão na Costa do Sol criando projetos diários.',
      duration: '45 min',
      storageGb: 18.2
    },
    {
      id: 'bu-casting-03',
      type: 'casting',
      title: 'Casting Nacional de Atores & Apresentadores UBlue TV',
      host: 'Departamento de Casting Be Universe',
      status: 'auditions-open',
      viewsCount: 48100,
      coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1000&auto=format&fit=crop&q=80',
      description: 'Inscrições abertas para novas caras das novelas e programas de entretenimento da UBlue TV.',
      duration: 'Inscrições abertas',
      storageGb: 4.5
    },
    {
      id: 'bu-music-04',
      type: 'music',
      title: 'Acústico Afro & Marrabenta Live Sessions',
      season: 'Vol. 4',
      host: 'Selo Be Universe Music',
      status: 'ready',
      viewsCount: 95400,
      coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
      description: 'Gravações exclusivas de estúdio com os mestres da Marrabenta e a nova geração de Afro House.',
      duration: '32 min',
      storageGb: 8.6
    }
  ]);

  // Video Upload Simulation State
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'talent-show' | 'reality' | 'music' | 'podcast'>('talent-show');

  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStep('Enviando master ProRes para o S3 Origin Hetzner...');

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setUploadStep('Transcodificando multi-bitrate (1080p, 720p, 480p, 360p HLS) & indexando no OpenSearch...');
          setTimeout(() => {
            setUploadProgress(100);
            setIsUploading(false);
            setUploadStep('Concluído com sucesso!');

            // Append item
            const newItem: BeUniverseItem = {
              id: `bu-upload-${Date.now()}`,
              type: newCategory,
              title: newTitle,
              host: 'Be Universe Upload',
              status: 'ready',
              viewsCount: 1,
              coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&auto=format&fit=crop&q=80',
              description: 'Conteúdo Be Universe recém-processado pelo pipeline e pronto para exibição no aplicativo.',
              duration: '42 min',
              storageGb: 11.4
            };

            setItems([newItem, ...items]);
            setNewTitle('');
          }, 1200);
          return 90;
        }
        return prev + 25;
      });
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-mono font-semibold border border-amber-500/20 mb-2">
            <Star className="w-3.5 h-3.5" />
            <span>Ecossistema de Produção de Conteúdo</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Integração Be Universe & Pipeline Ingest</h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Gestão e ingestão de Talent Shows, Reality Shows, audições de Castings, programas musicais, podcasts e alimentação contínua do canal linear 24/7.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 text-xs font-mono font-bold border border-slate-700">
            {items.length} Produções Catalogadas
          </span>
        </div>
      </div>

      {/* Grid: Upload Box & Catalog */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Upload Simulator & Ingest Worker (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Upload de Vídeo & Worker de Transcodificação</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pipeline automatizado: S3 Origin &rarr; Cluster FFmpeg &rarr; OpenSearch &rarr; Cloudflare CDN.
            </p>

            <form onSubmit={handleSimulateUpload} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                  Título da Produção
                </label>
                <input
                  type="text"
                  placeholder="Ex: Be Voice Africa — Audições Nampula"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 uppercase block mb-1">
                  Categoria Be Universe
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="talent-show">Talent Show</option>
                  <option value="reality">Reality Show</option>
                  <option value="music">Música & Acústicos</option>
                  <option value="podcast">Podcast Exclusivo</option>
                </select>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/60 text-center">
                <Film className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                <div className="text-xs font-semibold text-slate-300">Arquivo Master (ProRes / MP4 4K)</div>
                <div className="text-[10px] text-slate-500">Chunked upload multi-part via S3 SDK</div>
              </div>

              <button
                type="submit"
                disabled={isUploading || !newTitle.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Processando Ingestão...' : 'Iniciar Ingestão & Transcode'}
              </button>
            </form>

            {/* Progress bar */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] text-cyan-300 font-mono">
                  <span>{uploadStep}</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Catalog of Be Universe Productions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Catálogo Ativo Be Universe (Talent Shows, Reality, Músicas & Castings)</span>
            </h3>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 hover:border-slate-700 transition-all">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-24 h-16 rounded-lg object-cover shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{item.description}</p>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-3 font-mono">
                    <span>{item.viewsCount.toLocaleString()} visualizações</span>
                    <span>{item.storageGb} GB S3</span>
                    {item.duration && <span>{item.duration}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
