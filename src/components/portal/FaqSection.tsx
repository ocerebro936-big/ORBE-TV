import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Como funciona o pagamento via M-Pesa ou E-Mola?',
      a: 'É imediato e 100% digital. Ao escolher seu pacote (de 25 MT a 500 MT), digite o seu número Vodacom (84/85) ou Movitel (86/87). Você receberá na mesma hora uma notificação USSD no seu telemóvel para digitar o seu PIN de segurança. Em segundos, sua assinatura é liberada no app.'
    },
    {
      q: 'O aplicativo UBlue TV gasta muitos dados de internet?',
      a: 'Não! Desenvolvemos o UBlue TV especificamente para as redes móveis moçambicanas. Com os codecs inteligentes de compressão H.265 e AV1, o app consome até 60% menos megabytes do que reprodutores de vídeo convencionais, permitindo assistir até com sinal 3G.'
    },
    {
      q: 'O que é o UBlue Content Engine e de onde vêm os canais?',
      a: 'O UBlue Content Engine é o cérebro do aplicativo. Ele unifica com segurança fontes oficiais, emissoras parceiras e conectores autorizados (YouTube parceiro, rádio FM, metadados de filmes, notícias e eventos esportivos). Para você, tudo aparece de forma integrada em uma única experiência fluida.'
    },
    {
      q: 'Posso assistir na minha Smart TV ou computador?',
      a: 'Sim! Você pode acessar o site oficial pelo navegador da sua Smart TV ou computador e clicar em "Assistir Agora", ou transmitir do aplicativo do seu telemóvel para qualquer tela compatível com Chromecast ou AirPlay.'
    },
    {
      q: 'Se eu contratar o pacote de 25 MT (UBlue Start), posso mudar para o UBlue Basic depois?',
      a: 'Com certeza! Você tem total flexibilidade para fazer upgrade a qualquer momento pelo aplicativo ou pelo site, pagando apenas a diferença via M-Pesa ou E-Mola.'
    },
    {
      q: 'Como entro em contato com o suporte da UBlue TV?',
      a: 'Temos atendimento em português e línguas locais 24/7 via WhatsApp oficial (+258 84 000 0000) e através do formulário de suporte e chat em tempo real dentro do ecossistema.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-[#050814] via-[#080d22] to-[#050814] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Tire Suas Dúvidas</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Tudo o que você precisa saber sobre o aplicativo, pagamentos e canais.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Callout */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400 mb-3">Ainda tem dúvidas ou precisa de ajuda técnica?</p>
          <a
            href="https://wa.me/258840000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-600/30 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Falar com Atendimento no WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
