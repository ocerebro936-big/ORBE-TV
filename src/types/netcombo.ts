/**
 * NetCombo / Claro TV Brasil EPG & Channel Lineup Types
 * Baseado na API Solr Gatekeeper do portal de programação da Claro/NET
 */

export interface NetComboChannelDoc {
  id_canal: string;
  cn_canal: string;      // Número do canal (ex: "1", "4", "500")
  nome: string;          // Nome de exibição (ex: "TV Brasil", "NOW")
  st_canal: string;      // Slug identificador (ex: "tv_brasil")
  url_imagem: string;    // Logo do canal
  categoria?: string;    // Categoria inferida (Abertos, Notícias, Filmes, Esportes, Infantil)
  streamUrl?: string;    // Stream HLS associado
}

export interface NetComboProgramDoc {
  id_programa?: string;
  id_canal: string;
  titulo: string;
  subtitulo?: string;
  sinopse?: string;
  hora_inicio: string;   // ex: "14:00"
  hora_fim: string;      // ex: "15:30"
  classificacao?: string;// ex: "Livre", "10", "12", "14", "16"
  ao_vivo?: boolean;
}

export interface NetComboApiResponse {
  response: {
    docs: NetComboChannelDoc[];
    numFound: number;
    start: number;
  };
  responseHeader: {
    status: number;
    QTime: number;
    params: Record<string, string>;
  };
}
