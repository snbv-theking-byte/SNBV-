import React, { useState } from 'react';
import { RETRO_ASCII_EMBLEMS } from '../data/defaultScripts';
import { Copy, Check, Sparkles, X, Terminal } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface AsciiEmblemModalProps {
  onClose: () => void;
  onSendToTerminal: (art: string) => void;
}

export const AsciiEmblemModal: React.FC<AsciiEmblemModalProps> = ({
  onClose,
  onSendToTerminal,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    soundEngine.playBlip(1040);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const EMBLEM_CARDS = [
    {
      key: 'cross',
      title: 'Estrella Guía SNBV',
      subtitle: 'Cruz estelar de orientación orbital',
      art: RETRO_ASCII_EMBLEMS.cross,
    },
    {
      key: 'bannerBox',
      title: 'Caja Heráldica // CONSTELACIÓN DE TODOS',
      subtitle: 'Emblema institucional SNBV™',
      art: RETRO_ASCII_EMBLEMS.bannerBox,
    },
    {
      key: 'badge',
      title: 'Insignia de Estación ◉',
      subtitle: 'Placa de comando SNBV',
      art: RETRO_ASCII_EMBLEMS.badge,
    },
    {
      key: 'pill',
      title: 'Cápsula de Vuelo SNBV™',
      subtitle: 'Distintivo de fuselaje de naves de colores',
      art: RETRO_ASCII_EMBLEMS.pill,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#0b0e14] border border-amber-500/30 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div>
            <h3 className="font-tech text-lg font-bold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Emblemas Geométricos SNBV™
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Identidad visual oficial de la Constelación de Todos y la Flota Cromática.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {EMBLEM_CARDS.map((emblem) => {
            const isCopied = copiedKey === emblem.key;
            return (
              <div
                key={emblem.key}
                className="bg-[#0f131d] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 mb-0.5">
                    {emblem.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mb-2">{emblem.subtitle}</p>

                  <div className="bg-black/60 border border-slate-900 rounded p-3 text-center my-2">
                    <pre className="font-terminal text-amber-300 text-xs inline-block leading-tight select-all">
                      {emblem.art}
                    </pre>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => copyToClipboard(emblem.art, emblem.key)}
                    className="flex-1 py-1 px-2 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors flex items-center justify-center gap-1"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onSendToTerminal(emblem.art);
                      soundEngine.playKeyClick();
                    }}
                    className="py-1 px-2 text-[11px] font-mono bg-amber-400/20 text-amber-300 hover:bg-amber-400/30 border border-amber-400/30 rounded transition-colors flex items-center gap-1"
                  >
                    <Terminal className="w-3 h-3" />
                    <span>Ver en Shell</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prompt parameters note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Configuración: {`{"orientation":"square","transparent_background":true}`}</span>
          <span className="text-amber-400 font-bold">C: ( SNBV"™ )</span>
        </div>
      </div>
    </div>
  );
};
