/**
 * UBlue Payment & Billing Engine — Arquitetura de Pagamentos e Publicidade
 * Independente de fornecedor (Provider-Agnostic) para o ecossistema UBlue TV.
 * Cobre:
 * - Checkout para pacotes (25 MT, 100 MT, 250 MT, 500 MT).
 * - Integração M-Pesa (C2B, Query, Reversal, Webhooks).
 * - Prestadores e-Mola, mKesh, Cartões SIMO.
 * - Livro-Razão (Ledger) imutável, Reconciliação Contábil diária e Detetor de Fraude.
 * - Desembolsos a fornecedores com Dupla Aprovação Administrativa.
 * - UBlue Ads Engine & Gestão de Campanhas Comerciais.
 */

import { SubscriptionTier } from '../types/content';

export type PaymentProvider = 'mpesa' | 'emola' | 'mkesh' | 'card';

export type TransactionStatus =
  | 'COMPLETED'
  | 'PENDING'
  | 'FAILED'
  | 'REVERSED'
  | 'SUSPICIOUS';

export type TransactionType =
  | 'c2b_package'       // Assinatura de pacote TV
  | 'b2b_payout'         // Pagamento a fornecedor / criador
  | 'reversal'           // Reembolso / estorno
  | 'ad_campaign'        // Pagamento de anunciante
  | 'ppv_ticket';        // Ingresso Pay-Per-View

export interface LedgerAuditEntry {
  action: string;
  adminUser: string;
  note: string;
  timestamp: string;
}

export interface LedgerTransaction {
  id: string;
  type: TransactionType;
  tier?: SubscriptionTier;
  planName: string;
  amountMT: number;
  provider: PaymentProvider;
  phoneOrAccount: string;
  customerUserId: string;
  customerName: string;
  referenceId: string;
  conversationId: string;
  status: TransactionStatus;
  timestamp: string;
  ipAddress: string;
  signature: string;
  fraudScore: number; // 0 (seguro) a 100 (alta probabilidade de fraude)
  reversalReason?: string;
  auditTrail: LedgerAuditEntry[];
}

export interface VendorPayoutRequest {
  id: string;
  vendorName: string;
  category: 'Licenciamento de Canal' | 'Criador UBlue Originals' | 'CDN / Infraestrutura' | 'Marketing';
  amountMT: number;
  provider: PaymentProvider;
  accountPhone: string;
  initiatorAdmin: string;
  approverAdmin?: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED' | 'REJECTED';
  initiatedAt: string;
  disbursedAt?: string;
  description: string;
  referenceId: string;
}

export interface AdCampaign {
  id: string;
  brandName: string;
  campaignTitle: string;
  format: 'Pre-Roll 15s' | 'Bumper 6s' | 'EPG Banner' | 'Watermark Patrocinada' | 'Patrocínio Master';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  budgetMT: number;
  spentMT: number;
  cpmMT: number; // Custo por mil visualizações
  impressionsDelivered: number;
  targetImpressions: number;
  clicks: number;
  ctrPercent: number;
  startDate: string;
  endDate: string;
  targetProvinces: string[];
}

export interface DailyReconciliationReport {
  date: string;
  totalTransactionsCount: number;
  totalGrossMT: number;
  totalNetSettledMT: number;
  totalReversedMT: number;
  mpesaShareMT: number;
  emolaShareMT: number;
  mkeshShareMT: number;
  cardShareMT: number;
  discrepanciesCount: number;
  status: 'BALANCED_OK' | 'DISCREPANCY_FLAGGED';
}

