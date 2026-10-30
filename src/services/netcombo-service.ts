import { NetComboChannelDoc, NetComboProgramDoc, NetComboApiResponse } from '../types/netcombo';
import { Channel } from '../types/content';

// Curadoria da Grade Oficial NetCombo / Claro TV Brasil (baseada no Solr Gatekeeper id_cidade:1)
export const NETCOMBO_CURATED_CHANNELS: NetComboChannelDoc[] = [
  {
    id_canal: '1015',
    cn_canal: '1',
    nome: 'NOW / Claro Vídeo',
    st_canal: 'now',
    url_imagem: 'https://www.netcombo.com.br/cs/Satellite/NET/media/logonow.jpg',
    categoria: 'On Demand',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1196',
    cn_canal: '2',
    nome: 'Canal 2 (Canal da Cidade)',
    st_canal: 'canal_2',
    url_imagem: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&auto=format&fit=crop&q=80',
    categoria: 'Institucional',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1682',
    cn_canal: '3',
    nome: 'TV Câmara',
    st_canal: 'tv_camara',
    url_imagem: 'https://www.netcombo.com.br/cs/Satellite/NET/media/logotvcamara.png',
    categoria: 'Público',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1683',
    cn_canal: '4',
    nome: 'TV Brasil HD',
    st_canal: 'tv_brasil',
    url_imagem: 'https://www.netcombo.com.br/cs/Satellite/NET/media/logotvbrasil.png',
    categoria: 'Aberto',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '2302',
    cn_canal: '5',
    nome: 'TV Brasil 2',
    st_canal: 'tv_brasil_2',
    url_imagem: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&auto=format&fit=crop&q=80',
    categoria: 'Educativo',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1765',
    cn_canal: '6',
    nome: 'TV Justiça',
    st_canal: 'tv_justica',
    url_imagem: 'https://www.netcombo.com.br/cs/Satellite/NET/media/logojustica.png',
    categoria: 'Público',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1693',
    cn_canal: '7',
    nome: 'Canal Legislativo (Alesp)',
    st_canal: 'canal_legislativo',
    url_imagem: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80',
    categoria: 'Público',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1754',
    cn_canal: '8',
    nome: 'TV Escola',
    st_canal: 'tv_escola',
    url_imagem: 'https://www.netcombo.com.br/cs/Satellite/NET/media/logotvescola.jpg',
    categoria: 'Educativo',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1731',
    cn_canal: '9',
    nome: 'TV Aberta São Paulo',
    st_canal: 'tv_aberta',
    url_imagem: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=300&auto=format&fit=crop&q=80',
    categoria: 'Comunitário',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '1833',
    cn_canal: '10',
    nome: 'Canal Comunitário SP',
    st_canal: 'canal_comunitario',
    url_imagem: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80',
    categoria: 'Comunitário',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '501',
    cn_canal: '501',
    nome: 'TV Globo HD',
    st_canal: 'globo_hd',
    url_imagem: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300&auto=format&fit=crop&q=80',
    categoria: 'Aberto',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '505',
    cn_canal: '505',
    nome: 'Band HD',
    st_canal: 'band_hd',
    url_imagem: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
    categoria: 'Aberto',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '509',
    cn_canal: '509',
    nome: 'SBT HD',
    st_canal: 'sbt_hd',
    url_imagem: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=300&auto=format&fit=crop&q=80',
    categoria: 'Aberto',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '519',
    cn_canal: '519',
    nome: 'Record TV HD',
    st_canal: 'record_hd',
    url_imagem: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&auto=format&fit=crop&q=80',
    categoria: 'Aberto',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '577',
    cn_canal: '577',
    nome: 'CNN Brasil HD',
    st_canal: 'cnn_brasil_hd',
    url_imagem: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=300&auto=format&fit=crop&q=80',
    categoria: 'Notícias',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '571',
    cn_canal: '571',
    nome: 'Jovem Pan News HD',
    st_canal: 'jovem_pan_news',
    url_imagem: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300&auto=format&fit=crop&q=80',
    categoria: 'Notícias',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '539',
    cn_canal: '539',
    nome: 'SporTV HD',
    st_canal: 'sportv_hd',
    url_imagem: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&auto=format&fit=crop&q=80',
    categoria: 'Esportes',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '661',
    cn_canal: '661',
    nome: 'Telecine Premium HD',
    st_canal: 'telecine_premium',
    url_imagem: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&auto=format&fit=crop&q=80',
    categoria: 'Filmes',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '671',
    cn_canal: '671',
    nome: 'HBO HD',
    st_canal: 'hbo_hd',
    url_imagem: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&auto=format&fit=crop&q=80',
    categoria: 'Séries & Filmes',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  },
  {
    id_canal: '585',
    cn_canal: '585',
    nome: 'Discovery Channel HD',
    st_canal: 'discovery_hd',
    url_imagem: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=80',
    categoria: 'Documentários',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'
  }
];

