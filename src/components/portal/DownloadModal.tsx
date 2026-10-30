import React, { useState } from 'react';
import { X, Smartphone, Apple, Download, CheckCircle2, QrCode, ArrowDown, ExternalLink } from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOs?: 'android' | 'ios';
  onLaunchWebApp: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  initialOs = 'android',
  onLaunchWebApp,
}) => {
  const [selectedOs, setSelectedOs] = useState<'android' | 'ios'>(initialOs);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadFinished, setDownloadFinished] = useState(false);

  if (!isOpen) return null;

  const handleStartDownload = () => {
    setDownloading(true);
    setDownloadProgress(0);
    setDownloadFinished(false);

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 20) + 15;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setDownloadProgress(100);
        setDownloading(false);
        setDownloadFinished(true);
      } else {
        setDownloadProgress(current);
      }
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#090d20] border border-blue-500/30 p-6 sm:p-8 shadow-2xl shadow-blue-900/40 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Baixar App UBlue TV</h3>
            <p className="text-xs text-slate-400">Versão 1.4.2 Oficial · 18.4 MB</p>
          </div>
        </div>

        {/* OS Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800 mb-6">
          <button
            onClick={() => { setSelectedOs('android'); setDownloadFinished(false); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              selectedOs === 'android'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android (APK / Play)</span>
          </button>
          <button
            onClick={() => { setSelectedOs('ios'); setDownloadFinished(false); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
              selectedOs === 'ios'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>iPhone / iPad (iOS)</span>
          </button>
        </div>

        {selectedOs === 'android' ? (
          <div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <ArrowDown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Instalação Direta APK Android</div>
                  <p className="text-xs text-slate-300 mt-1">
                    Compatível com Android 7.0 até Android 15. Compatível com telemóveis Samsung, Xiaomi, Tecno, Infinix, Huawei e outros.
                  </p>
                </div>
              </div>

              {downloading && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                    <span>Baixando UBlueTV-v1.4.2.apk...</span>
                    <span className="font-mono font-bold text-cyan-400">{downloadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-200"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {downloadFinished && (
                <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Download concluído! Abra o arquivo para instalar ou use a versão Web imediatamente.</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleStartDownload}
                disabled={downloading}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Baixando...' : downloadFinished ? 'Baixar Novamente' : 'Baixar APK Direto (18 MB)'}</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onLaunchWebApp();
                }}
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-colors"
              >
                Abrir App no Navegador
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6">
              <h4 className="text-sm font-bold text-white mb-2">Como usar no iPhone & iPad:</h4>
              <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
                <li>Abra o link do UBlue TV no navegador <strong>Safari</strong> do seu iPhone.</li>
                <li>Toque no ícone de <strong>Compartilhar</strong> (quadrado com seta para cima).</li>
                <li>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong>.</li>
                <li>O ícone da UBlue TV aparecerá como um app nativo em tela cheia!</li>
              </ol>
            </div>

            <button
              onClick={() => {
                onClose();
                onLaunchWebApp();
              }}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir Web App no iPhone Agora</span>
            </button>
          </div>
        )}

        {/* QR Code Section */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white p-1 rounded-lg flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-900" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Escanear com a câmera</div>
              <div className="text-[11px] text-slate-400">Aponte para o código para abrir direto no telemóvel</div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-400 font-mono">
            ubluetv.mz/app
          </span>
        </div>

      </div>
    </div>
  );
};