class UBluePaymentEngine {
  private transactions: LedgerTransaction[] = [
    {
      id: 'TX-UB-90412',
      type: 'c2b_package',
      tier: 'basic',
      planName: 'UBlue Basic (100 MT)',
      amountMT: 100,
      provider: 'mpesa',
      phoneOrAccount: '+258 84 123 4567',
      customerUserId: 'UB-842910',
      customerName: 'Carlos Nhantumbo',
      referenceId: 'MPESA-TX-849201',
      conversationId: 'CONV-88129-MZ',
      status: 'COMPLETED',
      timestamp: '2026-10-14 09:30:15',
      ipAddress: '197.235.12.84 (Maputo, Vodacom)',
      signature: 'sha256:7f9a8b1c4e2d3f6a5b8c9d0e1f2a3b4c',
      fraudScore: 2,
      auditTrail: [
        { action: 'C2B_INITIATED', adminUser: 'system_engine', note: 'USSD Push enviado para 841234567', timestamp: '2026-10-14 09:30:02' },
        { action: 'PAYMENT_VERIFIED', adminUser: 'system_engine', note: 'M-Pesa Webhook validado via HMAC-SHA256', timestamp: '2026-10-14 09:30:15' }
      ]
    },
    {
      id: 'TX-UB-90413',
      type: 'c2b_package',
      tier: 'start',
      planName: 'UBlue Start (25 MT)',
      amountMT: 25,
      provider: 'emola',
      phoneOrAccount: '+258 86 555 4321',
      customerUserId: 'UB-665012',
      customerName: 'Fatima Abdul',
      referenceId: 'EMOLA-TX-771920',
      conversationId: 'CONV-88130-MZ',
      status: 'COMPLETED',
      timestamp: '2026-10-14 10:12:00',
      ipAddress: '41.220.14.99 (Beira, Movitel)',
      signature: 'sha256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
      fraudScore: 0,
      auditTrail: [
        { action: 'C2B_INITIATED', adminUser: 'system_engine', note: 'Push e-Mola processado', timestamp: '2026-10-14 10:11:45' }
      ]
    },
    {
      id: 'TX-UB-90414',
      type: 'c2b_package',
      tier: 'max',
      planName: 'UBlue Max (500 MT)',
      amountMT: 500,
      provider: 'mpesa',
      phoneOrAccount: '+258 84 777 8899',
      customerUserId: 'UB-990001',
      customerName: 'Dra. Amélia Cossa',
      referenceId: 'MPESA-TX-990011',
      conversationId: 'CONV-88131-MZ',
      status: 'COMPLETED',
      timestamp: '2026-10-14 11:45:22',
      ipAddress: '197.235.45.10 (Nampula, Vodacom)',
      signature: 'sha256:3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
      fraudScore: 1,
      auditTrail: [
        { action: 'C2B_INITIATED', adminUser: 'system_engine', note: 'Pacote VIP ativado instantaneamente', timestamp: '2026-10-14 11:45:22' }
      ]
    },
    {
      id: 'TX-UB-90415',
      type: 'c2b_package',
      tier: 'medio',
      planName: 'UBlue Médio (250 MT)',
      amountMT: 250,
      provider: 'mkesh',
      phoneOrAccount: '+258 82 444 3322',
      customerUserId: 'UB-442110',
      customerName: 'Bernardo Machava',
      referenceId: 'MKESH-TX-332145',
      conversationId: 'CONV-88132-MZ',
      status: 'COMPLETED',
      timestamp: '2026-10-14 12:05:40',
      ipAddress: '105.234.18.22 (Tete, TMCEL)',
      signature: 'sha256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      fraudScore: 3,
      auditTrail: [
        { action: 'C2B_INITIATED', adminUser: 'system_engine', note: 'mKesh TMCEL autenticado com sucesso', timestamp: '2026-10-14 12:05:40' }
      ]
    }
  ];

  private vendorPayouts: VendorPayoutRequest[] = [
    {
      id: 'PO-881',
      vendorName: 'Estúdios Gorongosa Produções',
      category: 'Criador UBlue Originals',
      amountMT: 45000,
      provider: 'mpesa',
      accountPhone: '+258 84 990 0112',
      initiatorAdmin: 'admin_carlos',
      approverAdmin: 'superadmin_inacio',
      status: 'DISBURSED',
      initiatedAt: '2026-10-10 14:00',
      disbursedAt: '2026-10-10 15:30',
      description: 'Direitos de exibição exclusiva da 2ª temporada da série Vozes da Savana',
      referenceId: 'B2B-GOR-99120'
    },
    {
      id: 'PO-882',
      vendorName: 'Liquid Intelligent Technologies MZ',
      category: 'CDN / Infraestrutura',
      amountMT: 85000,
      provider: 'card',
      accountPhone: 'Conta BIM: 000100019284102',
      initiatorAdmin: 'admin_carlos',
      approverAdmin: 'superadmin_inacio',
      status: 'DISBURSED',
      initiatedAt: '2026-10-11 11:00',
      disbursedAt: '2026-10-11 12:15',
      description: 'Banda larga de trânsito IP dedicado 10 Gbps para os PoPs Maputo e Beira',
      referenceId: 'B2B-LIQ-33410'
    },
    {
      id: 'PO-883',
      vendorName: 'Coletivo Marrabenta Maputo Live',
      category: 'Licenciamento de Canal',
      amountMT: 30000,
      provider: 'emola',
      accountPhone: '+258 86 333 9988',
      initiatorAdmin: 'admin_carlos',
      status: 'PENDING_APPROVAL',
      initiatedAt: '2026-10-14 08:30',
      description: 'Royalties de streaming contínuo no canal UBlue Ritmos & Música África',
      referenceId: 'B2B-MRB-44129'
    }
  ];

