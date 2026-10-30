import { MPesaTransactionPayload, EMolaTransactionPayload, EntitlementTokenPayload, TVODEvent, AVODCampaign } from '../types/ott-architecture';

export class ControlPlaneEngine {
  private mpesaLog: MPesaTransactionPayload[] = [
    {
      transactionId: 'MP260925.1432.A0012',
      thirdPartyReference: 'UBLUE_SUB_2026_09_001',
      customerMsisdn: '258841234567',
      amount: 100,
      currency: 'MZN',
      serviceCode: 'UB_BASIC_30D',
      timestamp: new Date().toISOString(),
      status: 'SUCCESSFUL',
      responseCode: 'INS-0',
      responseDesc: 'Transação M-Pesa liquidada com sucesso'
    },
    {
      transactionId: 'MP260925.1501.B0871',
      thirdPartyReference: 'UBLUE_SUB_2026_09_002',
      customerMsisdn: '258859988771',
      amount: 25,
      currency: 'MZN',
      serviceCode: 'UB_START_7D',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'SUCCESSFUL',
      responseCode: 'INS-0',
      responseDesc: 'Transação M-Pesa liquidada com sucesso'
    }
  ];

  private tvodEvents: TVODEvent[] = [
    {
      id: 'ppv-be-universe-live-01',
      title: 'Festival Be Universe Marrabenta & Afro Beats 2026',
      category: 'Concerto',
      artistOrHost: 'Mr. Bow, Lizha James, Neyma & Convidados Especiais',
      priceMT: 150,
      date: '2026-10-15',
      time: '19:00 CAT',
      venue: 'Estádio Nacional do Zimpeto / Live 4K UBlue',
      bannerImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
      ticketSold: 4280,
      capacity: 10000,
      status: 'upcoming',
      streamKey: 'ppv_live_marrabenta_zimpeto_4k',
      description: 'Transmissão ao vivo exclusiva multicâmera 4K HDR com som imersivo Dolby Atmos e chat interativo de fãs.'
    },
    {
      id: 'ppv-moz-mma-clash',
      title: 'Grande Noite de Boxe & MMA Moçambique — Cinturão Austral',
      category: 'Luta MMA/Boxe',
      artistOrHost: 'Federação Moçambicana de Boxe & UBlue Sports',
      priceMT: 200,
      date: '2026-10-28',
      time: '20:30 CAT',
      venue: 'Pavilhão do Maxaquene, Maputo',
      bannerImage: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=1000&auto=format&fit=crop&q=80',
      ticketSold: 2890,
      capacity: 5000,
      status: 'upcoming',
      streamKey: 'ppv_live_mma_maxaquene',
      description: '8 combates de tirar o fôlego com disputa do cinturão de pesos médios e transmissão internacional.'
    },
    {
      id: 'ppv-be-voice-final',
      title: 'Grande Final Ao Vivo: Be Voice Africa 2026',
      category: 'Be Universe Live',
      artistOrHost: 'Apresentado por Sérgio Faife & Jurados Internacionais',
      priceMT: 50,
      date: '2026-11-05',
      time: '21:00 CAT',
      venue: 'Teatro Avenida, Maputo',
      bannerImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=80',
      ticketSold: 8120,
      capacity: 15000,
      status: 'upcoming',
      streamKey: 'ppv_be_voice_grand_finale',
      description: 'A coroação da nova voz de África com votação em tempo real pelo app UBlue TV e prémio de 1.000.000 MT.'
    }
  ];

  private avodCampaigns: AVODCampaign[] = [
    {
      id: 'ad-camp-vodacom-01',
      advertiser: 'Vodacom Moçambique',
      title: 'Tudo Bom com M-Pesa 2026',
      type: 'preroll',
      durationSec: 15,
      skipAfterSec: 5,
      vastTagUrl: 'https://adserver.ublue.tv/vast?cid=mpesa_01',
      budgetMT: 50000,
      cpmMT: 120,
      impressionsDelivered: 41200,
      clickThroughUrl: 'https://vm.co.mz/mpesa',
      status: 'active'
    },
    {
      id: 'ad-camp-bci-02',
      advertiser: 'BCI Moçambique',
      title: 'Conta Jovem & Cartão Digital',
      type: 'midroll',
      durationSec: 20,
      skipAfterSec: 10,
      vastTagUrl: 'https://adserver.ublue.tv/vast?cid=bci_02',
      vmapOffset: '00:10:00',
      budgetMT: 75000,
      cpmMT: 150,
      impressionsDelivered: 29800,
      clickThroughUrl: 'https://bci.co.mz',
      status: 'active'
    },
    {
      id: 'ad-camp-coca-03',
      advertiser: 'Cervejas de Moçambique / 2M',
      title: 'Sabor Genuíno de Moçambique',
      type: 'overlay',
      durationSec: 8,
      vastTagUrl: 'https://adserver.ublue.tv/vast?cid=2m_overlay',
      budgetMT: 35000,
      cpmMT: 90,
      impressionsDelivered: 58900,
      clickThroughUrl: 'https://2m.co.mz',
      status: 'active'
    }
  ];

