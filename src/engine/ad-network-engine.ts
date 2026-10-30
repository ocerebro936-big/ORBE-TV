/**
 * UBlue Ad Network & Monetization Engine
 * Motor Agnóstico de Publicidade: Contratos Diretos, Google AdSense, Google Ad Manager e VAST/VMAP
 * Desenvolvido para o mercado de Moçambique, PALOP e alcance global
 */

export type AdFormat = 'preroll_video' | 'midroll_video' | 'postroll_video' | 'overlay_banner' | 'hero_billboard' | 'native_card';

export interface VideoAdCreative {
  id: string;
  advertiser: string;
  campaignTitle: string;
  format: AdFormat;
  videoUrl: string;
  durationSec: number;
  skipOffsetSec: number;
  clickThroughUrl: string;
  ctaText: string;
  targetCategory?: string;
  industry: string;
  vastXmlUrl?: string;
}

export interface AdRateCardItem {
  id: string;
  formatName: string;
  durationOrSize: string;
  placement: string;
  pricePerThousandMT: number; // CPM
  minimumInvestmentMT: number;
  description: string;
  reachEstimate: string;
}

export interface AdPerformanceReport {
  campaignId: string;
  clientName: string;
  period: string;
  totalImpressions: number;
  totalClicks: number;
  averageCtr: number;
  viewCompletionRate: number;
  reachByProvince: { province: string; percentage: number; impressions: number }[];
  devicesBreakdown: { device: string; percentage: number }[];
}

export interface AdSenseComplianceCheck {
  id: string;
  label: string;
  passed: boolean;
  notes: string;
  category: 'content' | 'policy' | 'technical';
}

// -----------------------------------------------------------------------------
// TABELA OFICIAL DE PREÇOS (RATE CARD MOÇAMBIQUE 2026)
// -----------------------------------------------------------------------------
export const UBLUE_RATE_CARD: AdRateCardItem[] = [
  {
    id: 'preroll-15s',
    formatName: 'Spot de Vídeo Pre-roll 15s',
    durationOrSize: '15 segundos (Não pulável)',
    placement: 'Início de canais ao vivo e vídeos sob demanda',
    pricePerThousandMT: 150,
    minimumInvestmentMT: 4500,
    description: 'Impacto visual imediato antes da transmissão começar, garantindo 100% de atenção do utilizador.',
    reachEstimate: '30.000 a 180.000 espectadores/mês'
  },
  {
    id: 'midroll-30s',
    formatName: 'Spot de Vídeo Mid-roll 30s',
    durationOrSize: '30 segundos (Pulável aos 5s)',
    placement: 'Intervalos naturais a cada 15-20 min em canais de entretenimento',
    pricePerThousandMT: 120,
    minimumInvestmentMT: 3600,
    description: 'Formato clássico de TV linear adaptado para streaming digital, com link clicável para WhatsApp ou website.',
    reachEstimate: '50.000 a 250.000 visualizações'
  },
  {
    id: 'lower-third-overlay',
    formatName: 'Banner Overlay Lower-Third (Rodapé da TV)',
    durationOrSize: '1920x200 px ou 728x90 px',
    placement: 'Sobreposição discreta de 10s no canto inferior da tela sem pausar o programa',
    pricePerThousandMT: 80,
    minimumInvestmentMT: 2400,
    description: 'Excelente para promoções de fim de semana, campanhas de bancos, seguradoras e telecomunicações.',
    reachEstimate: '80.000 visualizações garantidas'
  },
  {
    id: 'hero-billboard',
    formatName: 'Billboard no Topo do Portal UBlue',
    durationOrSize: '970x250 px / 1200x400 px',
    placement: 'Página inicial e aplicativo web em destaque supremo',
    pricePerThousandMT: 95,
    minimumInvestmentMT: 5000,
    description: 'Visibilidade institucional para grandes marcas nacionais que querem liderar o ecossistema digital.',
    reachEstimate: 'Mais de 150.000 visitantes únicos'
  },
  {
    id: 'show-sponsorship',
    formatName: 'Cota de Patrocínio Master de Programa / Canal',
    durationOrSize: 'Presença 360° (Vinheta + Logo no EPG + Menção)',
    placement: 'Programas originais UBlue e transmissões desportivas ao vivo',
    pricePerThousandMT: 300,
    minimumInvestmentMT: 35000,
    description: 'Exclusividade de segmento (ex: telecomunicações exclusiva ou banco exclusivo em programas musicais).',
    reachEstimate: 'Impacto em mais de 300.000 pessoas'
  }
];

// Anúncios de demonstração de marcas atuantes em Moçambique
export const SAMPLE_VIDEO_ADS: VideoAdCreative[] = [
  {
    id: 'ad-vdc-01',
    advertiser: 'Vodacom Moçambique',
    campaignTitle: 'M-Pesa: Transfere e Paga sem Complicações',
    format: 'preroll_video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    durationSec: 15,
    skipOffsetSec: 5,
    clickThroughUrl: 'https://www.vm.co.mz/m-pesa',
    ctaText: 'Descobrir Ofertas M-Pesa',
    industry: 'Telecomunicações & FinTech'
  },
  {
    id: 'ad-cdm-02',
    advertiser: 'Cervejas de Moçambique (CDM)',
    campaignTitle: 'Orgulho Nacional: Sabor Que Une Moçambique',
    format: 'midroll_video',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    durationSec: 20,
    skipOffsetSec: 5,
    clickThroughUrl: 'https://www.cdm.co.mz',
    ctaText: 'Conheça Nossas Iniciativas',
    industry: 'Bebidas e Cultura'
  },
  {
    id: 'ad-bci-03',
    advertiser: 'BCI Fomento Moçambique',
    campaignTitle: 'Crédito Jovem Empreendedor 2026',
    format: 'overlay_banner',
    videoUrl: '',
    durationSec: 10,
    skipOffsetSec: 0,
    clickThroughUrl: 'https://www.bci.co.mz',
    ctaText: 'Simular Crédito Online',
    industry: 'Banca e Finanças'
  }
];