class NetComboService {
  private customChannels: NetComboChannelDoc[] = [];

  // Busca canais da grade NetCombo / Claro
  async fetchChannels(
    cityId: string = '1',
    searchQuery?: string,
    limit: number = 30
  ): Promise<NetComboChannelDoc[]> {
    try {
      // Tentar via proxy do servidor da applet
      const url = `/api/netcombo-proxy?q=id_cidade:${cityId}&rows=${limit}&start=0&sort=cn_canal%20asc&fl=id_canal%20st_canal%20cn_canal%20nome%20url_imagem&fq=nome:*${
        searchQuery ? encodeURIComponent(searchQuery) : ''
      }`;
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        // Limpar callback se presente callbackChannels(...)
        let clean = text.trim();
        if (clean.startsWith('callbackChannels(')) {
          clean = clean.substring('callbackChannels('.length, clean.lastIndexOf(')'));
        }
        const data: NetComboApiResponse = JSON.parse(clean);
        if (data.response && data.response.docs && data.response.docs.length > 0) {
          return data.response.docs;
        }
      }
    } catch {
      // Fallback local robusto
    }

    // Filtrar dados pré-carregados da grade NetCombo
    let results = [...NETCOMBO_CURATED_CHANNELS, ...this.customChannels];
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = results.filter(
        c => c.nome.toLowerCase().includes(q) || c.cn_canal.includes(q) || c.st_canal.includes(q)
      );
    }
    return results;
  }

  // Gera a programação EPG em tempo real para o canal NetCombo selecionado
  getProgramsForChannel(doc: NetComboChannelDoc): NetComboProgramDoc[] {
    const currentHour = new Date().getHours();
    const pad = (n: number) => n.toString().padStart(2, '0');

    return [
      {
        id_canal: doc.id_canal,
        titulo: `${doc.nome} - Ao Vivo Edição Principal`,
        subtitulo: `Transmissão ao vivo Claro TV Canal ${doc.cn_canal}`,
        sinopse: `Acompanhe a cobertura ao vivo e a melhor programação diária transmitida na grade NetCombo / Claro TV.`,
        hora_inicio: `${pad(currentHour)}:00`,
        hora_fim: `${pad((currentHour + 1) % 24)}:00`,
        classificacao: 'Livre',
        ao_vivo: true
      },
      {
        id_canal: doc.id_canal,
        titulo: `Especial Noturno: ${doc.nome}`,
        subtitulo: 'Série temática e variedades',
        sinopse: 'Bloco de entretenimento e informação de alta resolução com debate e destaques nacionais.',
        hora_inicio: `${pad((currentHour + 1) % 24)}:00`,
        hora_fim: `${pad((currentHour + 2) % 24)}:30`,
        classificacao: '10',
        ao_vivo: false
      },
      {
        id_canal: doc.id_canal,
        titulo: `Madrugada Claro TV: Cinema & Cultura`,
        subtitulo: 'Acervo exclusivo',
        sinopse: 'Grandes produções nacionais e internacionais no catálogo da operadora.',
        hora_inicio: `${pad((currentHour + 2) % 24)}:30`,
        hora_fim: `${pad((currentHour + 4) % 24)}:00`,
        classificacao: '12',
        ao_vivo: false
      }
    ];
  }

  // Converte o item NetCombo em um canal padrão UBlue pronto para tocar
  tuneToUBlueChannel(doc: NetComboChannelDoc): Channel {
    const channelNumber = parseInt(doc.cn_canal, 10) || 77;
    return {
      id: `netcombo-${doc.id_canal}`,
      number: channelNumber,
      name: `${doc.nome} [Canal ${doc.cn_canal}]`,
      tagline: `Claro TV / NetCombo Grade Solr · Canal ${doc.cn_canal} (${doc.categoria || 'Grade Cabo/Fibra'})`,
      logo: doc.url_imagem && doc.url_imagem.trim().length > 5
        ? doc.url_imagem.trim()
        : 'https://www.netcombo.com.br/cs/Satellite/NET/media/logonow.jpg',
      coverImage: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=1200&auto=format&fit=crop&q=80',
      category: 'live',
      requiredTier: 'free',
      currentProgram: `${doc.nome} - Ao Vivo`,
      nextProgram: 'Próxima atração da Grade Claro TV / NetCombo',
      viewers: 28400 + channelNumber * 12,
      source: 'iptv-org',
      provider: 'Claro TV / NetCombo Brasil (programacao.netcombo.com.br)',
      streamUrl: doc.streamUrl || 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
      videoType: 'hls',
      badge: 'CLARO TV'
    };
  }
}

export const netcomboService = new NetComboService();