  public getMPesaTransactions(): MPesaTransactionPayload[] {
    return [...this.mpesaLog];
  }

  public getTVODEvents(): TVODEvent[] {
    return [...this.tvodEvents];
  }

  public getAVODCampaigns(): AVODCampaign[] {
    return [...this.avodCampaigns];
  }

  public async simulateMPesaPayment(
    msisdn: string,
    amountMT: number,
    tierName: string
  ): Promise<MPesaTransactionPayload> {
    const cleanPhone = msisdn.replace(/\D/g, '');
    const isMockSuccess = cleanPhone.length >= 9;

    const ref = `UBLUE_SUB_${Date.now().toString().slice(-6)}`;
    const txnId = `MP${new Date().toISOString().slice(2, 10).replace(/-/g, '')}.${Math.floor(1000 + Math.random() * 9000)}.TXN`;

    const newTx: MPesaTransactionPayload = {
      transactionId: txnId,
      thirdPartyReference: ref,
      customerMsisdn: cleanPhone.startsWith('258') ? cleanPhone : `258${cleanPhone}`,
      amount: amountMT,
      currency: 'MZN',
      serviceCode: `UB_${tierName.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      status: isMockSuccess ? 'SUCCESSFUL' : 'FAILED',
      responseCode: isMockSuccess ? 'INS-0' : 'INS-2006',
      responseDesc: isMockSuccess
        ? 'Transação M-Pesa autorizada e debitada com sucesso na Vodacom'
        : 'Saldo insuficiente ou PIN incorreto na conta M-Pesa'
    };

    this.mpesaLog.unshift(newTx);
    return newTx;
  }

  public generateEntitlementToken(
    userId: string,
    tier: string,
    channels: string[] = ['ublue-tv-247', 'tv-mocambique', 'miramar-hd', 'stt-desporto']
  ): EntitlementTokenPayload {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 86400; // 24 hours

    const payload = {
      sub: userId,
      profileId: `prof_${userId.slice(0, 6)}`,
      tier,
      entitledChannels: channels,
      entitledPPVs: ['ppv-be-universe-live-01'],
      maxStreams: tier === 'max' ? 4 : tier === 'basic' ? 2 : 1,
      drmWidevinePssh: 'CAESEDZ5bWFzdGVyMTIzNDU2NxoId2lkZXZpbmUiC3VibHVlX3Byb2QqAlNE',
      drmFairPlayKeyUrl: 'skd://fps.drm.ublue.tv/getkey?assetId=ublue-247',
      ipAddress: '102.164.128.45', // Mozambique IP sample
      countryCode: 'MZ',
      iat: now,
      exp,
      jwtToken: `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InVibHVlX2tleV8yMDI2In0.${btoa(
        JSON.stringify({
          sub: userId,
          tier,
          channelsCount: channels.length,
          exp,
          drm: true,
          isp: 'Vodacom Mozambique'
        })
      )}.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
    };

    return payload;
  }

  public purchaseTVODTicket(eventId: string): { success: boolean; ticketNumber: string; qrCodeHash: string } {
    const event = this.tvodEvents.find(e => e.id === eventId);
    if (event) {
      event.ticketSold += 1;
      event.isPurchased = true;
    }
    const ticketNumber = `UB-PPV-${Math.floor(100000 + Math.random() * 900000)}`;
    const qrCodeHash = `UBLUE:PPV:${eventId}:${ticketNumber}:${Date.now()}`;
    return { success: true, ticketNumber, qrCodeHash };
  }
}

export const controlPlaneEngine = new ControlPlaneEngine();
