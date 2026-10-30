import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileText,
  Building,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Eye,
  Key,
  Database,
  FileCode,
  Download,
  Copy,
  Check,
  Sparkles
} from 'lucide-react';

export const SecurityComplianceLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pci_dss' | 'kyc_aml' | 'data_protection' | 'bdm_licensing'>('pci_dss');

  // PCI DSS Checklist state
  const [pciChecks, setPciChecks] = useState<Record<string, boolean>>({
    req1: true,
    req2: true,
    req3: true,
    req4: true,
    req5: true,
    req6: true,
    req7: true,
    req8: true,
    req9: true,
    req10: true,
    req11: true,
    req12: true,
  });

  const togglePciCheck = (key: string) => {
    setPciChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const pciScore = Object.values(pciChecks).filter(Boolean).length;

  // KYC Simulator state
  const [kycName, setKycName] = useState('Inácio Amadeu');
  const [kycDocType, setKycDocType] = useState<'bi' | 'dire' | 'passaporte'>('bi');
  const [kycDocNumber, setKycDocNumber] = useState('110100293841B');
  const [kycNuit, setKycNuit] = useState('400921098');
  const [kycTier, setKycTier] = useState<'tier1' | 'tier2' | 'tier3'>('tier2');
  const [isPepCheck, setIsPepCheck] = useState(false);
  const [kycResult, setKycResult] = useState<string | null>(null);

  const handleSimulateKycVerification = () => {
    setKycResult(
      `✓ KYC validado com sucesso! Nível concedido: ${kycTier.toUpperCase()}. O assinante ${kycName} (NUIT ${kycNuit}) está habilitado a transacionar até ${
        kycTier === 'tier1' ? '2.500 MT/dia' : kycTier === 'tier2' ? '25.000 MT/dia' : 'Sem limite (B2B)'
      }. Nenhuma correspondência encontrada em listas de sanções internacionais (OFAC / ONU).`
    );
  };

  // GIFiM Suspicious Report State
  const [gifimAmount, setGifimAmount] = useState('150000');
  const [gifimMsisdn, setGifimMsisdn] = useState('+258 84 999 1102');
  const [gifimReason, setGifimReason] = useState('Múltiplos depósitos fracionados seguidos de transferência imediata sem histórico de uso.');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);

  const handleGenerateGifimReport = () => {
    const report = `COMUNICAÇÃO DE OPERAÇÃO SUSPEITA (COS)
Destinatário: GIFiM (Gabinete de Informação Financeira de Moçambique)
Entidade Comunicante: UBlue TV Serviços de Moeda Electrónica, SA (Reg. BdM: EME-019/2026)
Data do Relato: ${new Date().toLocaleDateString('pt-MZ')} às ${new Date().toLocaleTimeString('pt-MZ')}
Referência COS: COS-UBLUE-${Date.now().toString().slice(-6)}

1. IDENTIFICAÇÃO DO ENVOLVIDO
MSISDN / Conta: ${gifimMsisdn}
Montante Suspeito: ${gifimAmount} MT (Meticais)

2. PADRÃO ATÍPICO DETETADO
Tipologia: Fracionamento transacional (Structuring / Smurfing)
Descrição dos Fatos: ${gifimReason}
Pontuação de Risco Interno (Anti-Fraud Engine): 94/100 (CRÍTICO)

3. MEDIDAS CAUTELARES ADOTADAS
- Congelamento preventivo da carteira digital por 48 horas conforme Lei n.º 14/2023.
- Comunicação sigilosa ao Oficial de Compliance AML/CFT.`;
    setGeneratedReport(report);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Sub-navigation tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab('pci_dss')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pci_dss'
              ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Lock className="w-4 h-4 text-red-300" />
          <span>PCI DSS v4.0 (12 Requisitos & Tokenização)</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc_aml')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'kyc_aml'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4 text-cyan-300" />
          <span>KYC/AML, Triagem PEP & Reporte GIFiM</span>
        </button>

        <button
          onClick={() => setActiveTab('data_protection')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'data_protection'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white shadow-lg shadow-purple-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-300" />
          <span>Protecção de Dados Pessoais (LGPD/RGPD MZ)</span>
        </button>

        <button
          onClick={() => setActiveTab('bdm_licensing')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'bdm_licensing'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Building className="w-4 h-4 text-emerald-300" />
          <span>Licenciamento no Banco de Moçambique (Lei 1/2024 & EME)</span>
        </button>
      </div>

      {/* 1. PCI DSS v4.0 */}
      {activeTab === 'pci_dss' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/40 border border-red-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-red-400 font-mono uppercase tracking-wider mb-1">
                <span>Padrão Global de Segurança de Cartões</span>
              </div>
              <h3 className="text-lg font-black text-white">
                PCI DSS v4.0: Arquitetura Zero-Storage & Tokenização
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                A UBlue TV adota a política estrita de não armazenamento de dados confidenciais de titulares de cartões (Zero-Storage de PAN e CVV/CVC). Toda a captura de cartões é tokenizada diretamente na Rede SIMO Ponto 24 e adquirentes internacionais certificados Level 1.
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-mono font-bold border border-red-500/30 shrink-0 text-center">
              <div>COMPLIANCE SCORE</div>
              <div className="text-base font-black text-white">{pciScore} / 12 REQUISITOS</div>
            </div>
          </div>

          {/* 12 Requisitos do PCI DSS */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">Matriz Interativa dos 12 Requisitos PCI DSS</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'req1', title: '1. Firewall e Controlo de Rede', desc: 'Isolamento de nós com DMZ estrita.' },
                { id: 'req2', title: '2. Senhas Seguras e Parâmetros Padrão', desc: 'Eliminação total de credenciais default.' },
                { id: 'req3', title: '3. Protecção de Dados do Titular', desc: 'Zero-Storage: CVV nunca salvo.' },
                { id: 'req4', title: '4. Criptografia em Trânsito', desc: 'TLS 1.3 obrigatório ponta a ponta.' },
                { id: 'req5', title: '5. Protecção contra Malware', desc: 'Monitoramento contínuo em contêineres.' },
                { id: 'req6', title: '6. Desenvolvimento Seguro', desc: 'Revisão SAST/DAST em pipelines CI/CD.' },
                { id: 'req7', title: '7. Acesso por Necessidade', desc: 'Princípio do menor privilégio (RBAC).' },
                { id: 'req8', title: '8. Identificação e MFA', desc: 'Autenticação multifator obrigatória.' },
                { id: 'req9', title: '9. Segurança Física', desc: 'Controle biométrico em datacenters parceiros.' },
                { id: 'req10', title: '10. Registo e Auditoria de Logs', desc: 'Logs imutáveis sincronizados por NTP.' },
                { id: 'req11', title: '11. Testes de Penetração', desc: 'Pen-tests semestrais por consultoria externa.' },
                { id: 'req12', title: '12. Política de Segurança da Informação', desc: 'Governança e auditoria anual por QSA.' },
              ].map(req => (
                <div
                  key={req.id}
                  onClick={() => togglePciCheck(req.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer select-none ${
                    pciChecks[req.id]
                      ? 'bg-slate-950 border-emerald-500/40 text-slate-200'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-white">{req.title}</span>
                    <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      pciChecks[req.id] ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {pciChecks[req.id] ? '✓' : ''}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{req.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. KYC / AML & GIFiM */}
      {activeTab === 'kyc_aml' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Simulador de Verificação KYC */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <UserCheck className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-white text-sm">Simulador de Validação KYC (Conheça o Seu Cliente)</h4>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Nome Completo do Titular:</label>
                <input
                  type="text"
                  value={kycName}
                  onChange={(e) => setKycName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Tipo de Documento:</label>
                  <select
                    value={kycDocType}
                    onChange={(e) => setKycDocType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="bi">BI Moçambicano</option>
                    <option value="dire">DIRE (Estrangeiro Residente)</option>
                    <option value="passaporte">Passaporte Internacional</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">N.º do Documento:</label>
                  <input
                    type="text"
                    value={kycDocNumber}
                    onChange={(e) => setKycDocNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">NUIT Fiscal:</label>
                  <input
                    type="text"
                    value={kycNuit}
                    onChange={(e) => setKycNuit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Nível de Acesso Pretendido:</label>
                  <select
                    value={kycTier}
                    onChange={(e) => setKycTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="tier1">Nível 1 (Até 2.500 MT/dia)</option>
                    <option value="tier2">Nível 2 (Até 25.000 MT/dia)</option>
                    <option value="tier3">Nível 3 (B2B Ilimitado)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pepCheck"
                  checked={isPepCheck}
                  onChange={(e) => setIsPepCheck(e.target.checked)}
                  className="rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="pepCheck" className="text-xs text-slate-300">
                  Pessoa Politicamente Exposta (PEP) ou familiar próximo
                </label>
              </div>

              <button
                onClick={handleSimulateKycVerification}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                Validar Identidade & Consultar Listas Restritivas
              </button>

              {kycResult && (
                <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 text-xs leading-relaxed">
                  {kycResult}
                </div>
              )}
            </div>

            {/* Gerador de COS ao GIFiM */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-sm">Comunicação de Operação Suspeita (GIFiM Moçambique)</h4>
              </div>

              <p className="text-xs text-slate-400">
                Obrigação legal perante o Gabinete de Informação Financeira de Moçambique ao abrigo da Lei de Prevenção e Combate ao Branqueamento de Capitais e Financiamento do Terrorismo.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Montante Atípico (MT):</label>
                  <input
                    type="number"
                    value={gifimAmount}
                    onChange={(e) => setGifimAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">MSISDN Investigado:</label>
                  <input
                    type="text"
                    value={gifimMsisdn}
                    onChange={(e) => setGifimMsisdn(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Motivo do Alerta / Suspeita:</label>
                <textarea
                  rows={2}
                  value={gifimReason}
                  onChange={(e) => setGifimReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <button
                onClick={handleGenerateGifimReport}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md cursor-pointer transition-colors"
              >
                Gerar Minuta Oficial da Notificação COS (GIFiM)
              </button>

              {generatedReport && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-amber-200/90 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                  {generatedReport}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PROTECÇÃO DE DADOS PESSOAIS */}
      {activeTab === 'data_protection' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-white text-base">Protecção de Dados Pessoais & Privacidade UBlue</h4>
                <p className="text-xs text-slate-400">Em conformidade com a legislação moçambicana e equivalentes internacionais (RGPD / LGPD).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400 block">Consentimento Explícito (Opt-In):</span>
                <p className="text-slate-400 leading-relaxed">
                  Nenhum dado cadastral ou histórico de consumo de streaming é compartilhado com parceiros ou anunciantes sem autorização prévia e inequívoca do utilizador.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-400 block">Direito ao Esquecimento & Retificação:</span>
                <p className="text-slate-400 leading-relaxed">
                  Os assinantes podem a qualquer momento solicitar a exportação completa de seus dados em JSON ou a eliminação definitiva de registros pessoais da plataforma.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 block">Auditoria de Logs Criptografados:</span>
                <p className="text-slate-400 leading-relaxed">
                  Todo acesso administrativo a tabelas de utilizadores é assinado digitalmente e mantido em log WORM (Write Once, Read Many) inviolável por 5 anos.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. LICENCIAMENTO NO BANCO DE MOÇAMBIQUE */}
      {activeTab === 'bdm_licensing' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-white text-base">
                  Licenciamento de Instituições de Pagamento e EME (Lei n.º 1/2024)
                </h4>
                <p className="text-xs text-slate-400">
                  Roteiro regulatório perante o Departamento de Supervisão de Sistemas de Pagamento do Banco de Moçambique.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  step: '1. Pedido de Autorização Prévia ao BdM',
                  desc: 'Apresentação do plano de negócios a 3 anos, estudo de viabilidade técnica, arquitetura de sistemas e idoneidade dos administradores (Fit & Proper Test).',
                  status: 'Concluído'
                },
                {
                  step: '2. Realização do Capital Social Mínimo',
                  desc: 'Comprovação de capital integralizado de 20.000.000 MT para Emissor de Moeda Electrónica (EME) ou 5.000.000 MT para Iniciação de Pagamentos.',
                  status: 'Em Conformidade'
                },
                {
                  step: '3. Abertura de Contas de Salvaguarda (Escrow Segregado)',
                  desc: 'Depósito integral do saldo fiduciário equivalente ao valor da moeda eletrônica emitida em banco comercial autorizado em Moçambique, protegido contra credores.',
                  status: 'Ativo'
                },
                {
                  step: '4. Políticas de Continuidade de Negócio e Disaster Recovery',
                  desc: 'Infraestrutura com réplica ativa em centros de dados distintos em Moçambique (RTO < 15 min, RPO < 1 seg).',
                  status: 'Validado'
                },
                {
                  step: '5. Vistoria Técnica e Licença de Operação Definitiva',
                  desc: 'Inspeção presencial dos servidores pelo Banco de Moçambique, testes de estresse e homologação na Rede SIMO Ponto 24.',
                  status: 'Fase Final'
                }
              ].map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-white block">{s.step}</span>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
