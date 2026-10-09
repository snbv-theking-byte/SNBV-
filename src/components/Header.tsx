import React from 'react';
import { Volume2, VolumeX, Sparkles, Rocket } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface HeaderProps {
  activeTab: 'constelacion' | 'mapa' | 'terminal' | 'flota' | 'scripts';
  setActiveTab: (tab: 'constelacion' | 'mapa' | 'terminal' | 'flota' | 'scripts') => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onDeployFleet: () => void;
  onOpenEmblems: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onDeployFleet,
  onOpenEmblems,
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundEngine.enabled = next;
    if (next) soundEngine.playBlip(720);
  };

  return (
    <header className="border-b border-slate-800 bg-[#0d111a]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Zone */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('constelacion');
            soundEngine.playVintageChime();
          }}
          className="font-tech text-xl sm:text-2xl font-bold tracking-wider text-slate-100 hover:text-amber-300 transition-colors flex items-center gap-2 group shrink-0"
        >
          <span className="text-amber-400 group-hover:rotate-45 transition-transform duration-300">✦</span>
          <span>SNBV™</span>
          <span className="text-xs font-mono font-normal text-slate-400 hidden sm:inline tracking-normal">
            CONSTELACIÓN
          </span>
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              setActiveTab('constelacion');
              soundEngine.playKeyClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'constelacion'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Constelación de Todos
          </button>
          <button
            onClick={() => {
              setActiveTab('mapa');
              soundEngine.playKeyClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'mapa'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Bases Terrestres
          </button>
          <button
            onClick={() => {
              setActiveTab('flota');
              soundEngine.playKeyClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'flota'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Naves de Colores™
          </button>
          <button
            onClick={() => {
              setActiveTab('terminal');
              soundEngine.playKeyClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'terminal'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Terminal Bash [DAILY]
          </button>
          <button
            onClick={() => {
              setActiveTab('scripts');
              soundEngine.playKeyClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'scripts'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'hover:text-slate-200'
            }`}
          >
            Editor de Scripts
          </button>
          <button
            onClick={() => {
              onOpenEmblems();
              soundEngine.playKeyClick();
            }}
            className="whitespace-nowrap text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            Emblemas ASCII
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Silenciar audio' : 'Activar audio'}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            title={soundEnabled ? 'Sonido activado (clic para silenciar)' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              onDeployFleet();
              soundEngine.playWarpDrive();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 transition-all rounded-lg shadow-sm whitespace-nowrap"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Desplegar</span> Flota
          </button>
        </div>
      </div>
    </header>
  );
};