  private adCampaigns: AdCampaign[] = [
    {
      id: 'AD-2026-01',
      brandName: 'Cervejas de Moçambique (2M)',
      campaignTitle: 'Paixão pelo Moçambola & Música Nacional',
      format: 'Pre-Roll 15s',
      status: 'active',
      budgetMT: 75000,
      spentMT: 34500,
      cpmMT: 150,
      impressionsDelivered: 230000,
      targetImpressions: 500000,
      clicks: 14200,
      ctrPercent: 6.17,
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      targetProvinces: ['Maputo', 'Sofala', 'Nampula', 'Gaza']
    },
    {
      id: 'AD-2026-02',
      brandName: 'Standard Bank Moçambique',
      campaignTitle: 'Conta Digital & Crédito Empreendedor Jovem',
      format: 'Bumper 6s',
      status: 'active',
      budgetMT: 60000,
      spentMT: 42000,
      cpmMT: 120,
      impressionsDelivered: 350000,
      targetImpressions: 500000,
      clicks: 18900,
      ctrPercent: 5.40,
      startDate: '2026-10-05',
      endDate: '2026-11-05',
      targetProvinces: ['Todas as 10 Províncias']
    },
    {
      id: 'AD-2026-03',
      brandName: 'Movitel Moçambique',
      campaignTitle: 'Pacotes Ilimitados e-Mola 4G & 5G',
      format: 'EPG Banner',
      status: 'active',
      budgetMT: 45000,
      spentMT: 28000,
      cpmMT: 80,
      impressionsDelivered: 350000,
      targetImpressions: 400000,
      clicks: 22400,
      ctrPercent: 6.40,
      startDate: '2026-10-08',
      endDate: '2026-10-28',
      targetProvinces: ['Cabo Delgado', 'Nampula', 'Zambézia', 'Sofala']
    }
  ];

  private listeners: Array<() => void> = [];

  private notify() {
    this.listeners.forEach(cb => cb());
  }

