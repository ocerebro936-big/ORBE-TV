export interface SqlTableDefinition {
  tableName: string;
  description: string;
  columns: {
    name: string;
    type: string;
    constraints: string;
    description: string;
  }[];
  sqlDdl: string;
}

export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  module: 'Control Plane' | 'Media Plane' | 'Billing M-Pesa/E-Mola' | 'Be Universe' | 'AVOD/Ads';
  summary: string;
  description: string;
  headers: Record<string, string>;
  requestBody?: string;
  responseBody: string;
}

export const OTT_TECHNICAL_SPEC = {
  version: '1.0.0-PROD',
  title: 'UBlue TV — Especificação Técnica de Engenharia e Arquitetura OTT v1.0',
  executiveSummary: `A UBlue TV é uma plataforma OTT (Over-The-Top) de alta performance projetada para o ecossistema moçambicano e lusófono. A arquitetura desacopla rigorosamente o Media Plane (processamento, transcodificação e distribuição de vídeo de altíssima vazão) do Control Plane (lógica de negócios, autenticação, subscrições M-Pesa/E-Mola, gestão de direitos e analytics).`,
  
  transcodingLadder: [
    {
      resolution: '1080p' as const,
      width: 1920,
      height: 1080,
      videoBitrateKbps: 4500,
      audioBitrateKbps: 192,
      fps: 60,
      codec: 'H.264 High Profile (avc1.64002a)',
      profile: 'High',
      chunkDurationSec: 4,
      segmentPrefix: 'ublue_1080p_',
      bandwidth: 4692000
    },
    {
      resolution: '720p' as const,
      width: 1280,
      height: 720,
      videoBitrateKbps: 2400,
      audioBitrateKbps: 128,
      fps: 30,
      codec: 'H.264 Main Profile (avc1.4d401f)',
      profile: 'Main',
      chunkDurationSec: 4,
      segmentPrefix: 'ublue_720p_',
      bandwidth: 2528000
    },
    {
      resolution: '480p' as const,
      width: 854,
      height: 480,
      videoBitrateKbps: 1200,
      audioBitrateKbps: 96,
      fps: 30,
      codec: 'H.264 Main Profile (avc1.4d401e)',
      profile: 'Main',
      chunkDurationSec: 4,
      segmentPrefix: 'ublue_480p_',
      bandwidth: 1296000
    },
    {
      resolution: '360p' as const,
      width: 640,
      height: 360,
      videoBitrateKbps: 600,
      audioBitrateKbps: 64,
      fps: 25,
      codec: 'H.264 Baseline (avc1.42c01e)',
      profile: 'Baseline (Ultra Economy)',
      chunkDurationSec: 4,
      segmentPrefix: 'ublue_360p_',
      bandwidth: 664000
    }
  ],

  postgresTables: [
    {
      tableName: 'users',
      description: 'Entidade primária do Control Plane com identificador único, telemóvel Moçambique (+258) e dados de autenticação.',
      columns: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'Identificador global único' },
        { name: 'msisdn', type: 'VARCHAR(20)', constraints: 'UNIQUE NOT NULL', description: 'Número de telefone móvel (e.g. 258841234567)' },
        { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NULL', description: 'Email secundário para notificações' },
        { name: 'password_hash', type: 'VARCHAR(255)', constraints: 'NOT NULL', description: 'Hash bcrypt com salt 12' },
        { name: 'full_name', type: 'VARCHAR(150)', constraints: 'NOT NULL', description: 'Nome do titular da conta' },
        { name: 'status', type: 'VARCHAR(20)', constraints: 'DEFAULT \'ACTIVE\'', description: 'ACTIVE, SUSPENDED, BANNED' },
        { name: 'created_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Data de criação' },
        { name: 'updated_at', type: 'TIMESTAMPTZ', constraints: 'DEFAULT NOW()', description: 'Última atualização' }
      ],
      sqlDdl: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  msisdn VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'BANNED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_users_msisdn ON users(msisdn);`
    },
    {
      tableName: 'user_profiles',
      description: 'Múltiplos perfis por conta familiar (Adulto, Criança/Kids com PIN parental e preferências de idioma).',
      columns: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'ID do perfil' },
        { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id) ON DELETE CASCADE', description: 'Chave estrangeira do utilizador pai' },
        { name: 'profile_name', type: 'VARCHAR(50)', constraints: 'NOT NULL', description: 'Nome exibido no avatar' },
        { name: 'avatar_url', type: 'TEXT', constraints: 'NOT NULL', description: 'URL do avatar' },
        { name: 'is_kids', type: 'BOOLEAN', constraints: 'DEFAULT FALSE', description: 'Restrição de classificação etária' },
        { name: 'parental_pin', type: 'VARCHAR(4)', constraints: 'NULL', description: 'PIN de 4 dígitos para canais restritos' },
        { name: 'preferred_language', type: 'VARCHAR(10)', constraints: 'DEFAULT \'pt\'', description: 'pt, en, emakhuwa, changana' }
      ],
      sqlDdl: `CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_name VARCHAR(50) NOT NULL,
  avatar_url TEXT NOT NULL,
  is_kids BOOLEAN DEFAULT FALSE,
  parental_pin VARCHAR(4),
  preferred_language VARCHAR(10) DEFAULT 'pt',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);`
    },
    {
      tableName: 'subscriptions',
      description: 'Gestão de assinaturas SVOD (Livre, Start 25MT, Basic 100MT, Médio 250MT, Max 500MT) com validade temporal estrita.',
      columns: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'ID da subscrição' },
        { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id)', description: 'Utilizador assinante' },
        { name: 'tier', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'free, start, basic, medio, max' },
        { name: 'billing_cycle', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'daily, weekly, biweekly, monthly' },
        { name: 'amount_mzn', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Valor pago em Meticais' },
        { name: 'status', type: 'VARCHAR(20)', constraints: 'DEFAULT \'ACTIVE\'', description: 'ACTIVE, EXPIRED, CANCELLED' },
        { name: 'starts_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Início do período' },
        { name: 'expires_at', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Expiração exata' },
        { name: 'auto_renew', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Tentativa de débito automático' }
      ],
      sqlDdl: `CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(30) NOT NULL CHECK (tier IN ('free', 'start', 'basic', 'medio', 'max')),
  billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('daily', 'weekly', 'biweekly', 'monthly')),
  amount_mzn NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'EXPIRED', 'CANCELLED')),
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_subscriptions_user_status ON subscriptions(user_id, status);`
    },
    {
      tableName: 'payment_transactions',
      description: 'Registo de pagamentos e conciliação em tempo real com M-Pesa (Vodacom) e E-Mola (Movitel).',
      columns: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'ID da transação interna' },
        { name: 'user_id', type: 'UUID', constraints: 'REFERENCES users(id)', description: 'Utilizador pagador' },
        { name: 'provider', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'MPESA, EMOLA, CREDIT_CARD' },
        { name: 'transaction_reference', type: 'VARCHAR(100)', constraints: 'UNIQUE NOT NULL', description: 'Referência da operadora móvel' },
        { name: 'third_party_reference', type: 'VARCHAR(100)', constraints: 'UNIQUE NOT NULL', description: 'Referência gerada pela UBlue API' },
        { name: 'msisdn', type: 'VARCHAR(20)', constraints: 'NOT NULL', description: 'Número cobrado' },
        { name: 'amount_mzn', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Valor processado' },
        { name: 'status', type: 'VARCHAR(20)', constraints: 'DEFAULT \'INITIATED\'', description: 'INITIATED, SUCCESSFUL, FAILED, TIMED_OUT' },
        { name: 'raw_webhook_payload', type: 'JSONB', constraints: 'NULL', description: 'Payload íntegro retornado pela telco' }
      ],
      sqlDdl: `CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  provider VARCHAR(20) NOT NULL CHECK (provider IN ('MPESA', 'EMOLA', 'CREDIT_CARD')),
  transaction_reference VARCHAR(100) UNIQUE,
  third_party_reference VARCHAR(100) UNIQUE NOT NULL,
  msisdn VARCHAR(20) NOT NULL,
  amount_mzn NUMERIC(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'INITIATED' CHECK (status IN ('INITIATED', 'SUCCESSFUL', 'FAILED', 'TIMED_OUT')),
  raw_webhook_payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_payment_third_party ON payment_transactions(third_party_reference);`
    },
    {
      tableName: 'live_channels',
      description: 'Catálogo de canais de streaming com credenciais do Media Plane (RTMP ingest e URLs de distribuição HLS).',
      columns: [
        { name: 'id', type: 'VARCHAR(50)', constraints: 'PRIMARY KEY', description: 'Identificador do canal (e.g. ublue-tv-247)' },
        { name: 'name', type: 'VARCHAR(100)', constraints: 'NOT NULL', description: 'Nome público do canal' },
        { name: 'stream_key', type: 'VARCHAR(100)', constraints: 'UNIQUE NOT NULL', description: 'Chave secreta para Ingest RTMP/SRT' },
        { name: 'required_tier', type: 'VARCHAR(30)', constraints: 'NOT NULL', description: 'Nível mínimo de subscrição' },
        { name: 'hls_playback_url', type: 'TEXT', constraints: 'NOT NULL', description: 'URL Cloudflare CDN do master.m3u8' },
        { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE', description: 'Flag de transmissão ativa' }
      ],
      sqlDdl: `CREATE TABLE live_channels (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  stream_key VARCHAR(100) UNIQUE NOT NULL,
  required_tier VARCHAR(30) NOT NULL,
  hls_playback_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`
    },
    {
      tableName: 'ppv_events',
      description: 'Eventos Pay-Per-View (TVOD) como concertos ao vivo Be Universe, festivais e combates de boxe.',
      columns: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY DEFAULT gen_random_uuid()', description: 'ID do evento' },
        { name: 'title', type: 'VARCHAR(200)', constraints: 'NOT NULL', description: 'Título do evento' },
        { name: 'price_mzn', type: 'NUMERIC(10,2)', constraints: 'NOT NULL', description: 'Preço do bilhete' },
        { name: 'event_date', type: 'TIMESTAMPTZ', constraints: 'NOT NULL', description: 'Data e hora de início' },
        { name: 'stream_endpoint', type: 'TEXT', constraints: 'NOT NULL', description: 'Endpoint protegido por DRM/Token' }
      ],
      sqlDdl: `CREATE TABLE ppv_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  price_mzn NUMERIC(10,2) NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  stream_endpoint TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'SCHEDULED'
);`
    }
  ] as SqlTableDefinition[],

  apiSpecs: [
    {
      method: 'POST',
      path: '/api/v1/auth/login-otp',
      module: 'Control Plane',
      summary: 'Autenticação rápida por SMS / OTP Moçambique (+258)',
      description: 'Envia um código OTP de 6 dígitos via gateway SMS local para validar número Vodacom, Movitel ou Tmcel.',
      headers: { 'Content-Type': 'application/json' },
      requestBody: `{\n  "msisdn": "258841234567"\n}`,
      responseBody: `{\n  "status": "OTP_SENT",\n  "expiresInSeconds": 180,\n  "sessionToken": "otp_req_9f3a8b2c1"\n}`
    },
    {
      method: 'POST',
      path: '/api/v1/payments/mpesa/c2b-push',
      module: 'Billing M-Pesa/E-Mola',
      summary: 'Inicia cobrança direta STK Push via M-Pesa API',
      description: 'Aciona o prompt de confirmação de PIN diretamente no telemóvel do assinante no valor do plano escolhido.',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <ACCESS_TOKEN>' },
      requestBody: `{\n  "msisdn": "258841234567",\n  "tier": "basic",\n  "amount": 100,\n  "thirdPartyReference": "UBLUE_SUB_2026_09_001"\n}`,
      responseBody: `{\n  "responseCode": "INS-0",\n  "responseDesc": "Request processed successfully",\n  "conversationId": "AG_20260925_0001",\n  "thirdPartyReference": "UBLUE_SUB_2026_09_001",\n  "status": "PENDING_USER_PIN"\n}`
    },
    {
      method: 'POST',
      path: '/api/v1/payments/webhooks/mpesa-callback',
      module: 'Billing M-Pesa/E-Mola',
      summary: 'Webhook de confirmação de pagamento M-Pesa',
      description: 'Recebe a confirmação de liquidação financeira da Vodacom e ativa instantaneamente a subscrição no Redis e PostgreSQL.',
      headers: { 'Content-Type': 'application/json', 'X-Signature': '<HMAC_SHA256>' },
      requestBody: `{\n  "output_ResponseCode": "INS-0",\n  "output_ResponseDesc": "Transaction Successful",\n  "output_TransactionID": "MP260925.1432.A0012",\n  "output_ConversationID": "AG_20260925_0001",\n  "output_ThirdPartyReference": "UBLUE_SUB_2026_09_001"\n}`,
      responseBody: `{\n  "received": true,\n  "subscriptionActivated": true,\n  "expiresAt": "2026-10-25T09:30:00Z"\n}`
    },
    {
      method: 'GET',
      path: '/api/v1/streams/{channelId}/playback-token',
      module: 'Media Plane',
      summary: 'Gera token JWT assinado para streaming HLS/DASH',
      description: 'Verifica no Entitlement Engine se o utilizador possui o plano necessário e assina um token temporário com proteção de IP e geo-fence.',
      headers: { 'Authorization': 'Bearer <USER_JWT>' },
      responseBody: `{\n  "playbackUrl": "https://cdn.ublue.tv/live/ublue-247/master.m3u8?token=eyJhbGciOi...",\n  "expiresAt": 1790428800,\n  "drmKeyServer": "https://drm.ublue.tv/widevine/license",\n  "allowedResolutions": ["1080p", "720p", "480p", "360p"]\n}`
    },
    {
      method: 'GET',
      path: '/api/v1/ads/vast?placement=preroll&channelId={channelId}',
      module: 'AVOD/Ads',
      summary: 'Endpoint de anúncios VAST 4.2 / VMAP',
      description: 'Retorna XML VAST com anúncios segmentados para o canal e perfil do utilizador (campanhas moçambicanas de telecom, banca e bens de consumo).',
      headers: { 'Accept': 'application/xml' },
      responseBody: `<?xml version="1.0" encoding="UTF-8"?>\n<VAST version="4.2">\n  <Ad id="ublue_ad_001">\n    <InLine>\n      <AdSystem>UBlue AdServer</AdSystem>\n      <AdTitle>M-Pesa Moçambique Spot</AdTitle>\n      <Creatives>\n        <Creative>\n          <Linear>\n            <Duration>00:00:15</Duration>\n            <MediaFiles>\n              <MediaFile delivery="progressive" type="video/mp4" width="1920" height="1080">https://cdn.ublue.tv/ads/mpesa_15s_1080p.mp4</MediaFile>\n            </MediaFiles>\n          </Linear>\n        </Creative>\n      </Creatives>\n    </InLine>\n  </Ad>\n</VAST>`
    },
    {
      method: 'POST',
      path: '/api/v1/be-universe/ingest-job',
      module: 'Be Universe',
      summary: 'Submissão de novo conteúdo Be Universe para transcodificação',
      description: 'Inicia fila de transcodificação multi-bitrate (FFmpeg ladder) para Talent Shows, Reality Shows ou Músicas.',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer <ADMIN_BE_UNIVERSE>' },
      requestBody: `{\n  "title": "Estrelas de Moçambique - Episódio 1",\n  "category": "talent-show",\n  "sourceS3Uri": "s3://ublue-raw-ingest/be-universe/estrelas_ep01_master.mov",\n  "drmRequired": true\n}`,
      responseBody: `{\n  "jobId": "job_enc_8923a1",\n  "status": "QUEUED",\n  "estimatedTimeSec": 140,\n  "renditionsTarget": ["1080p", "720p", "480p", "360p"]\n}`
    }
  ] as ApiEndpointSpec[],

  mozambiquePops: [
    {
      popId: 'POP-MZ-MPM-01',
      city: 'Maputo',
      ispPeering: ['MOZ-IX (Internet Exchange de Moçambique)', 'Vodacom Mozambique AS37181', 'Movitel AS37402', 'Tmcel Telecomunicações'],
      status: 'operational' as const,
      latencyMs: 12,
      bandwidthGbps: 40,
      cacheHitRatio: 96.4,
      connectedSubscribers: 18450,
      phase: 'Fase 1' as const
    },
    {
      popId: 'POP-MZ-BEI-02',
      city: 'Beira (Sofala)',
      ispPeering: ['TDM Backbone Centro', 'Movitel Regional', 'Vodacom Edge'],
      status: 'deploying' as const,
      latencyMs: 24,
      bandwidthGbps: 20,
      cacheHitRatio: 89.1,
      connectedSubscribers: 6200,
      phase: 'Fase 2' as const
    },
    {
      popId: 'POP-MZ-NAP-03',
      city: 'Nampula (Norte)',
      ispPeering: ['TDM Norte', 'Movitel Fibra', 'Vodacom Nampula'],
      status: 'planned' as const,
      latencyMs: 38,
      bandwidthGbps: 10,
      cacheHitRatio: 82.5,
      connectedSubscribers: 3100,
      phase: 'Fase 2' as const
    }
  ]
};
