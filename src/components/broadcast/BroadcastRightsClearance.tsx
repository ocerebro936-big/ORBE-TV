import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  Lock,
  Globe2,
  DollarSign,
  Calendar,
  User,
  Building,
  Key,
  Download,
  PlusCircle,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { TerritorialRights, MonetizationContractModel } from '../../types/broadcast-network';
import { soundEffects } from '../../services/sound-effects';

interface ContractRecord {
  id: string;
  contractNumber: string;
  title: string;
  category: string;
  rightsOwner: string;
  representative: string;
  nuit: string;
  validityPeriod: string;
  territory: TerritorialRights;
  monetizationModel: MonetizationContractModel;
  revShareCreator: number; // e.g. 70
  revSharePlatform: number; // e.g. 30
  status: 'ativo' | 'em_analise' | 'expirado';
  certificateHash: string;
  signedDate: string;
}

export const BroadcastRightsClearance: React.FC = () => {
  const [contracts, setContracts] = useState<ContractRecord[]>([
    {
      id: 'ctr-01',
      contractNumber: 'UBLUE-CLR-2026-0841',
      title: 'Videoclipe Oficial "Menina da Polana"',
      category: 'Música & Audiovisual',
      rightsOwner: 'Délio Silva Matola',
      representative: 'Délio Matola (Autor & Compositor)',
      nuit: '104829104',
      validityPeriod: '24 Meses (Até Setembro 2028)',
      territory: 'mz_exclusive',
      monetizationModel: 'revshare_70_30',
      revShareCreator: 70,
      revSharePlatform: 30,
      status: 'ativo',
      certificateHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      signedDate: '24/09/2026'
    },
    {
      id: 'ctr-02',
      contractNumber: 'UBLUE-CLR-2026-0912',
      title: 'Spot Publicitário M-Pesa Empresas',
      category: 'Publicidade Institucional',
      rightsOwner: 'Vodacom Moçambique & M-Pesa S.A.',
      representative: 'Dra. Luísa Guambe (Directora de Marketing)',
      nuit: '400192837',
      validityPeriod: '12 Meses (Renovável)',
      territory: 'mz_exclusive',
      monetizationModel: 'patrocinio',
      revShareCreator: 0,
      revSharePlatform: 100,
      status: 'ativo',
      certificateHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      signedDate: '23/09/2026'
    },
    {
      id: 'ctr-03',
      contractNumber: 'UBLUE-CLR-2026-0775',
      title: 'Série Escolar "Saber & Crescer"',
      category: 'Educação & Formação',
      rightsOwner: 'Instituto Pedagógico de Moçambique',
      representative: 'Prof. Américo Cossa',
      nuit: '500294819',
      validityPeriod: '36 Meses (Multi-ano)',
      territory: 'palop',
      monetizationModel: 'revshare_70_30',
      revShareCreator: 70,
      revSharePlatform: 30,
      status: 'ativo',
      certificateHash: '9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7',
      signedDate: '22/09/2026'
    },
    {
      id: 'ctr-04',
      contractNumber: 'UBLUE-CLR-2026-1020',
      title: 'Longa-Metragem "O Resgate do Zambeze"',
      category: 'Cinema & Ficção',
      rightsOwner: 'Kanimambo Filmes Lda.',
      representative: 'Inácio Tembe (Produtor Executivo)',
      nuit: '400812948',
      validityPeriod: 'Perpétua (Exibição Global)',
      territory: 'global',
      monetizationModel: 'revshare_70_30',
      revShareCreator: 75,
      revSharePlatform: 25,
      status: 'em_analise',
      certificateHash: '12b6a8a4f91cf6456247fb217277685f76e06b9868e64e138a0cbf69e6ee08dd',
      signedDate: '25/09/2026'
    }
  ]);

  const [selectedContract, setSelectedContract] = useState<ContractRecord>(contracts[0]);
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);

  // New Contract Form State
  const [newTitle, setNewTitle] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newRepresentative, setNewRepresentative] = useState('');
  const [newNuit, setNewNuit] = useState('');
  const [newPeriod, setNewPeriod] = useState('12 Meses');
  const [newTerritory, setNewTerritory] = useState<TerritorialRights>('mz_exclusive');
  const [newMonetization, setNewMonetization] = useState<MonetizationContractModel>('revshare_70_30');
  const [newCreatorPercent, setNewCreatorPercent] = useState<number>(70);

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newOwner) return;

    const contractId = `ctr-${Date.now()}`;
    const contractNum = `UBLUE-CLR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: ContractRecord = {
      id: contractId,
      contractNumber: contractNum,
      title: newTitle,
      category: 'Geral',
      rightsOwner: newOwner,
      representative: newRepresentative || newOwner,
      nuit: newNuit || '400999999',
      validityPeriod: newPeriod,
      territory: newTerritory,
      monetizationModel: newMonetization,
      revShareCreator: newCreatorPercent,
      revSharePlatform: 100 - newCreatorPercent,
      status: 'ativo',
      certificateHash: 'f8a42b103c899e46a782b130761e88849b29104c89104bf78201a4e819b10492',
      signedDate: new Date().toLocaleDateString('pt-PT')
    };

    setContracts([newRecord, ...contracts]);
    setSelectedContract(newRecord);
    setIsNewContractModalOpen(false);
    soundEffects.play('payment_success');

    // Reset
    setNewTitle('');
    setNewOwner('');
  };

  const getTerritoryLabel = (t: TerritorialRights) => {
    switch (t) {
      case 'mz_exclusive':
        return 'Moçambique Exclusivo';
      case 'palop':
        return 'Países PALOP (Moçambique, Angola, Cabo Verde, etc.)';
      case 'sadc':
        return 'África Austral (Região SADC)';
      case 'global':
        return 'Transmissão Mundial (Global / Diáspora)';
    }
  };

  const getMonetizationLabel = (m: MonetizationContractModel) => {
    switch (m) {
      case 'revshare_70_30':
        return 'Partilha de Receita (70% Criador / 30% UBlue)';
      case 'flat_fee':
        return 'Valor Fixo por Exibição (Flat Fee)';
      case 'royalty_per_minute':
        return 'Royalty por Minuto Assistido';
      case 'patrocinio':
        return 'Patrocínio Comercial Direto';
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-blue-950 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/30 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Broadcast Clearance & Direitos de Transmissão</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            Gestão Jurídica de Conteúdos & Contratos Digitais
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Para que a UBlue TV opere com a máxima conformidade legal, cada música, filme, série, videoclipe ou evento exibido é amparado por autorização explícita do titular dos direitos com <strong>definição de proprietário, período, países autorizados e percentagem de monetização</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setIsNewContractModalOpen(true);
                soundEffects.play('notification');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Novo Contrato de Licenciamento</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Contracts List + Digital Agreement Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contracts Master List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Contratos em Vigor ({contracts.length})
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono">100% Verificados</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {contracts.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedContract(c);
                  soundEffects.play('notification');
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedContract.id === c.id
                    ? 'bg-blue-900/30 border-cyan-400 shadow-xl'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-cyan-400 font-bold">{c.contractNumber}</span>
                  {c.status === 'ativo' && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Ativo
                    </span>
                  )}
                  {c.status === 'em_analise' && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                      Em Análise
                    </span>
                  )}
                </div>

                <div className="text-sm font-bold text-white mb-1">{c.title}</div>
                <div className="text-xs text-slate-300">{c.rightsOwner}</div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>RevShare: <strong className="text-emerald-400">{c.revShareCreator}% Criador</strong></span>
                  <span>{c.signedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Digital Legal Certificate & Term Details */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-blue-600/30 text-cyan-300 border border-blue-500/30 text-[10px] font-mono font-bold">
                    MINUTA DIGITAL OFICIAL
                  </span>
                  <span className="text-xs font-mono text-slate-400">{selectedContract.contractNumber}</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedContract.title}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Homologado INCM / GABINFO
                </span>
              </div>
            </div>

            {/* Contract Key Terms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>1. Proprietário dos Direitos:</span>
                </div>
                <div className="font-bold text-white text-sm">{selectedContract.rightsOwner}</div>
                <div className="text-[11px] text-slate-400">Representante: {selectedContract.representative}</div>
                <div className="text-[11px] text-cyan-300 font-mono">NUIT: {selectedContract.nuit}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>2. Período de Exibição (Vigência):</span>
                </div>
                <div className="font-bold text-white text-sm">{selectedContract.validityPeriod}</div>
                <div className="text-[11px] text-slate-400">Início: {selectedContract.signedDate}</div>
                <div className="text-[11px] text-emerald-400 font-mono">Renovação: Automática sob aviso prévio</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. Países e Territórios Autorizados:</span>
                </div>
                <div className="font-bold text-white text-sm">{getTerritoryLabel(selectedContract.territory)}</div>
                <div className="text-[11px] text-slate-400">Geotargeting IP & DRM: Ativo no player</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>4. Forma de Monetização & Repasse:</span>
                </div>
                <div className="font-bold text-emerald-400 text-sm">{getMonetizationLabel(selectedContract.monetizationModel)}</div>
                <div className="text-[11px] text-slate-300 font-bold">
                  Divisão: {selectedContract.revShareCreator}% Titular / {selectedContract.revSharePlatform}% UBlue TV
                </div>
              </div>
            </div>

            {/* Legal Certificate Verification Stamp */}
            <div className="p-4 rounded-2xl bg-black/60 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  Hash Criptográfico de Assinatura (SHA-256):
                </span>
                <span className="text-emerald-400">Verificado OK</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-cyan-300 break-all border border-cyan-500/20">
                {selectedContract.certificateHash}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-2">
                <span>Registado no Sistema de Telecomunicações e Radiodifusão de Moçambique.</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  soundEffects.play('content_ready');
                  alert(`Certificado digital ${selectedContract.contractNumber} pronto para descarregar em formato PDF assinado.`);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descarregar Certificado de Licenciamento (PDF)</span>
              </button>

              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-cyan-400" />
                <span>Proteção Digital UBlue Entitlement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Contract Modal */}
      {isNewContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d20] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">Novo Contrato Digital de Transmissão</h3>
                <p className="text-xs text-slate-400">Emissão de termo legal e cessão para transmissão broadcast</p>
              </div>
              <button
                onClick={() => setIsNewContractModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Título da Obra / Programa:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Videoclipe 'Ritmos do Índico' ou Filme 'Noites de Maputo'"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Proprietário / Titular:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do Criador ou Produtora"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">NUIT do Titular:</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 400192837"
                    value={newNuit}
                    onChange={(e) => setNewNuit(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Período de Exibição:</label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500"
                  >
                    <option value="6 Meses">6 Meses</option>
                    <option value="12 Meses">12 Meses</option>
                    <option value="24 Meses">24 Meses</option>
                    <option value="Perpétua">Licença Perpétua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Territórios Autorizados:</label>
                  <select
                    value={newTerritory}
                    onChange={(e) => setNewTerritory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500"
                  >
                    <option value="mz_exclusive">Moçambique Exclusivo</option>
                    <option value="palop">PALOP</option>
                    <option value="sadc">África Austral (SADC)</option>
                    <option value="global">Transmissão Global</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Modelo de Monetização:</label>
                  <select
                    value={newMonetization}
                    onChange={(e) => setNewMonetization(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500"
                  >
                    <option value="revshare_70_30">RevShare (70/30)</option>
                    <option value="flat_fee">Flat Fee por Exibição</option>
                    <option value="royalty_per_minute">Royalty por Minuto</option>
                    <option value="patrocinio">Patrocínio Direto</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    Percentagem do Criador (%):
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={90}
                    value={newCreatorPercent}
                    onChange={(e) => setNewCreatorPercent(parseInt(e.target.value, 10))}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-emerald-500 font-bold text-emerald-400"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-slate-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Ao submeter, será gerado automaticamente um carimbo criptográfico SHA-256 e a minuta digital será arquivada no portal com validade legal plena em território moçambicano.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewContractModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold uppercase tracking-wider shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Emitir e Assinar Digitalmente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