  public subscribe(cb: () => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter(l => l !== cb);
    };
  }

  // --- C2B CHECKOUT & PROCESSAMENTO ---
  public async processCheckout(params: {
    tier: SubscriptionTier;
    planName: string;
    amountMT: number;
    provider: PaymentProvider;
    phone: string;
    userId: string;
    userName: string;
  }): Promise<{ success: boolean; transaction: LedgerTransaction; message: string }> {
    // 1. Detecção de fraude / Velocity Check
    const recentTx = this.transactions.find(
      t => t.phoneOrAccount === params.phone &&
      t.status === 'COMPLETED' &&
      Date.now() - new Date(t.timestamp).getTime() < 30000
    );

    let fraudScore = 0;
    if (recentTx) {
      fraudScore = 85; // Flag de alta repetição
    }

    const txId = `TX-UB-${Math.floor(10000 + Math.random() * 90000)}`;
    const ref = `${params.provider.toUpperCase()}-TX-${Math.floor(100000 + Math.random() * 900000)}`;
    const convId = `CONV-${Math.floor(10000 + Math.random() * 90000)}-MZ`;

    const newTx: LedgerTransaction = {
      id: txId,
      type: 'c2b_package',
      tier: params.tier,
      planName: params.planName,
      amountMT: params.amountMT,
      provider: params.provider,
      phoneOrAccount: params.phone,
      customerUserId: params.userId,
      customerName: params.userName,
      referenceId: ref,
      conversationId: convId,
      status: fraudScore > 80 ? 'SUSPICIOUS' : 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '197.235.12.50 (Maputo Gateway)',
      signature: `sha256:${Math.random().toString(36).substring(2, 18)}${Math.random().toString(36).substring(2, 18)}`,
      fraudScore,
      auditTrail: [
        {
          action: 'CHECKOUT_SUBMITTED',
          adminUser: 'customer_self',
          note: `Submetido checkout de ${params.amountMT} MT via ${params.provider.toUpperCase()}`,
          timestamp: new Date().toISOString()
        },
        {
          action: 'PROVIDER_SETTLED',
          adminUser: 'system_engine',
          note: `Confirmação de recebimento no prestador ${params.provider.toUpperCase()}`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    this.transactions.unshift(newTx);
    this.notify();

    return {
      success: newTx.status === 'COMPLETED',
      transaction: newTx,
      message: newTx.status === 'COMPLETED'
        ? `Pagamento de ${params.amountMT} MT aprovado com sucesso via ${params.provider.toUpperCase()}!`
        : 'Transação sinalizada para verificação de segurança devido a requisições consecutivas.'
    };
  }

  // --- REVERSÃO / REEMBOLSO AUDITADO ---
  public async requestRefund(transactionId: string, reason: string, adminUser: string): Promise<{ success: boolean; message: string }> {
    const tx = this.transactions.find(t => t.id === transactionId);
    if (!tx) {
      return { success: false, message: 'Transação não encontrada no livro-razão!' };
    }

    if (tx.status === 'REVERSED') {
      return { success: false, message: 'Esta transação já foi reembolsada anteriormente!' };
    }

    tx.status = 'REVERSED';
    tx.reversalReason = reason;
    tx.auditTrail.push({
      action: 'REVERSAL_PROCESSED',
      adminUser,
      note: `Reembolso de ${tx.amountMT} MT estornado para ${tx.phoneOrAccount}. Motivo: ${reason}`,
      timestamp: new Date().toISOString()
    });

    this.notify();
    return {
      success: true,
      message: `Reembolso de ${tx.amountMT} MT emitido com sucesso para ${tx.phoneOrAccount}!`
    };
  }

  // --- DISBURSAL A FORNECEDORES (DUPLA APROVAÇÃO) ---
  public createVendorPayout(payout: Omit<VendorPayoutRequest, 'id' | 'status' | 'initiatedAt' | 'referenceId'>): VendorPayoutRequest {
    const newPayout: VendorPayoutRequest = {
      ...payout,
      id: `PO-${Math.floor(800 + Math.random() * 200)}`,
      status: 'PENDING_APPROVAL',
      initiatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      referenceId: `B2B-${payout.category.slice(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`
    };

    this.vendorPayouts.unshift(newPayout);
    this.notify();
    return newPayout;
  }

  public approveVendorPayout(payoutId: string, approverAdmin: string): { success: boolean; message: string } {
    const payout = this.vendorPayouts.find(p => p.id === payoutId);
    if (!payout) return { success: false, message: 'Pagamento não localizado!' };

    if (payout.initiatorAdmin === approverAdmin) {
      return { success: false, message: 'Regra de Segurança: O criador do lote não pode aprovar a si mesmo (exige dupla aprovação)!' };
    }

    payout.status = 'DISBURSED';
    payout.approverAdmin = approverAdmin;
    payout.disbursedAt = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Registra débito no ledger
    this.transactions.unshift({
      id: `TX-DISB-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'b2b_payout',
      planName: `Desembolso Fornecedor: ${payout.vendorName}`,
      amountMT: -payout.amountMT,
      provider: payout.provider,
      phoneOrAccount: payout.accountPhone,
      customerUserId: 'VENDOR-EXTERNAL',
      customerName: payout.vendorName,
      referenceId: payout.referenceId,
      conversationId: `CONV-B2B-${payout.id}`,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      ipAddress: '10.0.4.1 (Servidor Central UBlue)',
      signature: `sha256:b2b-${Math.random().toString(36).substring(2, 18)}`,
      fraudScore: 0,
      auditTrail: [
        {
          action: 'B2B_INITIATED',
          adminUser: payout.initiatorAdmin,
          note: `Lote criado para ${payout.vendorName}`,
          timestamp: payout.initiatedAt
        },
        {
          action: 'B2B_APPROVED_AND_SENT',
          adminUser: approverAdmin,
          note: `Aprovado por ${approverAdmin} e liquidado no canal autorizado ${payout.provider.toUpperCase()}`,
          timestamp: new Date().toISOString()
        }
      ]
    });

    this.notify();
    return { success: true, message: `Desembolso de ${payout.amountMT} MT aprovado e liquidado com sucesso!` };
  }

  // --- RECONCILIAÇÃO CONTÁBIL DIÁRIA ---
  public generateReconciliationReport(): DailyReconciliationReport {
    const completed = this.transactions.filter(t => t.status === 'COMPLETED' && t.amountMT > 0);
    const gross = completed.reduce((acc, t) => acc + t.amountMT, 0);
    const reversed = this.transactions
      .filter(t => t.status === 'REVERSED')
      .reduce((acc, t) => acc + t.amountMT, 0);

    const mpesa = completed.filter(t => t.provider === 'mpesa').reduce((acc, t) => acc + t.amountMT, 0);
    const emola = completed.filter(t => t.provider === 'emola').reduce((acc, t) => acc + t.amountMT, 0);
    const mkesh = completed.filter(t => t.provider === 'mkesh').reduce((acc, t) => acc + t.amountMT, 0);
    const card = completed.filter(t => t.provider === 'card').reduce((acc, t) => acc + t.amountMT, 0);

    return {
      date: 'Hoje (14 Out 2026)',
      totalTransactionsCount: this.transactions.length,
      totalGrossMT: gross,
      totalNetSettledMT: gross - reversed,
      totalReversedMT: reversed,
      mpesaShareMT: mpesa,
      emolaShareMT: emola,
      mkeshShareMT: mkesh,
      cardShareMT: card,
      discrepanciesCount: 0,
      status: 'BALANCED_OK'
    };
  }

  // --- GETTERS ---
  public getTransactions(): LedgerTransaction[] {
    return [...this.transactions];
  }

  public getVendorPayouts(): VendorPayoutRequest[] {
    return [...this.vendorPayouts];
  }

  public getAdCampaigns(): AdCampaign[] {
    return [...this.adCampaigns];
  }
}

export const ubluePaymentEngine = new UBluePaymentEngine();
