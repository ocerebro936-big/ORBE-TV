export type WireframePlatformId = 'website' | 'admin' | 'mobile' | 'smart-tv';

export interface WireframeScreenSpec {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  platform: WireframePlatformId;
  route: string;
  objective: string;
  keyComponents: string[];
  gridSystem: string;
  responsiveBreakpoints: string;
  userActions: string[];
  designTokens: {
    primaryColor: string;
    backgroundColor: string;
    typography: string;
    spacing: string;
  };
  wireframeZones: {
    zoneName: string;
    description: string;
    componentType: string;
    dimensions: string;
  }[];
  uxNotes: string[];
  acceptanceCriteria: string[];
}

export interface PlatformMetadata {
  id: WireframePlatformId;
  name: string;
  badge: string;
  icon: string;
  aspectRatio: string;
  targetDevices: string;
  inputMethods: string;
  screens: WireframeScreenSpec[];
}

export const UBLUE_WIREFRAME_SPECS: Record<WireframePlatformId, PlatformMetadata> = {
  website: {
    id: 'website',
    name: 'Website & Web Portal',
    badge: 'Desktop / Laptop (1920x1080 / 1440x900)',
    icon: 'Globe',
    aspectRatio: '16:9 Responsive Web',
    targetDevices: 'Navegadores Chrome, Firefox, Safari, Edge (Desktop, Tablets)',
    inputMethods: 'Rato, Teclado, Touch (Tablets)',
    screens: [
      {
        id: 'web-home',
        code: 'WEB-01',
        title: 'Portal Principal & Landing Page',
        subtitle: 'Vitrine de streaming, transmissão ao vivo em destaque, pacotes M-Pesa e conversão',
        platform: 'website',
        route: '/',
        objective: 'Apresentar a marca UBlue TV, destacar o canal ao vivo 24/7, converter visitantes em subscritores e facilitar o acesso ao Web Player.',
        keyComponents: [
          'Global Top Navigation (Logo, Menus, Busca, Carteira, Botão Assistir, Perfil)',
          'Hero Section com Vídeo Player Live em destaque e Badges dinâmicos',
          'Carrossel Horizontal de Categorias Rápidas com ícones',
          'Tabela de Pacotes de Assinatura (Livre, Start, Basic, Médio, Max) em MT',
          'Vitrine de Canais Parceiros e Seção UBlue Originals Be Universe',
          'Secção de Download das Apps Mobile e Smart TV',
          'Footer com dados regulatórios (INCM/ARECOM), Termos e Suporte'
        ],
        gridSystem: '12 Colunas Fluidas (Max-width 1280px / 1440px), Gutter 24px, Margem Externa 32px/48px',
        responsiveBreakpoints: 'Desktop XL (≥1440px), Desktop LG (≥1024px), Tablet MD (≥768px), Mobile SM (<768px)',
        userActions: [
          'Clicar em "Assistir Agora" para abrir o Web Player diretamente',
          'Escolher pacote e abrir modal de pagamento M-Pesa / E-Mola',
          'Filtrar canais por categoria com 1 clique',
          'Aceder à Carteira UBlue Wallet e aos hubs Be Universe'
        ],
        designTokens: {
          primaryColor: '#2563EB (Blue-600) & #06B6D4 (Cyan-500)',
          backgroundColor: '#050814 (Deep Night Navy)',
          typography: 'Inter / Plus Jakarta Sans (Headings 32-48px Bold, Body 14-16px)',
          spacing: '8pt Grid (8px, 16px, 24px, 32px, 48px, 64px)'
        },
        wireframeZones: [
          { zoneName: 'Header Bar', description: 'Navegação fixa com transparência e blur ao rolar', componentType: 'Navbar', dimensions: '100% x 80px' },
          { zoneName: 'Hero Stage', description: 'Player 16:9 ao vivo + Título + Sinopse + CTA Duplo', componentType: 'HeroStreamPlayer', dimensions: '100% x 580px' },
          { zoneName: 'Categories Rail', description: 'Chips horizontais com contagem de canais ativos', componentType: 'CategorySlider', dimensions: '100% x 72px' },
          { zoneName: 'Subscription Matrix', description: '5 Cards de preços com badge de popularidade e botão M-Pesa', componentType: 'PricingGrid', dimensions: '100% x 520px' },
          { zoneName: 'Originals Showcase', description: 'Carrossel de pôsteres Be Universe com hover cards', componentType: 'MediaCarousel', dimensions: '100% x 380px' },
          { zoneName: 'Footer Block', description: 'Links institucionais, métodos de pagamento e copyright', componentType: 'Footer', dimensions: '100% x 280px' }
        ],
        uxNotes: [
          'O Hero player inicia com som silenciado (autoplay com mute) e botão de áudio visível para conformidade com navegadores modernos.',
          'Os cartões de planos mostram valores em Meticais (MT) claros, sem taxas ocultas.',
          'Transições suaves com hardware acceleration para carrosséis.'
        ],
        acceptanceCriteria: [
          'Tempo de carregamento inicial < 1.8 segundos no POP Maputo.',
          'CTA "Assistir Agora" visível acima da dobra (above the fold) em qualquer resolução desktop.',
          'Fluxo de checkout M-Pesa disparável em menos de 2 cliques.'
        ]
      },
      {
        id: 'web-player',
        code: 'WEB-02',
        title: 'Web Player Ao Vivo & Catch-Up TV',
        subtitle: 'Ambiente de visualização com player HLS adaptativo, EPG lateral e chat moderado',
        platform: 'website',
        route: '/player/live/:channelId',
        objective: 'Oferecer a melhor experiência de consumo de vídeo contínuo com baixa latência, troca rápida de canais e programação EPG.',
        keyComponents: [
          'Vídeo Player HLS/DASH 16:9 com scrubber bar e buffer health indicator',
          'Controle de Qualidade Adaptativa (Auto, 1080p, 720p, 480p, 360p)',
          'Modo DVR de 2 horas para retroceder emissão ao vivo',
          'Painel Lateral Alternável: EPG (Guia de Programação) vs. Chat ao Vivo',
          'Barra de Canais Rápidos inferior (Quick Channel Switcher)',
          'Botão PiP (Picture-in-Picture) e Modo Tela Cheia com atalho F'
        ],
        gridSystem: 'Layout Split: 75% Player Stage + 25% Sidebar (Desktop). No mobile colapsa verticalmente.',
        responsiveBreakpoints: 'Desktop (≥1200px 2 colunas), Tablet/Mobile (<1200px stack vertical)',
        userActions: [
          'Alternar resolução e taxa de bits manualmente ou modo Auto',
          'Navegar pelo guia EPG para ver sinopses de programas anteriores e seguintes',
          'Enviar mensagens no chat ao vivo integrado com moderação',
          'Trocar de canal sem recarregar a página com troca instantânea de stream HLS'
        ],
        designTokens: {
          primaryColor: '#3B82F6 (Blue-500)',
          backgroundColor: '#03050c (Pure Cinema Dark)',
          typography: 'Plus Jakarta Sans + Monospace para Timecodes e Bitrate',
          spacing: 'Padding reduzido no player (4px-8px) para imersão total'
        },
        wireframeZones: [
          { zoneName: 'Player Canvas', description: 'Área de vídeo 16:9 com overlay de controles auto-hide', componentType: 'HlsVideoPlayer', dimensions: '75% Largura x 100% Altura' },
          { zoneName: 'Player OSD', description: 'Controles: Play, Scrubber, Volume, Qualidade, Legenda, PiP, Fullscreen', componentType: 'PlayerControls', dimensions: 'Overlay 100% x 56px' },
          { zoneName: 'Live Sidebar', description: 'Abas "Programação EPG" e "Comentários ao Vivo"', componentType: 'EpgChatSidebar', dimensions: '25% Largura x 100% Altura' },
          { zoneName: 'Channel Switcher', description: 'Carrossel de canais relacionados abaixo do player', componentType: 'ChannelStrip', dimensions: '100% x 96px' }
        ],
        uxNotes: [
          'Os controles do player desaparecem após 3 segundos de inatividade do cursor.',
          'Suporte nativo a atalhos de teclado: Barra de espaço (Pause), F (Fullscreen), M (Mute), Setas (Volume/Seek).'
        ],
        acceptanceCriteria: [
          'Latência de streaming < 4 segundos via HLS Low-Latency.',
          'Troca de canal com tempo de buffer inicial < 1.2 segundos.'
        ]
      },
      {
        id: 'web-vod-catalog',
        code: 'WEB-03',
        title: 'Catálogo de Conteúdo VOD & Filtros',
        subtitle: 'Exploração de Filmes, Séries, Reality Shows Be Universe, Podcasts e Rádios',
        platform: 'website',
        route: '/catalogo',
        objective: 'Permitir busca rápida, filtragem por gêneros e exploração de conteúdos gravados sob demanda.',
        keyComponents: [
          'Barra de Filtros (Gêneros, Idiomas locais: Changana/Macua/Português, Ano, Classificação)',
          'Campo de Busca Instantânea com auto-completar inteligente',
          'Banner em destaque com trailer em miniatura',
          'Grid de Pôsteres 2:3 responsivo com badges de resolução (4K, HD) e plano exigido',
          'Hover Card com sinopse, duração, elenco e botão "+ Minha Lista"'
        ],
        gridSystem: 'Grid responsivo: 6 colunas (≥1440px), 4 colunas (1024px), 3 colunas (768px), 2 colunas (<768px)',
        responsiveBreakpoints: 'Fluid 12-column com gap de 16px',
        userActions: [
          'Aplicar múltiplos filtros combinados (ex: Originais + Gratuito)',
          'Passar cursor sobre o card para ver sinopse expandida',
          'Adicionar à lista de favoritos com 1 clique'
        ],
        designTokens: {
          primaryColor: '#06B6D4 (Cyan-500)',
          backgroundColor: '#050814',
          typography: 'Plus Jakarta Sans',
          spacing: 'Gap de 16px entre pôsteres'
        },
        wireframeZones: [
          { zoneName: 'Filter Bar', description: 'Filtros rápidos em pills clicáveis e dropdowns de ordenação', componentType: 'FilterToolbar', dimensions: '100% x 64px' },
          { zoneName: 'Featured Hero VOD', description: 'Destaque editorial com botão de reproduzir trailer', componentType: 'VodFeaturedHero', dimensions: '100% x 340px' },
          { zoneName: 'Content Grid', description: 'Cartões de pôsteres com paginação infinita / virtualizada', componentType: 'PosterGrid', dimensions: '100% x Dinâmico' }
        ],
        uxNotes: [
          'Pôsteres utilizam imagens otimizadas em WebP com lazy-loading e placeholders com shimmer.',
          'Hover card só abre após 250ms de descanso do mouse para evitar aberturas acidentais durante rolagem.'
        ],
        acceptanceCriteria: [
          'Resultados de busca exibidos em menos de 200ms.',
          'Cards com indicação clara se o utilizador já tem acesso ou precisa de upgrade.'
        ]
      },
      {
        id: 'web-checkout',
        code: 'WEB-04',
        title: 'Checkout & Pagamentos M-Pesa / E-Mola',
        subtitle: 'Fluxo de pagamento móvel moçambicano em 2 passos com ativação imediata',
        platform: 'website',
        route: '/checkout/:planTier',
        objective: 'Oferecer checkout com a menor fricção possível suportando M-Pesa da Vodacom e E-Mola da Movitel.',
        keyComponents: [
          'Resumo do Pacote Selecionado com valor em Meticais (MT) e benefícios',
          'Seletor Visual de Método (Vodacom M-Pesa, Movitel E-Mola, Cartão Bancário)',
          'Input de Número de Telefone (+258 84/85 ou 86/87) com máscara automática',
          'Tela de Aguardo USSD Push com contagem regressiva de 60s e animação',
          'Comprovativo de Sucesso com ID de Transação e botão "Começar a Assistir"'
        ],
        gridSystem: 'Card centralizado de 560px max-width com sombra profunda e blur de fundo',
        responsiveBreakpoints: 'Full width com margem de 16px no mobile',
        userActions: [
          'Inserir número de telefone',
          'Clicar em "Confirmar e Pagar"',
          'Aceitar a notificação USSD no telemóvel introduzindo o PIN do M-Pesa',
          'Receber confirmação instantânea via WebSocket/Polling'
        ],
        designTokens: {
          primaryColor: '#E60000 (M-Pesa Red) & #FF6600 (E-Mola Orange) & #2563EB (UBlue)',
          backgroundColor: '#0a0f26 com bordas em slate-800',
          typography: 'Plus Jakarta Sans Bold + Números monoespaçados',
          spacing: '16px e 24px de espaçamento interno'
        },
        wireframeZones: [
          { zoneName: 'Order Summary', description: 'Nome do pacote, periodicidade e valor total em MT', componentType: 'PlanReceiptCard', dimensions: '100% x 120px' },
          { zoneName: 'Payment Method Selector', description: 'Radio buttons estilizados com logos oficiais das operadoras', componentType: 'OperatorSelector', dimensions: '100% x 90px' },
          { zoneName: 'MSISDN Form', description: 'Input formatado para números móveis moçambicanos', componentType: 'PhoneInputGroup', dimensions: '100% x 80px' },
          { zoneName: 'USSD Status Pulse', description: 'Feedback visual enquanto a API aguarda o PIN no celular', componentType: 'UssdPollingIndicator', dimensions: '100% x 140px' }
        ],
        uxNotes: [
          'Indica claramente que o utilizador deve olhar para o ecrã do seu telemóvel para digitar o PIN seguro do M-Pesa.',
          'Nunca pede a senha ou PIN do M-Pesa na página web por razões estritas de segurança bancária.'
        ],
        acceptanceCriteria: [
          'Ativação do serviço em menos de 3 segundos após recepção do webhook com status "completed".'
        ]
      },
      {
        id: 'web-user-profile',
        code: 'WEB-05',
        title: 'Painel do Utilizador & Gestão de Dispositivos',
        subtitle: 'Perfil pessoal, controlo de assinaturas ativas, histórico e sessões',
        platform: 'website',
        route: '/minha-conta',
        objective: 'Dar controlo total ao assinante sobre a sua subscrição, dispositivos conectados e histórico.',
        keyComponents: [
          'Status da Assinatura Atual com dias restantes e botão de renovação',
          'Seletor de Perfis da Conta (Adulto, Kids com PIN de segurança)',
          'Lista de Dispositivos Ativos com botão de desconexão remota',
          'Minha Lista (Favoritos salvos) e Continuar a Assistir com progresso %',
          'Histórico de Faturas e Recibos fiscais para download'
        ],
        gridSystem: 'Grid 2 Colunas: Menu lateral 260px + Área de Conteúdo fluido',
        responsiveBreakpoints: 'Tablet e Mobile colapsam menu para abas horizontais no topo',
        userActions: [
          'Trocar ou fazer upgrade de pacote com cálculo proporcional',
          'Encerrar sessão em TV de hotel ou dispositivo desconhecido',
          'Gerir lista de favoritos e apagar histórico'
        ],
        designTokens: {
          primaryColor: '#3B82F6',
          backgroundColor: '#060a1e',
          typography: 'Plus Jakarta Sans',
          spacing: '24px em cartões organizados'
        },
        wireframeZones: [
          { zoneName: 'Profile Header', description: 'Avatar, nome, telefone e status da assinatura', componentType: 'ProfileSummaryCard', dimensions: '100% x 110px' },
          { zoneName: 'Subscription Details', description: 'Plano atual, data de término e atalho de renovação', componentType: 'SubscriptionWidget', dimensions: '100% x 140px' },
          { zoneName: 'Device Manager', description: 'Tabela de navegadores, TVs e celulares autorizados', componentType: 'DeviceSessionList', dimensions: '100% x 180px' },
          { zoneName: 'Watchlist Grid', description: 'Carrossel de conteúdos favoritados para acesso rápido', componentType: 'WatchlistCarousel', dimensions: '100% x 220px' }
        ],
        uxNotes: [
          'Mostra o número de telas simultâneas em uso em tempo real (ex: "1 de 3 ecrãs em utilização").'
        ],
        acceptanceCriteria: [
          'Revogação de dispositivo encerra o stream ativo em até 5 segundos via WebSocket.'
        ]
      }
    ]
  },

  admin: {
    id: 'admin',
    name: 'Painel Administrativo (Control Plane)',
    badge: 'Desktop NOC / Backoffice (1920x1080)',
    icon: 'Shield',
    aspectRatio: '16:9 Dashboard Profissional',
    targetDevices: 'Estações de trabalho dos operadores, engenheiros de streaming e diretores de canal',
    inputMethods: 'Teclado e Rato com suporte a atalhos de monitorização',
    screens: [
      {
        id: 'adm-dashboard',
        code: 'ADM-01',
        title: 'Executive Dashboard & NOC Streaming',
        subtitle: 'Monitorização em tempo real de audiência, finanças M-Pesa e saúde do CDN',
        platform: 'admin',
        route: '/admin/dashboard',
        objective: 'Oferecer visão panorâmica e imediata dos sinais vitais da plataforma OTT: espectadores, receita, canais e infraestrutura.',
        keyComponents: [
          'Cards de Métricas Principais: Receita Hoje (MT), Subscritores Ativos, Espectadores Ao Vivo (CCU), Largura de Banda CDN (Gbps)',
          'Gráfico de Audiência em Tempo Real com pico do dia',
          'Mapa de Calor de POPs Moçambique (Maputo, Beira, Nampula, Internacional)',
          'Feed de Alertas Críticos do Sistema (Falha RTMP, latência de transcodificação)',
          'Tabela de Transações Recentes via M-Pesa e E-Mola com status em tempo real'
        ],
        gridSystem: 'Grid modular 12 colunas com cartões de dashboard auto-ajustáveis',
        responsiveBreakpoints: 'Otimizado para resoluções 1080p e 1440p (mínimo 1280px)',
        userActions: [
          'Filtrar período (Última hora, Hoje, 7 dias, Mês)',
          'Clicar em alerta de canal para ir diretamente ao monitor de transcodificação',
          'Exportar relatório executivo instantâneo'
        ],
        designTokens: {
          primaryColor: '#3B82F6 (Blue) & #10B981 (Emerald)',
          backgroundColor: '#040714 (Dark High-Density Console)',
          typography: 'Plus Jakarta Sans + Monospace para métricas e logs',
          spacing: '16px gutter de alta densidade informativa'
        },
        wireframeZones: [
          { zoneName: 'Admin Top Bar', description: 'Pesquisa global, status do cluster Kubernetes e perfil admin', componentType: 'AdminHeader', dimensions: '100% x 64px' },
          { zoneName: 'Admin Sidebar', description: 'Menu colapsável com ícones de Canais, VOD, Utilizadores, Financeiro, Ads', componentType: 'SidebarNav', dimensions: '240px x 100%' },
          { zoneName: 'KPI Metric Grid', description: '4 cards com variação percentual vs semana anterior', componentType: 'MetricCardsRow', dimensions: '100% x 110px' },
          { zoneName: 'Realtime Telemetry Stage', description: 'Gráfico duplo de visualizadores concorrentes + consumo CDN', componentType: 'LiveChartsStage', dimensions: '100% x 340px' },
          { zoneName: 'NOC & POP Health', description: 'Indicadores dos nós de Maputo, Beira e Nampula', componentType: 'PopHealthCards', dimensions: '100% x 180px' }
        ],
        uxNotes: [
          'Atualização de telemetria sem recarregar a página a cada 3 segundos via WebSocket seguro.',
          'Uso de alertas sonoros suaves para eventos críticos de perda de sinal de canal.'
        ],
        acceptanceCriteria: [
          'Dashboard consome menos de 4% de CPU no navegador do operador.',
          'Alertas visuais diferenciam severidade: Info (azul), Aviso (amarelo), Crítico (vermelho).'
        ]
      },
      {
        id: 'adm-content-manager',
        code: 'ADM-02',
        title: 'Gestão de Canais & Transcoding Ladder',
        subtitle: 'Configuração de entradas RTMP/SRT, multi-bitrate HLS e agendamento EPG',
        platform: 'admin',
        route: '/admin/canais',
        objective: 'Gerir streams de canais lineares 24/7, verificar chaves de ingestão e monitorizar qualidade do encoder.',
        keyComponents: [
          'Tabela de Canais Ativos com thumbnail ao vivo em miniatura',
          'Credenciais de Ingestão Segura: RTMP Ingest URL + SRT Passphrase',
          'Monitor de Transcoding Ladder (1080p, 720p, 480p, 360p) com FPS e perda de quadros',
          'Agendador de Guia de Programação (EPG) com importação XMLTV',
          'Botão de Emergência "Sinal de Espera" (Slate de manutenção)'
        ],
        gridSystem: 'Grid 2 Colunas: Lista de Canais 40% + Inspetor de Stream em Tempo Real 60%',
        responsiveBreakpoints: 'Desktop ≥1280px',
        userActions: [
          'Gerar nova chave de stream para emissora parceira',
          'Visualizar preview do encoder ao vivo com informações de codec (H.264/AAC)',
          'Carregar arquivo XMLTV com a programação semanal do canal'
        ],
        designTokens: {
          primaryColor: '#06B6D4 (Cyan)',
          backgroundColor: '#040714',
          typography: 'Plus Jakarta Sans + JetBrains Mono para URLs de Ingest',
          spacing: '16px'
        },
        wireframeZones: [
          { zoneName: 'Channel Table', description: 'Lista com status verde (Online) / cinzento (Offline) e botões de ação', componentType: 'ChannelListTable', dimensions: '40% x 600px' },
          { zoneName: 'Stream Inspector', description: 'Preview com estatísticas: Resolução real, Bitrate de entrada, Keyframe interval', componentType: 'StreamInspectorPanel', dimensions: '60% x 600px' },
          { zoneName: 'Ingest Credentials Box', description: 'Campos com botão de copiar para OBS Studio / vMix / Teradek', componentType: 'IngestCredentialsCard', dimensions: '100% x 140px' }
        ],
        uxNotes: [
          'Chaves de stream são mascaradas com asteriscos e exigem clique para revelar para prevenir vazamento em transmissões de tela.'
        ],
        acceptanceCriteria: [
          'Status do canal reflete sinal de vídeo em menos de 1 segundo.'
        ]
      },
      {
        id: 'adm-users-rbac',
        code: 'ADM-03',
        title: 'Gestão de Utilizadores, Assinantes & RBAC',
        subtitle: 'Administração de subscrições, números de telefone moçambicanos e permissões',
        platform: 'admin',
        route: '/admin/utilizadores',
        objective: 'Consultar assinantes, verificar status de pagamento, gerir permissões da equipa e aplicar upgrades manuais.',
        keyComponents: [
          'Tabela de Utilizadores com busca por Telefone (+258), Nome e Email',
          'Filtros rápidos por Plano (Livre, Start, Basic, Médio, Max) e Status (Ativo, Expirado)',
          'Drawer Lateral de Detalhes do Utilizador com histórico de pagamentos e histórico de sessões',
          'Ações Rápidas: Conceder dias bónus, reenviar notificação SMS, suspender conta',
          'Matriz de Papéis RBAC (Super Admin, Suporte, Financeiro, Gestor de Conteúdo)'
        ],
        gridSystem: 'Tabela de alta densidade com paginação e gaveta lateral expansível',
        responsiveBreakpoints: 'Desktop',
        userActions: [
          'Buscar assinante por número M-Pesa para atendimento de suporte',
          'Visualizar logs de acesso e dispositivos utilizados pelo assinante',
          'Exportar base filtrada para CSV'
        ],
        designTokens: {
          primaryColor: '#3B82F6',
          backgroundColor: '#050817',
          typography: 'Plus Jakarta Sans',
          spacing: '8px e 16px'
        },
        wireframeZones: [
          { zoneName: 'Search & Filters Bar', description: 'Busca instantânea e dropdowns de pacote', componentType: 'FilterToolbar', dimensions: '100% x 64px' },
          { zoneName: 'Users Data Grid', description: 'Colunas: ID, Nome, Telefone, Plano, Expiração, Dispositivos, Ações', componentType: 'UsersTable', dimensions: '100% x 500px' },
          { zoneName: 'User Details Drawer', description: 'Painel deslizante com linha do tempo de eventos do assinante', componentType: 'UserDetailsDrawer', dimensions: '480px x 100%' }
        ],
        uxNotes: [
          'Números de telefone possuem link direto para abrir conversa de suporte no WhatsApp Web com um clique.'
        ],
        acceptanceCriteria: [
          'Pesquisa por telefone retorna resultados em menos de 100ms.'
        ]
      },
      {
        id: 'adm-financial-reconciliation',
        code: 'ADM-04',
        title: 'Financeiro & Reconciliação M-Pesa / E-Mola',
        subtitle: 'Extrato de liquidações das operadoras, comissões e repasses a parceiros',
        platform: 'admin',
        route: '/admin/financeiro',
        objective: 'Garantir que cada Metical cobrado via M-Pesa ou E-Mola está devidamente auditado e reconciliado com o banco.',
        keyComponents: [
          'Resumo Financeiro: Receita Bruta (MT), Taxas de Operadora (MT), Receita Líquida (MT), Saldo a Repassar',
          'Extrato Detalhado de Transações com ID Externo M-Pesa (ex: "NL4839...") e Callback status',
          'Módulo de Reconciliação Bancária: Upload de extrato Vodacom/Movitel para cruzamento automático',
          'Calculadora de Repasse para Emissoras Parceiras e Criadores Be Universe',
          'Gráfico de Arrecadação por Operadora (M-Pesa vs E-Mola vs Cartão)'
        ],
        gridSystem: 'Grid 12 colunas com tabela financeira auditável',
        responsiveBreakpoints: 'Desktop',
        userActions: [
          'Consultar status de transação pendente via API M-Pesa',
          'Gerar folha de pagamento de parceiros com base em minutos assistidos',
          'Emitir relatório em PDF para contabilidade e auditoria'
        ],
        designTokens: {
          primaryColor: '#10B981 (Emerald para finanças)',
          backgroundColor: '#040714',
          typography: 'Plus Jakarta Sans + Monospace para valores numéricos em MT',
          spacing: '16px'
        },
        wireframeZones: [
          { zoneName: 'Financial Summary Header', description: 'Cards com faturamento do dia, semana e mês em MT', componentType: 'FinancialKpis', dimensions: '100% x 120px' },
          { zoneName: 'Reconciliation Status Box', description: 'Indicador de divergências entre API e extrato bancário', componentType: 'AuditAlertBox', dimensions: '100% x 70px' },
          { zoneName: 'Transactions Ledger', description: 'Tabela com Timestamp, ID Transação, Provedor, Valor, Status, Recibo', componentType: 'TransactionLedgerTable', dimensions: '100% x 520px' }
        ],
        uxNotes: [
          'Transações suspeitas de duplicidade ou estorno são destacadas em amarelo com botão de investigação imediata.'
        ],
        acceptanceCriteria: [
          '100% de rastreabilidade entre o ID da subscrição UBlue e o ID de transação bancária M-Pesa.'
        ]
      },
      {
        id: 'adm-ad-server',
        code: 'ADM-05',
        title: 'Servidor de Anúncios (AVOD) & Patrocínios',
        subtitle: 'Gestão de campanhas Pre-roll, Mid-roll, VAST/VMAP e banners',
        platform: 'admin',
        route: '/admin/anuncios',
        objective: 'Monetizar espectadores do plano Gratuito (Livre) e eventos abertos através de publicidade direcionada.',
        keyComponents: [
          'Gestor de Campanhas com data de início/fim e cota de impressões contratadas',
          'Configurador de Inserção: Pre-roll (antes do vídeo), Mid-roll (intervalos), Overlay banner',
          'Segmentação Geográfica (Províncias: Maputo, Sofala, Nampula, Tete) e por Categoria',
          'Relatório de Performance: Impressões, VTR (Taxa de Conclusão de Vídeo) e CTR',
          'Upload de criativos MP4 em 1080p com normalização de áudio para -24 LKFS'
        ],
        gridSystem: 'Grid 12 colunas com formulário de criação e lista de campanhas ativas',
        responsiveBreakpoints: 'Desktop',
        userActions: [
          'Criar nova campanha publicitária para marca parceira',
          'Definir pontos de cue point para inserção dinâmica de anúncios (SSAI / CSAI)',
          'Pausar ou estender campanha com 1 clique'
        ],
        designTokens: {
          primaryColor: '#F59E0B (Amber)',
          backgroundColor: '#040714',
          typography: 'Plus Jakarta Sans',
          spacing: '16px'
        },
        wireframeZones: [
          { zoneName: 'Campaign Metrics Summary', description: 'Total de impressões servidas no mês e receita estimada em MT', componentType: 'AdMetricsRow', dimensions: '100% x 100px' },
          { zoneName: 'Campaigns List', description: 'Tabela de anunciantes ativos, status e progresso de entrega', componentType: 'CampaignsTable', dimensions: '65% x 500px' },
          { zoneName: 'Targeting Inspector', description: 'Painel de segmentação por canal, horário e localização', componentType: 'TargetingConfigPanel', dimensions: '35% x 500px' }
        ],
        uxNotes: [
          'Garante frequência máxima de exibição (frequency capping) para não degradar a experiência do utilizador.'
        ],
        acceptanceCriteria: [
          'Suporte aos padrões VAST 4.2 e VMAP para compatibilidade com players Web, Android, iOS e Smart TV.'
        ]
      }
    ]
  },

  mobile: {
    id: 'mobile',
    name: 'Aplicação Mobile (Android & iOS)',
    badge: 'Mobile 9:16 (390x844 / 412x915)',
    icon: 'Smartphone',
    aspectRatio: '9:16 Vertical com Safe Areas',
    targetDevices: 'Smartphones Android (Samsung, Xiaomi, Tecno, Infinix) e Apple iPhones',
    inputMethods: 'Touchscreen, Gestos de deslize (swipe), Toque duplo, Picture-in-Picture',
    screens: [
      {
        id: 'mob-home',
        code: 'MOB-01',
        title: 'Ecrã Inicial (Home Feed Mobile)',
        subtitle: 'Feed dinâmico com canais ao vivo, destaques moçambicanos e navegação por toque',
        platform: 'mobile',
        route: 'mobile://home',
        objective: 'Oferecer acesso imediato ao conteúdo com poucos toques, economizando dados móveis quando necessário.',
        keyComponents: [
          'Top Bar com Logo UBlue, Busca, Cast (Chromecast) e Avatar do Utilizador',
          'Hero Banner com carrossel dinâmico e botão direto "▶ Assistir Ao Vivo"',
          'Barra de Filtros Rápidos em Pills (Todos, TV, Filmes, Música, Podcasts, Kids)',
          'Trilha Horizontal: "🔴 Canais Ao Vivo Agora" com indicador de audiência',
          'Trilha Horizontal: "🇲🇿 Top 10 Mais Vistos em Moçambique"',
          'Trilha Horizontal: "⭐ Be Universe Originals"',
          'Bottom Navigation Bar fixa com 5 itens: Início, TV, Filmes, Rádios, Perfil'
        ],
        gridSystem: 'Coluna única vertical (Full width) com padding horizontal de 16px',
        responsiveBreakpoints: 'Otimizado para ecrãs de 360px a 430px de largura com Safe Area para notch/câmera',
        userActions: [
          'Tocar em canal para abrir imediatamente o player de vídeo',
          'Deslizar horizontalmente os carrosséis de conteúdo',
          'Fazer pull-to-refresh para atualizar programação em tempo real'
        ],
        designTokens: {
          primaryColor: '#2563EB (UBlue Blue)',
          backgroundColor: '#050814',
          typography: 'Plus Jakarta Sans (Títulos 18-22px Bold, Legendas 12-14px)',
          spacing: '8px e 16px (Touch target mínimo 48x48px)'
        },
        wireframeZones: [
          { zoneName: 'Mobile App Bar', description: 'Logo à esquerda + Ícones de busca, cast e notificações à direita', componentType: 'MobileHeader', dimensions: '100% x 56px' },
          { zoneName: 'Hero Carousel', description: 'Banner 16:9 de alto impacto com badge "AO VIVO" e botão play', componentType: 'MobileHeroCard', dimensions: '100% x 210px' },
          { zoneName: 'Category Chips', description: 'Filtros em formato pill com scroll horizontal sem atrito', componentType: 'ChipFilterBar', dimensions: '100% x 44px' },
          { zoneName: 'Live Channels Rail', description: 'Miniaturas com logo do canal e programa em transmissão', componentType: 'LiveChannelRail', dimensions: '100% x 140px' },
          { zoneName: 'VOD Carousels', description: 'Cards verticais 2:3 com badge de qualidade', componentType: 'MediaContentRail', dimensions: '100% x 190px' },
          { zoneName: 'Bottom Navigation', description: '5 ícones com indicador azul sob o ecrã selecionado', componentType: 'BottomNavBar', dimensions: '100% x 64px + Safe Area' }
        ],
        uxNotes: [
          'Todos os botões e áreas clicáveis cumprem a diretriz de acessibilidade de pelo menos 48x48 pontos.',
          'Consumo eficiente de bateria com temas escuros amigáveis para telas OLED/AMOLED.'
        ],
        acceptanceCriteria: [
          'Primeiro frame visível em menos de 1 segundo em conexões 4G da Vodacom e Movitel.'
        ]
      },
      {
        id: 'mob-live-tv',
        code: 'MOB-02',
        title: 'TV Ao Vivo & Mini-Player com Rotação',
        subtitle: 'Player integrado no topo e grelha de canais abaixo com rotação para tela cheia',
        platform: 'mobile',
        route: 'mobile://live-tv/:channelId',
        objective: 'Permitir navegação pelos canais sem interromper a visualização do canal atual.',
        keyComponents: [
          'Sticky Video Player no topo da tela com controles por toque',
          'Botão de Rotação Rápida para Paisagem 16:9 Fullscreen',
          'Gestos no Player: Deslizar esquerda (Brilho), Deslizar direita (Volume), Duplo toque (Seek)',
          'Lista Vertical de Canais com Logotipo, Nome, Programa Atual e Barra de Progresso',
          'Modo "Economia de Dados": Botão rápido para travar streaming em 360p / 480p'
        ],
        gridSystem: 'Layout Vertical: Player no terço superior (35%) + Lista rolável nos dois terços inferiores (65%)',
        responsiveBreakpoints: 'Retrato (Vertical) vs Paisagem (Fullscreen 16:9 automático com rotação do giroscópio)',
        userActions: [
          'Tocar num canal da lista para trocar a transmissão sem sair da tela',
          'Girar o telemóvel para deitar e assistir em tela cheia imersiva',
          'Ativar Picture-in-Picture (PiP) para continuar a ouvir enquanto usa o WhatsApp'
        ],
        designTokens: {
          primaryColor: '#3B82F6',
          backgroundColor: '#030612',
          typography: 'Plus Jakarta Sans',
          spacing: '12px'
        },
        wireframeZones: [
          { zoneName: 'Mobile Player Stage', description: 'Player 16:9 fixo com overlay de controles por toque', componentType: 'StickyLivePlayer', dimensions: '100% x 220px' },
          { zoneName: 'Current Program Bar', description: 'Título do programa, tempo decorrido e botão de partilha', componentType: 'CurrentProgramInfo', dimensions: '100% x 60px' },
          { zoneName: 'Channel Directory', description: 'Lista vertical com scroll suave de todos os canais autorizados', componentType: 'ChannelVerticalList', dimensions: '100% x Flexível' }
        ],
        uxNotes: [
          'Quando o utilizador gira o aparelho, os controles desaparecem automaticamente para visão total.'
        ],
        acceptanceCriteria: [
          'Transição perfeita entre modo vertical e paisagem sem reiniciar o buffer de vídeo.'
        ]
      },
      {
        id: 'mob-vod-details',
        code: 'MOB-03',
        title: 'Ficha de Conteúdo VOD & Download Offline',
        subtitle: 'Sinopse, elenco, temporadas de séries e download para assistir sem internet',
        platform: 'mobile',
        route: 'mobile://vod/:contentId',
        objective: 'Apresentar todas as informações do filme ou episódio e viabilizar o download seguro encriptado.',
        keyComponents: [
          'Pôster e Imagem de Fundo com gradiente suave',
          'Badges de Metadados: Classificação etária (+12, +16), Duração, Ano, 4K/HD, Áudio',
          'Botão Principal de Ação: "▶ Assistir Agora" em azul vibrante',
          'Botão Secundário: "⬇ Descarregar" com seletor de qualidade (Padrão vs Alta)',
          'Sinopse completa com botão "ler mais" e lista de elenco',
          'Lista de Episódios com thumbnail, título e barra de progresso para quem já começou'
        ],
        gridSystem: 'Scroll vertical com cabeçalho colapsável (Collapsible Toolbar)',
        responsiveBreakpoints: 'Mobile vertical',
        userActions: [
          'Iniciar download offline para assistir no autocarro ou viagem',
          'Alternar temporadas de séries com dropdown nativo',
          'Adicionar aos favoritos'
        ],
        designTokens: {
          primaryColor: '#2563EB',
          backgroundColor: '#050814',
          typography: 'Plus Jakarta Sans',
          spacing: '16px'
        },
        wireframeZones: [
          { zoneName: 'Backdrop Header', description: 'Imagem cinematográfica com botão voltar e botão favoritar', componentType: 'CollapsibleBackdrop', dimensions: '100% x 240px' },
          { zoneName: 'Title & CTA Block', description: 'Título grande, metadados em linha e botões de ação', componentType: 'ContentActionBox', dimensions: '100% x 140px' },
          { zoneName: 'Synopsis & Cast', description: 'Texto explicativo do filme ou documentário', componentType: 'SynopsisSection', dimensions: '100% x 120px' },
          { zoneName: 'Episodes Selector', description: 'Abas por temporada e cards horizontais de episódios', componentType: 'EpisodeList', dimensions: '100% x Dinâmico' }
        ],
        uxNotes: [
          'O progresso de download é exibido em porcentagem com estimativa de megabytes restantes.'
        ],
        acceptanceCriteria: [
          'Vídeos descarregados são encriptados com chave local e inacessíveis fora do app UBlue TV.'
        ]
      },
      {
        id: 'mob-audio-podcasts',
        code: 'MOB-04',
        title: 'Música, Rádios & Podcasts Moçambicanos',
        subtitle: 'Player de áudio em segundo plano com suporte a tela bloqueada',
        platform: 'mobile',
        route: 'mobile://musica-podcasts',
        objective: 'Oferecer reprodução contínua de áudio para estações de rádio locais e podcasts com baixo consumo de dados.',
        keyComponents: [
          'Carrossel de Estações de Rádio FM Parceiras (Maputo, Beira, Nampula)',
          'Player Flutuante na Base da Tela (Mini-Player de Áudio estilo Spotify)',
          'Lista de Podcasts Be Universe e Criadores Locais organizados por episódios',
          'Equalizador Visual de Ondas Sonoras durante a transmissão',
          'Controles na Tela de Bloqueio do celular (Play, Pause, Próximo)'
        ],
        gridSystem: 'Lista vertical com cartões de áudio de 72px de altura',
        responsiveBreakpoints: 'Mobile vertical',
        userActions: [
          'Sintonizar rádio FM com um toque',
          'Continuar a ouvir com a tela do telemóvel desligada no bolso',
          'Ajustar velocidade de reprodução do podcast (1.0x, 1.25x, 1.5x, 2.0x)'
        ],
        designTokens: {
          primaryColor: '#10B981 (Verde Som) & #06B6D4 (Cyan)',
          backgroundColor: '#040714',
          typography: 'Plus Jakarta Sans',
          spacing: '12px e 16px'
        },
        wireframeZones: [
          { zoneName: 'Radio Stations Grid', description: 'Logos circulares das rádios parceiras com status AO VIVO', componentType: 'RadioDialGrid', dimensions: '100% x 110px' },
          { zoneName: 'Podcasts Feed', description: 'Episódios com foto do locutor, data e duração', componentType: 'PodcastEpisodeList', dimensions: '100% x Flexível' },
          { zoneName: 'Floating Mini-Player', description: 'Barra com título, play/pause e progresso fixada acima do menu', componentType: 'AudioFloatingBar', dimensions: '100% x 56px' }
        ],
        uxNotes: [
          'Áudio consome apenas ~64 kbps em formato AAC+, ideal para pacotes de dados limitados.'
        ],
        acceptanceCriteria: [
          'Áudio não é interrompido quando o usuário troca para outro aplicativo no celular.'
        ]
      },
      {
        id: 'mob-profile-mpesa',
        code: 'MOB-05',
        title: 'Perfil, Gestão Offline & 1-Tap M-Pesa',
        subtitle: 'Assinatura, controle de megabytes de download e renovação rápida',
        platform: 'mobile',
        route: 'mobile://perfil',
        objective: 'Facilitar a renovação da assinatura via M-Pesa com um único toque direto no celular.',
        keyComponents: [
          'Card de Status da Assinatura com botão "Renovar via M-Pesa"',
          'Gestor de Armazenamento: Barra de espaço usado por downloads no aparelho',
          'Seletor de Qualidade de Download (Baixa/Econômica, Padrão, Alta)',
          'Opção "Descarregar apenas com Wi-Fi" para proteger o saldo de dados',
          'Acesso direto ao suporte via WhatsApp Moçambique (+258)'
        ],
        gridSystem: 'Lista de seções organizadas em cartões com cantos arredondados',
        responsiveBreakpoints: 'Mobile vertical',
        userActions: [
          'Pressionar "Renovar 100 MT" para disparar o prompt USSD no chip SIM do celular',
          'Apagar downloads antigos para libertar espaço na memória',
          'Alternar para o perfil infantil com filtro de conteúdos'
        ],
        designTokens: {
          primaryColor: '#2563EB',
          backgroundColor: '#050814',
          typography: 'Plus Jakarta Sans',
          spacing: '16px'
        },
        wireframeZones: [
          { zoneName: 'User Profile Banner', description: 'Foto, nome e número de telefone registrado', componentType: 'MobileProfileCard', dimensions: '100% x 100px' },
          { zoneName: 'Subscription Quick Renew', description: 'Card destacado com valor em MT e botão M-Pesa', componentType: 'QuickRenewMpesaCard', dimensions: '100% x 130px' },
          { zoneName: 'Storage & Downloads Bar', description: 'Gráfico da memória interna usada por episódios', componentType: 'StorageUsageMeter', dimensions: '100% x 80px' },
          { zoneName: 'Settings Menu List', description: 'Preferências de vídeo, legendas e suporte ao cliente', componentType: 'SettingsGroupList', dimensions: '100% x Dinâmico' }
        ],
        uxNotes: [
          'Detecta automaticamente o número da operadora do chip quando a permissão for concedida.'
        ],
        acceptanceCriteria: [
          'Comprovante M-Pesa atualiza o status no app em tempo real.'
        ]
      }
    ]
  },

  'smart-tv': {
    id: 'smart-tv',
    name: 'Smart TV App (10-Foot UI)',
    badge: '10-Foot Interface (3840x2160 / 1920x1080)',
    icon: 'Tv',
    aspectRatio: '16:9 Horizontal para Telas Grandes',
    targetDevices: 'Android TV, Google TV, Samsung Smart TV (Tizen), LG Smart TV (webOS), Fire TV',
    inputMethods: 'Controle Remoto Físico (D-Pad: Cima, Baixo, Esquerda, Direita, OK/Select, Voltar, Home)',
    screens: [
      {
        id: 'tv-home',
        code: 'TV-01',
        title: 'Ecrã Inicial 10-Foot (Navegação D-Pad)',
        subtitle: 'Interface de sala de estar otimizada para controle remoto a 3 metros de distância',
        platform: 'smart-tv',
        route: 'tv://home',
        objective: 'Proporcionar uma experiência cinematográfica fluida, com foco visual de alto contraste e navegação 100% por controle remoto.',
        keyComponents: [
          'Menu Lateral Esquerdo retrátil (Início, TV Ao Vivo, Guia EPG, Filmes, Pesquisa, Conta)',
          'Hero Spotlight de Grande Formato com trailer em background e tipografia de alto impacto',
          'Indicador de Foco Ativo (Anel de brilho azul ciano, aumento de escala 1.1x e sombra suave)',
          'Fileira de Canais Ao Vivo com logotipo brilhante e programa em exibição',
          'Fileiras Temáticas: Continuar a Assistir, Originais Be Universe, Filmes Recentes'
        ],
        gridSystem: 'Grid 10-Foot: Margens seguras de 5% (Overscan Protection), Espaçamento de 24px/32px',
        responsiveBreakpoints: 'Full HD (1920x1080) e 4K Ultra HD (3840x2160) nativos',
        userActions: [
          'Pressionar setas do D-Pad (Cima/Baixo/Esquerda/Direita) para mover o foco',
          'Pressionar botão OK / Select para abrir o canal ou reproduzir o título',
          'Pressionar botão Voltar para retornar ao menu lateral'
        ],
        designTokens: {
          primaryColor: '#00E5FF (Ciano Neon de Alto Contraste para Foco)',
          backgroundColor: '#02040c (Ultra Dark para TVs OLED)',
          typography: 'Plus Jakarta Sans Bold (Textos mínimos de 24px para leitura confortável a 3 metros)',
          spacing: 'Safe Area de 5% em todos os lados (96px horizontal, 54px vertical)'
        },
        wireframeZones: [
          { zoneName: 'Overscan Safe Zone', description: 'Margem de segurança para evitar cortes nas bordas de televisores antigos', componentType: 'TvSafeContainer', dimensions: '90% da tela visível' },
          { zoneName: 'Collapsible Nav Sidebar', description: 'Ícones grandes verticais que expandem com rótulos ao focar', componentType: 'TvNavSidebar', dimensions: '96px / 260px x 100%' },
          { zoneName: 'Spotlight Billboard', description: 'Vídeo ao fundo com sinopse grande e botão [OK] Assistir', componentType: 'TvSpotlightHero', dimensions: '100% x 420px' },
          { zoneName: 'Tv Content Rows', description: 'Carrosséis horizontais com scroll contínuo orientado a D-Pad', componentType: 'TvRailRow', dimensions: '100% x 260px' }
        ],
        uxNotes: [
          'Zero uso de cursor ou mouse virtual: cada elemento é um nó navegável na árvore de foco direcional.',
          'Sons sutis de feedback de clique ao mover o foco pelo controle remoto.'
        ],
        acceptanceCriteria: [
          'Navegação entre elementos com taxa de 60 quadros por segundo constantes sem engasgos.'
        ]
      },
      {
        id: 'tv-epg-guide',
        code: 'TV-02',
        title: 'Guia de Programação EPG em Grade 10-Foot',
        subtitle: 'Grelha horária de canais de TV com sinopse dinâmica e agendamento',
        platform: 'smart-tv',
        route: 'tv://epg-guide',
        objective: 'Permitir que o telespectador visualize o que está a dar em todos os canais simultaneamente ao longo das horas.',
        keyComponents: [
          'Linha do Tempo Horária no Topo (18:00, 18:30, 19:00, 19:30, 20:00, 20:30)',
          'Coluna de Canais à Esquerda com número de canal (Ch 01, Ch 02, etc.) e logos oficiais',
          'Blocos de Programas proporcionais à duração com foco selecionável',
          'Painel Superior de Sinopse que exibe instantaneamente o resumo do programa focado',
          'Atalhos de Teclas Coloridas do Controle Remoto (Vermelho: Hoje, Verde: Amanhã, Amarelo: Favoritos)'
        ],
        gridSystem: 'Grid tabular horário com coluna fixa à esquerda e scroll horizontal/vertical síncrono',
        responsiveBreakpoints: '1080p e 4K',
        userActions: [
          'Navegar com as setas para inspecionar programas futuros',
          'Pressionar OK num programa no ar para sintonizar imediatamente',
          'Pressionar OK num programa futuro para definir lembrete'
        ],
        designTokens: {
          primaryColor: '#00E5FF & #3B82F6',
          backgroundColor: '#050817',
          typography: 'Plus Jakarta Sans Bold + Monospace para horários',
          spacing: '12px'
        },
        wireframeZones: [
          { zoneName: 'EPG Synopsis Inspector', description: 'Exibe título, horário de início/fim, categoria e sinopse do item focado', componentType: 'EpgDetailHeader', dimensions: '100% x 140px' },
          { zoneName: 'Time Scale Bar', description: 'Régua com marcadores a cada 30 minutos', componentType: 'TimelineRuler', dimensions: '100% x 48px' },
          { zoneName: 'Channels Grid Matrix', description: 'Canais na vertical e programas na horizontal com foco ativo', componentType: 'EpgMatrixGrid', dimensions: '100% x 520px' }
        ],
        uxNotes: [
          'O cursor da grade se move naturalmente em saltos proporcionais à duração do programa selecionado.'
        ],
        acceptanceCriteria: [
          'Carregamento da grelha de 24 horas em menos de 800ms.'
        ]
      },
      {
        id: 'tv-cinema-player',
        code: 'TV-03',
        title: 'Player Smart TV Modo Cinema & OSD Remoto',
        subtitle: 'Controles simplificados de controle remoto para filmes, transmissões e 4K HDR',
        platform: 'smart-tv',
        route: 'tv://player/:streamId',
        objective: 'Oferecer reprodução com qualidade cinematográfica máxima e controles que não obstruem a tela.',
        keyComponents: [
          'Vídeo em Tela Cheia sem bordas com suporte a 4K UHD e HDR10',
          'OSD (On-Screen Display) que surge ao tocar em qualquer botão e desaparece em 4 segundos',
          'Barra de Scrubbing com miniatura de pré-visualização (Trilha de mini-frames)',
          'Menu Rápido de Áudio & Legendas (Português, Áudio Descrição, Legendas fechadas)',
          'Atalho de Troca de Canais via botões Ch+ / Ch- do controle remoto'
        ],
        gridSystem: 'Fullscreen 100% com OSD nos 20% inferiores da tela',
        responsiveBreakpoints: '16:9 Nativo para painéis de televisão',
        userActions: [
          'Pressionar [OK] para pausar ou continuar',
          'Pressionar [Esquerda] / [Direita] para retroceder ou avançar 10 segundos',
          'Pressionar [Cima] para abrir o seletor de áudio, legenda e qualidade',
          'Pressionar [Baixo] para abrir a lista de outros canais sem pausar o vídeo atual'
        ],
        designTokens: {
          primaryColor: '#00E5FF',
          backgroundColor: '#000000 puro para vídeo',
          typography: 'Plus Jakarta Sans',
          spacing: 'Padding de segurança de 48px nas laterais'
        },
        wireframeZones: [
          { zoneName: 'Cinema Video Canvas', description: 'Área de vídeo total sem barras pretas laterais', componentType: 'CinemaVideoSurface', dimensions: '100% x 100%' },
          { zoneName: 'Tv OSD Overlay', description: 'Barra de tempo, play/pause, título do canal e botões de áudio/legenda', componentType: 'TvPlayerOsd', dimensions: 'Overlay 100% x 180px' },
          { zoneName: 'Quick Channel Drawer', description: 'Carrossel inferior que surge ao apertar [Seta para Baixo]', componentType: 'QuickChannelDrawer', dimensions: 'Overlay 100% x 160px' }
        ],
        uxNotes: [
          'Quando o usuário aperta voltar durante a transmissão ao vivo, pergunta suavemente se deseja sair ou ir ao menu.'
        ],
        acceptanceCriteria: [
          'Buffer adaptativo previne interrupções mesmo em oscilações de banda doméstica.'
        ]
      },
      {
        id: 'tv-channels-hub',
        code: 'TV-04',
        title: 'Hub de Canais & Categorias Smart TV',
        subtitle: 'Exploração em tela grande organizada por temas e parceiros moçambicanos',
        platform: 'smart-tv',
        route: 'tv://canais',
        objective: 'Apresentar a diversidade de emissoras parceiras e estúdios da Be Universe com navegação rápida.',
        keyComponents: [
          'Menu Superior de Categorias (Geral, Notícias, Filmes, Música, Desporto, Rádios, Kids)',
          'Grade de Cards de Canais 16:9 de Grande Formato',
          'Atalhos por Numeração (Ex: digitar "01" no controle remoto pula para UBlue TV)',
          'Indicador de Selo "AO VIVO" e taxa de resolução (1080p / 4K)'
        ],
        gridSystem: 'Grid 4x3 para 1080p com espaçamento de 24px entre cards',
        responsiveBreakpoints: '1080p e 4K',
        userActions: [
          'Navegar com o D-Pad para explorar todos os canais',
          'Pressionar OK para sintonizar imediatamente',
          'Marcar canal como favorito pressionando a tecla Amarela do controle'
        ],
        designTokens: {
          primaryColor: '#00E5FF',
          backgroundColor: '#040714',
          typography: 'Plus Jakarta Sans',
          spacing: '24px de margem interna'
        },
        wireframeZones: [
          { zoneName: 'Category Horizontal Tabs', description: 'Abas de categorias com scroll horizontal suave', componentType: 'TvCategoryTabs', dimensions: '100% x 64px' },
          { zoneName: 'Tv Channel Grid', description: 'Cards com foco de alto contraste e logotipo centralizado', componentType: 'TvChannelGrid', dimensions: '100% x 580px' }
        ],
        uxNotes: [
          'Efeito sonoro sutil de transição ao alternar de categoria.'
        ],
        acceptanceCriteria: [
          'Permite sintonização direta com números do controle remoto.'
        ]
      }
    ]
  }
};
