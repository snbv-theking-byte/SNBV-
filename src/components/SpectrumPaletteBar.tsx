import React from 'react';
import { soundEngine } from '../utils/sound';

interface SpectrumPaletteBarProps {
  selectedColor: string | null;
  onSelectColor: (hex: string | null) => void;
  onRunAppleScript: () => void;
}

const SPECTRUM_BANDS = [
  { hex: '#61BB46', name: 'Verde Manzana', wavelength: '520 nm', label: 'BANDA 1' },
  { hex: '#FDB827', name: 'Amarillo Solar', wavelength: '580 nm', label: 'BANDA 2' },
  { hex: '#F58220', name: 'Naranja Fénix', wavelength: '605 nm', label: 'BANDA 3' },
  { hex: '#E03A3E', name: 'Rojo Rubí', wavelength: '650 nm', label: 'BANDA 4' },
  { hex: '#963D97', name: 'Púrpura Cósmico', wavelength: '420 nm', label: 'BANDA 5' },
  { hex: '#009DDC', name: 'Azul Bondi', wavelength: '470 nm', label: 'BANDA 6' },
];

export const SpectrumPaletteBar: React.FC<SpectrumPaletteBarProps> = ({
  selectedColor,
  onSelectColor,
  onRunAppleScript,
}) => {
  return (
    <div className="w-full bg-[#0b0e14] border-b border-slate-800/80 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-tech text-amber-400 font-semibold tracking-wider">
            ✦ APPLE™ COLOURS™
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 font-mono hidden md:inline">
            C:\Documentos\SERGIO Berlanga\DAILY
          </span>
        </div>

        {/* 6-Color Interactive Ribbons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {SPECTRUM_BANDS.map((band) => {
            const isSelected = selectedColor === band.hex;
            return (
              <button
                key={band.hex}
                onClick={() => {
                  if (isSelected) {
                    onSelectColor(null);
                  } else {
                    onSelectColor(band.hex);
                    soundEngine.playBlip(parseInt(band.wavelength));
                  }
                }}
                title={`${band.name} (${band.wavelength}) - Clic para filtrar nave`}
                className={`group flex items-center gap-1.5 px-2.5 py-1 rounded transition-all border ${
                  isSelected
                    ? 'border-white bg-slate-800 scale-105 shadow-sm'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                  style={{ backgroundColor: band.hex, boxShadow: `0 0 8px ${band.hex}55` }}
                />
                <span className="font-mono text-[11px] text-slate-300 whitespace-nowrap">
                  {band.name.split(' ')[0]}
                </span>
                <span className="font-mono text-[10px] text-slate-500 hidden lg:inline">
                  {band.wavelength}
                </span>
              </button>
            );
          })}

          {selectedColor && (
            <button
              onClick={() => onSelectColor(null)}
              className="text-[11px] text-amber-400 hover:underline px-1.5"
            >
              Restablecer
            </button>
          )}
        </div>

        {/* Quick action button for the retro script */}
        <button
          onClick={onRunAppleScript}
          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 py-1 px-2 border border-emerald-900/40 rounded bg-emerald-950/20 transition-colors whitespace-nowrap"
        >
          <span>▶ Ejecutar APPLE™_ITʼS.BACK™.sh</span>
        </button>
      </div>
    </div>
  );
};
