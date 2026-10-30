import React, { useState } from 'react';
import {
  Globe,
  DollarSign,
  ArrowRightLeft,
  FileCheck2,
  AlertCircle,
  Building2,
  Send,
  CreditCard,
  TrendingUp,
  Percent,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
  Info
} from 'lucide-react';
import { paymentGatewayEngine, CurrencyExchangeRate } from '../../engine/payment-gateway-engine';

export const InternationalPaymentsLab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'remittances_methods' | 'forex_calculator' | 'bdm_rules'>('forex_calculator');

  // Forex Calculator state
  const forexRates: CurrencyExchangeRate[] = paymentGatewayEngine.getForexRates();
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'EUR' | 'ZAR' | 'GBP'>('USD');
  const [foreignAmount, setForeignAmount] = useState<string>('50');
  const [conversionDirection, setConversionDirection] = useState<'foreign_to_mzn' | 'mzn_to_foreign'>('foreign_to_mzn');

  const currentRateObj = forexRates.find(r => r.code === selectedCurrency) || forexRates[0];
  const numVal = parseFloat(foreignAmount) || 0;

  // Calculations
  const calculatedMZN = conversionDirection === 'foreign_to_mzn'
    ? (numVal * currentRateObj.commercialBuyRate).toFixed(2)
    : (numVal / currentRateObj.commercialSellRate).toFixed(2);

  const officialBdmVal = conversionDirection === 'foreign_to_mzn'
    ? (numVal * currentRateObj.bdmReferenceRate).toFixed(2)
    : (numVal / currentRateObj.bdmReferenceRate).toFixed(2);

  const spreadDiff = Math.abs(parseFloat(calculatedMZN) - parseFloat(officialBdmVal)).toFixed(2);

  // Remittance Simulator State
  const [simProvider, setSimProvider] = useState<'mukuru' | 'western_union' | 'worldremit' | 'stripe'>('mukuru');
  const [originCountry, setOriginCountry] = useState<'ZA' | 'PT' | 'UK' | 'US'>('ZA');
  const [remittanceAmount, setRemittanceAmount] = useState('500'); // in local currency (e.g. 500 ZAR)
  const [beneficiaryMsisdn, setBeneficiaryMsisdn] = useState('841234567');
  const [remittanceNotice, setRemittanceNotice] = useState<string | null>(null);

  const handleSimulateRemittance = () => {
    const rate = originCountry === 'ZA' ? 3.45 : originCountry === 'PT' ? 68.70 : originCountry === 'UK' ? 81.80 : 63.20;
    const grossMZN = (parseFloat(remittanceAmount) * rate).toFixed(2);
    setRemittanceNotice(
      `Remessa de ${remittanceAmount} recebida via ${simProvider.toUpperCase()} e convertida para ${grossMZN} MT! Depósito automático enviado para o M-Pesa +258 ${beneficiaryMsisdn}.`
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub Header Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveSubTab('forex_calculator')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'forex_calculator'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4 text-emerald-300" />
          <span>Motor de Câmbio & Cotações (MZN vs USD/EUR/ZAR)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('remittances_methods')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'remittances_methods'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-cyan-300" />
          <span>Receber do Exterior: Remessas, SWIFT & Carteiras</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bdm_rules')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'bdm_rules'
              ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-amber-300" />
          <span>Regras Cambiais do Banco de Moçambique (Aviso 01/GBM)</span>
        </button>
      </div>

      {/* 1. MOTOR DE CÂMBIO & COTAÇÕES MZN */}
      {activeSubTab === 'forex_calculator' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono uppercase tracking-wider mb-1">
                <span>Mercado Cambial Interbancário de Moçambique (MIME)</span>
              </div>
              <h3 className="text-lg font-black text-white">
                Conversor de Câmbio e Cálculo de Spread Comercial
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Cotações de referência oficiais do Banco de Moçambique comparadas com taxas de compra/venda praticadas por bancos comerciais (Millennium BIM, BCI, Standard Bank) e intermediários de remessas.
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30 shrink-0">
              ATUALIZAÇÃO DIÁRIA 09:00 MZ
            </div>
          </div>

          {/* Cards de Cotação */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {forexRates.map(r => (
              <button
                key={r.code}
                onClick={() => setSelectedCurrency(r.code)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedCurrency === r.code
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">{r.flag}</span>
                  <span className="text-xs font-mono font-bold text-slate-300">{r.code}</span>
                </div>
                <div className="text-base font-black text-white">{r.commercialBuyRate.toFixed(2)} MT</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Ref BdM: <span className="text-emerald-400 font-mono">{r.bdmReferenceRate.toFixed(2)}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Spread: {r.spreadPercent}%</div>
              </button>
            ))}
          </div>

          {/* Calculadora Interativa */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-sm">Calculadora de Câmbio de Assinaturas e Remessas</h4>
                <button
                  onClick={() => setConversionDirection(prev => prev === 'foreign_to_mzn' ? 'mzn_to_foreign' : 'foreign_to_mzn')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Inverter Sentido</span>
                </button>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {conversionDirection === 'foreign_to_mzn'
                    ? `Valor em Moeda Estrangeira (${currentRateObj.code}):`
                    : 'Valor em Meticais (MZN):'}
                </label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 px-3 py-2.5">
                  <span className="text-sm font-bold text-slate-400 mr-2 font-mono">
                    {conversionDirection === 'foreign_to_mzn' ? currentRateObj.code : 'MZN'}
                  </span>
                  <input
                    type="number"
                    value={foreignAmount}
                    onChange={(e) => setForeignAmount(e.target.value)}
                    className="w-full bg-transparent text-white font-mono text-base font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Resultado da Conversão */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Resultado Comercial:</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    Taxa: {conversionDirection === 'foreign_to_mzn' ? currentRateObj.commercialBuyRate : currentRateObj.commercialSellRate} MZN
                  </span>
                </div>
                <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
                  <span>{calculatedMZN}</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {conversionDirection === 'foreign_to_mzn' ? 'MZN (Meticais)' : currentRateObj.code}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Valor na Taxa Oficial BdM ({currentRateObj.bdmReferenceRate} MT):</span>
                  <span className="font-mono text-slate-300">{officialBdmVal} {conversionDirection === 'foreign_to_mzn' ? 'MT' : currentRateObj.code}</span>
                </div>
                <div className="text-[11px] text-amber-400/90 flex items-center justify-between">
                  <span>Spread Cambial Bancário Estimado:</span>
                  <span className="font-mono">~{spreadDiff} {conversionDirection === 'foreign_to_mzn' ? 'MT' : currentRateObj.code} ({currentRateObj.spreadPercent}%)</span>
                </div>
              </div>
            </div>

            {/* Informações sobre Câmbio no Streaming */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Impacto Cambial no Ecossistema UBlue TV</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                A UBlue TV opera com preços transparentes em <strong>Meticais (MZN)</strong> para proteger o poder de compra local da população moçambicana, eliminando a volatilidade de assinaturas cobradas em USD ou EUR.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-400 block mb-0.5">Assinantes no Estrangeiro (Diáspora):</span>
                  <p className="text-slate-400">
                    Podem pagar em ZAR, EUR ou USD via Mukuru, Stripe ou cartões Visa/Mastercard. A conversão é feita automaticamente no nó de liquidação com liquidação D+0 em MZN.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-400 block mb-0.5">Custos de Infraestrutura e Satélite:</span>
                  <p className="text-slate-400">
                    Banda internacional de trânsito IP submarino (2Africa / SEACOM) e servidores de CDN são cotados em USD, exigindo hedging cambial e gestão de reservas cambiais.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RECEBER DO EXTERIOR: TRANSFERÊNCIAS, REMESSAS & CARTEIRAS */}
      {activeSubTab === 'remittances_methods' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Método 1: Remessas da Diáspora */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Remessas da Diáspora</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Moçambicanos residentes na África do Sul, Portugal, Reino Unido e EUA enviam fundos ou pagam assinaturas diretamente para telemóveis locais.
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between"><span>Mukuru (África do Sul):</span><span className="text-emerald-400">Direto M-Pesa</span></div>
                <div className="flex justify-between"><span>Western Union / MoneyGram:</span><span className="text-emerald-400">Cash-in Digital</span></div>
                <div className="flex justify-between"><span>WorldRemit / Mama Money:</span><span className="text-emerald-400">API Direta</span></div>
              </div>
            </div>

            {/* Método 2: Transferências Bancárias Internacionais */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">SWIFT, BIC & Contas Correspondentes</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Para transferências corporativas B2B de direitos autorais de transmissão e pagamentos de canais parceiros internacionais.
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between"><span>Código SWIFT / BIC:</span><span className="text-purple-300">BIMMMZMXXXX</span></div>
                <div className="flex justify-between"><span>Bancos Correspondentes:</span><span className="text-slate-300">Standard / BCI</span></div>
                <div className="flex justify-between"><span>Prazo de Compensação:</span><span className="text-slate-400">D+2 a D+3</span></div>
              </div>
            </div>

            {/* Método 3: Carteiras & Cartões Internacionais */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Carteiras Globais & Cartões 3DS</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integração via Stripe Connect e gateway internacional com autenticação 3D Secure 2.0 para cartões Visa, Mastercard e Apple Pay.
              </p>
              <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] font-mono text-slate-300">
                <div className="flex justify-between"><span>Stripe Checkout:</span><span className="text-cyan-300">Ativo</span></div>
                <div className="flex justify-between"><span>Apple Pay & Google Pay:</span><span className="text-cyan-300">Disponível</span></div>
                <div className="flex justify-between"><span>Proteção Anti-Fraude:</span><span className="text-emerald-400">3DS v2.2</span></div>
              </div>
            </div>
          </div>

          {/* Simulador de Envio de Remessa da Diáspora */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Simulador de Remessa Direta da Diáspora para Carteira Móvel</h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">País de Origem:</label>
                <select
                  value={originCountry}
                  onChange={(e) => setOriginCountry(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="ZA">🇿🇦 África do Sul (ZAR)</option>
                  <option value="PT">🇵🇹 Portugal (EUR)</option>
                  <option value="UK">🇬🇧 Reino Unido (GBP)</option>
                  <option value="US">🇺🇸 Estados Unidos (USD)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Canal de Remessa:</label>
                <select
                  value={simProvider}
                  onChange={(e) => setSimProvider(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="mukuru">Mukuru Moçambique</option>
                  <option value="western_union">Western Union Digital</option>
                  <option value="worldremit">WorldRemit</option>
                  <option value="stripe">Stripe Connect (Cartão)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Valor Enviado:</label>
                <input
                  type="number"
                  value={remittanceAmount}
                  onChange={(e) => setRemittanceAmount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">N.º do Destinatário (MZ):</label>
                <div className="flex items-center rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
                  <span className="text-xs text-slate-400 font-mono mr-1">+258</span>
                  <input
                    type="text"
                    value={beneficiaryMsisdn}
                    onChange={(e) => setBeneficiaryMsisdn(e.target.value)}
                    className="w-full bg-transparent text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateRemittance}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
            >
              Simular Recepção de Remessa Internacional
            </button>

            {remittanceNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                <span>{remittanceNotice}</span>
                <button onClick={() => setRemittanceNotice(null)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REGRAS CAMBIAIS DO BANCO DE MOÇAMBIQUE */}
      {activeSubTab === 'bdm_rules' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-white text-base">Regulamento Cambial do Banco de Moçambique (Aviso n.º 01/GBM)</h4>
                <p className="text-xs text-slate-400">Diretrizes obrigatórias para entrada e saída de divisas em serviços digitais e telecomunicações.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reporte Obrigatório de Entrada de Divisas</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Operações de valor superior a <strong>$5.000 USD</strong> (ou equivalente) recebidas do exterior devem ser comunicadas ao Banco de Moçambique através do banco intermediário com a Declaração de Venda de Moeda Estrangeira (DVE).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Isenção Simplificada para Assinaturas Digitais</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Pagamentos de assinaturas de streaming e conteúdos individuais até <strong>$1.000 USD</strong> gozam de dispensa de autorização prévia cambial, sendo liquidados diretamente pelos intermediários de pagamento autorizados.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Regime de Retenção Cambial de Criadores</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Empresas e criadores nacionais podem manter contas em moeda estrangeira autorizadas pelo BdM, com conversão obrigatória em Meticais de até 50% no prazo legal de repatriação (90 dias).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Retenção na Fonte de IRPS/IRPC (Não Residentes)</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Remessas para fornecedores de software e satélite no exterior estão sujeitas a retenção fiscal na fonte de <strong>20%</strong> sobre serviços importados, exceto com acordos de dupla tributação vigentes (ex: Portugal).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