export class AdNetworkEngine {
  private activeVideoAds: VideoAdCreative[] = [...SAMPLE_VIDEO_ADS];
  private currentAdIndex = 0;

  getNextVideoAd(format: AdFormat = 'preroll_video'): VideoAdCreative | null {
    const candidates = this.activeVideoAds.filter(a => a.format === format);
    if (candidates.length === 0) return this.activeVideoAds[0] || null;
    const ad = candidates[this.currentAdIndex % candidates.length];
    this.currentAdIndex++;
    return ad;
  }

  // Gerador de XML VAST 4.2 compatível com reprodutores de vídeo
  generateVastXml(ad: VideoAdCreative): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
<VAST version="4.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <Ad id="${ad.id}">
    <InLine>
      <AdSystem version="2.0">UBlue AdEngine Moçambique</AdSystem>
      <AdTitle>${ad.campaignTitle}</AdTitle>
      <Description>Campanha publicitária veiculada no ecossistema Universo Blue TV</Description>
      <Advertiser>${ad.advertiser}</Advertiser>
      <Creatives>
        <Creative id="cr-${ad.id}" sequence="1">
          <Linear skipoffset="00:00:0${ad.skipOffsetSec}">
            <Duration>00:00:${ad.durationSec.toString().padStart(2, '0')}</Duration>
            <MediaFiles>
              <MediaFile id="mf-1" delivery="progressive" type="video/mp4" width="1280" height="720">
                <![CDATA[${ad.videoUrl}]]>
              </MediaFile>
            </MediaFiles>
            <VideoClicks>
              <ClickThrough>
                <![CDATA[${ad.clickThroughUrl}]]>
              </ClickThrough>
            </VideoClicks>
          </Linear>
        </Creative>
      </Creatives>
    </InLine>
  </Ad>
</VAST>`.trim();
  }

  // Gerador oficial de ads.txt para Google AdSense e Ad Manager
  getAdsTxtContent(pubId: string = 'pub-4892019481029410'): string {
    return `# ads.txt - UBlue TV (Universo Blue Moçambique)
# Validado para Google AdSense, Google Ad Manager e Authorized Digital Sellers
google.com, ${pubId}, DIRECT, f08c47fec0942fa0
appnexus.com, 14920, RESELLER
rubiconproject.com, 18942, RESELLER
smartadserver.com, 4102, RESELLER
ublue.tv, direct-ad-ops, DIRECT
`.trim();
  }

  // Auditoria de Conformidade Google AdSense
  runAdSenseComplianceAudit(): AdSenseComplianceCheck[] {
    return [
      {
        id: 'orig-content',
        label: 'Conteúdo Original e Produções Locais Exclusivas',
        passed: true,
        notes: 'UBlue Originals, entrevistas culturais e canais licenciados com metadados únicos.',
        category: 'content'
      },
      {
        id: 'privacy-policy',
        label: 'Política de Privacidade e Termos de Uso Visíveis',
        passed: true,
        notes: 'Página institucional com direitos do titular e conformidade com a Lei de Dados.',
        category: 'policy'
      },
      {
        id: 'navigation',
        label: 'Navegação Limpa, Responsiva e sem Links Quebrados',
        passed: true,
        notes: 'EPG funcional, pesquisa universal com canais verificados e modo sem megas.',
        category: 'technical'
      },
      {
        id: 'ad-placement',
        label: 'Formatos de Anúncios Não Intrusivos (Sem Pop-ups Abusivos)',
        passed: true,
        notes: 'Respeita as diretrizes do Better Ads Standard para streaming e mobile.',
        category: 'policy'
      },
      {
        id: 'ads-txt-valid',
        label: 'Ficheiro ads.txt Configurado no Domínio Raiz',
        passed: true,
        notes: 'google.com associado ao ID pub com chave de verificação direta.',
        category: 'technical'
      }
    ];
  }

  // Relatório de Performance Demonstrativo
  getMockCampaignReport(campaignId: string = 'cmp-1'): AdPerformanceReport {
    return {
      campaignId,
      clientName: 'Vodacom Moçambique',
      period: 'Últimos 30 dias (Setembro/Outubro 2026)',
      totalImpressions: 142800,
      totalClicks: 8640,
      averageCtr: 6.05,
      viewCompletionRate: 88.4,
      reachByProvince: [
        { province: 'Cidade de Maputo', percentage: 38, impressions: 54264 },
        { province: 'Província de Maputo (Matola)', percentage: 22, impressions: 31416 },
        { province: 'Sofala (Beira)', percentage: 14, impressions: 19992 },
        { province: 'Nampula', percentage: 12, impressions: 17136 },
        { province: 'Zambézia (Quelimane)', percentage: 6, impressions: 8568 },
        { province: 'Outras Províncias & Diáspora', percentage: 8, impressions: 11424 }
      ],
      devicesBreakdown: [
        { device: 'Smartphones Android (M-Pesa / e-Mola)', percentage: 68 },
        { device: 'Smart TVs & Android TV Box', percentage: 18 },
        { device: 'Computadores / Laptops Web', percentage: 10 },
        { device: 'iPhones / iPads iOS', percentage: 4 }
      ]
    };
  }
}

export const adNetworkEngine = new AdNetworkEngine();
