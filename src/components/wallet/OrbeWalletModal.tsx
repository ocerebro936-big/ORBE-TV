import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Smartphone, CreditCard, Send, CheckCircle2, History, ShieldCheck, DollarSign, RefreshCw } from 'lucide-react';
import { WalletTransaction } from '../../types/ecosystem';

interface OrbeWalletState {
  balanceMT: number;
  pendingMT: number;
  totalWithdrawnMT: number;
  phoneNumber: string;
  transactions: WalletTransaction[];
}

interface OrbeWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaySubscription?: (tier: any) => void;
  onOpenFinanceCenter?: () => void;
}

export const OrbeWalletModal: React.FC<OrbeWalletModalProps> = ({
  isOpen,
  onClose,
  onPaySubscription,
  onOpenFinanceCenter,
}) => {
  const [wallet, setWallet] = useState<OrbeWalletState>({
    balanceMT: 42680,
    pendingMT: 3450,
    totalWithdrawnMT: 125000,
    phoneNumber: '84 123 4567',
    transactions: [
      {
        id: 'tx-1',
        type: 'earning',
        amountMT: 3950,
        description: 'Receita CPM de Visualizações (Podcast Voz Urbana)',
        timestamp: 'Hoje, 09:15',
        method: 'Saldo ORBE',
        status: 'concluido',
        referenceId: 'MP-89214-MZ'
      },
      {
        id: 'tx-2',
        type: 'withdrawal',
        amountMT: -10000,
        description: 'Levantamento para M-Pesa (+258 84 123 4567)',
        timestamp: 'Ontem, 16:40',
        method: 'M-Pesa',
        status: 'concluido',
        referenceId: 'MP-88301-MZ'
      },
      {
        id: 'tx-3',
        type: 'subscription-fee',
        amountMT: -250,
        description: 'Renovação do Pacote ORBE Médio',
        timestamp: '22 Set 2026',
        method: 'M-Pesa',
        status: 'concluido',
        referenceId: 'MP-87112-MZ'
      },
      {
        id: 'tx-4',
        type: 'ppv-ticket',
        amountMT: -150,
        description: 'Ingresso PPV: Concerto da Marrabenta em Direto',
        timestamp: '19 Set 2026',
        method: 'E-Mola',
        status: 'concluido',
        referenceId: 'EM-44219-MZ'
      }
    ]
  });

  const [activeAction, setActiveAction] = useState<'none' | 'withdraw' | 'transfer' | 'topup' | 'ppv'>('none');
  const [amountInput, setAmountInput] = useState('2000');
  const [targetPhone, setTargetPhone] = useState('84 000 0000');
  const [targetMethod, setTargetMethod] = useState<'M-Pesa' | 'E-Mola' | 'Cartão' | 'Transferência Bancária'>('M-Pesa');
  const [isProcessing, setIsProcessing] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amountInput);
    if (val <= 0 || val > wallet.balanceMT) {
      setNoticeMsg({ text: 'Valor de levantamento inválido ou saldo insuficiente!', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'withdrawal',
        amountMT: -val,
        description: `Levantamento para ${targetMethod} (${targetPhone})`,
        timestamp: 'Agora mesmo',
        method: targetMethod,
        status: 'concluido',
        referenceId: `REF-${Math.floor(Math.random() * 90000) + 10000}`
      };

      setWallet({
        ...wallet,
        balanceMT: wallet.balanceMT - val,
        totalWithdrawnMT: wallet.totalWithdrawnMT + val,
        transactions: [newTx, ...wallet.transactions]
      });

      setIsProcessing(false);
      setActiveAction('none');
      setNoticeMsg({ text: `Levantamento de ${val} MT enviado com sucesso para ${targetPhone} via ${targetMethod}!`, type: 'success' });
    }, 1200);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amountInput);
    if (val <= 0 || val > wallet.balanceMT) {
      setNoticeMsg({ text: 'Valor de transferência inválido ou saldo insuficiente!', type: 'error' });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'transfer-out',
        amountMT: -val,
        description: `Transferência de saldo para ${targetPhone}`,
        timestamp: 'Agora mesmo',
        method: 'Saldo ORBE',
        status: 'concluido',
        referenceId: `TR-${Math.floor(Math.random() * 90000) + 10000}`
      };

      setWallet({
        ...wallet,
        balanceMT: wallet.balanceMT - val,
        transactions: [newTx, ...wallet.transactions]
      });

      setIsProcessing(false);
      setActiveAction('none');
      setNoticeMsg({ text: `Saldo de ${val} MT transferido com sucesso para ${targetPhone}!`, type: 'success' });
    }, 1200);
  };

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(amountInput);
    setIsProcessing(true);

    setTimeout(() => {
      const newTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'earning',
        amountMT: val,
        description: `Recarga de saldo via ${targetMethod}`,
        timestamp: 'Agora mesmo',
        method: targetMethod,
        status: 'concluido',
        referenceId: `RC-${Math.floor(Math.random() * 90000) + 10000}`
      };

      setWallet({
        ...wallet,
        balanceMT: wallet.balanceMT + val,
        transactions: [newTx, ...wallet.transactions]
      });

      setIsProcessing(false);
      setActiveAction('none');
      setNoticeMsg({ text: `Saldo recarregado com sucesso! Novo saldo: ${wallet.balanceMT + val} MT`, type: 'success' });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in text-left">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#080d22] border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#080d22] rounded-[14px] flex items-center justify-center text-emerald-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">UBlue Wallet</h3>
            <p className="text-xs text-slate-400 font-mono">Carteira Digital Moçambicana · M-Pesa & E-Mola</p>
          </div>
        </div>

        {/* Inline Notice Banner */}
        {noticeMsg && (
          <div className={`mb-5 p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-2 animate-fade-in ${
            noticeMsg.type === 'success'
              ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
              : 'bg-red-950/70 border-red-500/50 text-red-300'
          }`}>
            <span>{noticeMsg.text}</span>
            <button
              onClick={() => setNoticeMsg(null)}
              className="font-bold text-xs hover:text-white px-2 py-0.5 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Balance Card */}
        <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Saldo Disponível
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                {wallet.balanceMT.toLocaleString('pt-PT')}
              </span>
              <span className="text-lg font-bold text-emerald-400">MT</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
              <span>A liberar: <strong className="text-cyan-400">{wallet.pendingMT.toLocaleString('pt-PT')} MT</strong></span>
              <span>·</span>
              <span>Total já sacado: <strong className="text-white">{wallet.totalWithdrawnMT.toLocaleString('pt-PT')} MT</strong></span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveAction('withdraw')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Levantar (M-Pesa)</span>
            </button>

            <button
              onClick={() => setActiveAction('transfer')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-4 h-4" />
              <span>Transferir</span>
            </button>

            <button
              onClick={() => setActiveAction('topup')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold cursor-pointer"
            >
              + Recarregar
            </button>

            {onOpenFinanceCenter && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFinanceCenter();
                }}
                className="px-3.5 py-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900/80 text-cyan-300 border border-blue-500/40 text-xs font-bold cursor-pointer flex items-center gap-1.5"
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Gateway M-Pesa & Conciliação (Fase 2)</span>
              </button>
            )}
          </div>
        </div>

        {/* Action Panel: Withdraw */}
        {activeAction === 'withdraw' && (
          <form onSubmit={handleWithdrawal} className="p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 mb-6 space-y-3.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
              <span className="text-emerald-400">Levantamento Rápido</span>
              <button type="button" onClick={() => setActiveAction('none')} className="text-slate-400 hover:text-white">Cancelar</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Método de Destino:</label>
                <select
                  value={targetMethod}
                  onChange={(e) => setTargetMethod(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white"
                >
                  <option>M-Pesa</option>
                  <option>E-Mola</option>
                  <option>Transferência Bancária</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Número do Celular / Conta:</label>
                <input
                  type="text"
                  value={targetPhone}
                  onChange={(e) => setTargetPhone(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Valor a Sacar (MT):</label>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                max={wallet.balanceMT}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white font-mono text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? 'Processando saque no M-Pesa...' : `Confirmar Levantamento de ${amountInput} MT`}
            </button>
          </form>
        )}

        {/* Action Panel: Transfer */}
        {activeAction === 'transfer' && (
          <form onSubmit={handleTransfer} className="p-5 rounded-2xl bg-slate-900 border border-blue-500/40 mb-6 space-y-3.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
              <span className="text-blue-400">Transferência entre Contas UBlue</span>
              <button type="button" onClick={() => setActiveAction('none')} className="text-slate-400 hover:text-white">Cancelar</button>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Telefone UBlue do Destinatário ou @handle:</label>
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                placeholder="Ex: 84 987 6543 ou @studiozambezia"
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Valor a Transferir (MT):</label>
              <input
                type="number"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                max={wallet.balanceMT}
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white font-mono text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              {isProcessing ? 'Enviando transferência...' : `Transferir ${amountInput} MT Agora`}
            </button>
          </form>
        )}

        {/* Action Panel: Topup */}
        {activeAction === 'topup' && (
          <form onSubmit={handleTopup} className="p-5 rounded-2xl bg-slate-900 border border-purple-500/40 mb-6 space-y-3.5 text-xs animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-bold text-white">
              <span className="text-purple-400">Recarga de Saldo</span>
              <button type="button" onClick={() => setActiveAction('none')} className="text-slate-400 hover:text-white">Cancelar</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Método de Recarga:</label>
                <select
                  value={targetMethod}
                  onChange={(e) => setTargetMethod(e.target.value as any)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white"
                >
                  <option>M-Pesa</option>
                  <option>E-Mola</option>
                  <option>Cartão</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Valor (MT):</label>
                <input
                  type="number"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2 text-white font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider cursor-pointer"
            >
              {isProcessing ? 'Recebendo USSD no telemóvel...' : `Adicionar ${amountInput} MT via ${targetMethod}`}
            </button>
          </form>
        )}

        {/* Transactions Ledger */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>Extrato de Movimentações</span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Últimas transações</span>
          </div>

          <div className="space-y-2">
            {wallet.transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    tx.amountMT > 0 ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tx.amountMT > 0 ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-white line-clamp-1">{tx.description}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {tx.timestamp} · {tx.method} · {tx.referenceId}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`font-mono font-bold text-sm ${
                    tx.amountMT > 0 ? 'text-emerald-400' : 'text-slate-200'
                  }`}>
                    {tx.amountMT > 0 ? `+${tx.amountMT}` : tx.amountMT} MT
                  </div>
                  <div className="text-[10px] text-emerald-400 uppercase font-semibold">
                    {tx.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
