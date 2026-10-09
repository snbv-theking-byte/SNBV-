/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SpaceShip, ConstellationStar, ScriptFile, TerminalLine, FleetFormation } from './types';
import { INITIAL_SCRIPTS, INITIAL_SHIPS, CONSTELLATION_STARS, RETRO_ASCII_EMBLEMS } from './data/defaultScripts';
import { Header } from './components/Header';
import { SpectrumPaletteBar } from './components/SpectrumPaletteBar';
import { ConstellationCanvas } from './components/ConstellationCanvas';
import { TerminalConsole } from './components/TerminalConsole';
import { FleetDashboard } from './components/FleetDashboard';
import { ScriptEditorModal } from './components/ScriptEditorModal';
import { AsciiEmblemModal } from './components/AsciiEmblemModal';
import { GroundTrackingMap } from './components/GroundTrackingMap';
import { soundEngine } from './utils/sound';
import { Rocket, Terminal, Compass, FileCode, CheckCircle2, Play, Sparkles, FolderGit2, Globe2 } from 'lucide-react';

export default function App() {
  const [ships, setShips] = useState<SpaceShip[]>(INITIAL_SHIPS);
  const [stars] = useState<ConstellationStar[]>(CONSTELLATION_STARS);
  const [scripts, setScripts] = useState<ScriptFile[]>(INITIAL_SCRIPTS);
  const [activeTab, setActiveTab] = useState<'constelacion' | 'mapa' | 'terminal' | 'flota' | 'scripts'>('constelacion');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [formation, setFormation] = useState<FleetFormation>('constelación');
  const [selectedShip, setSelectedShip] = useState<SpaceShip | null>(null);
  const [selectedStar, setSelectedStar] = useState<ConstellationStar | null>(null);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  // Google Maps Platform API Key from env or provisioned demo key
  const googleMapsApiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAwBR8yM2b9F_qEYEh18QBIu787V-mPixg';

  // Listen to Google Maps Platform quota event
  useEffect(() => {
    const handleQuotaExceeded = () => {
      setIsQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Script editor state
  const [editingScript, setEditingScript] = useState<ScriptFile | null>(null);
  const [showEmblemsModal, setShowEmblemsModal] = useState(false);
  const [activeScriptExecuting, setActiveScriptExecuting] = useState<string | null>(null);

  // Terminal state
  const [terminalLogs, setTerminalLogs] = useState<TerminalLine[]>([
    {
      id: 'init-banner',
      type: 'banner',
      text: `${RETRO_ASCII_EMBLEMS.cross}\n\n${RETRO_ASCII_EMBLEMS.bannerBox}\n\n${RETRO_ASCII_EMBLEMS.badge}\n    SNBV™\n\nC: ( SNBV"™ )\n{"orientation":"square","transparent_background":true}`,
      timestamp: '21:52:12',
    },
    {
      id: 'init-sys',
      type: 'system',
      text: '✦ [ESTACIÓN SNBV] Entorno Bash inicializado en C:\\Documentos\\SERGIO Berlanga\\DAILY\\',
      timestamp: '21:52:13',
    },
    {
      id: 'init-welcome',
      type: 'success',
      text: 'Flota Naves_Espaciales_de_Colores™ sincronizada. Constelación de Todos en línea.',
      timestamp: '21:52:14',
    },
  ]);

  // Execute a bash script with simulated streaming output and real simulation side-effects
  const handleExecuteScript = (script: ScriptFile) => {
    setActiveScriptExecuting(script.name);
    soundEngine.playKeyClick();

    const timestamp = new Date().toLocaleTimeString();

    // Add command to terminal
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `cmd-${Date.now()}`,
        type: 'command',
        text: `bash ${script.path}`,
        timestamp,
      },
    ]);

    // Handle script-specific actions
    if (script.id === 'apple_its_back') {
      soundEngine.playVintageChime();
    } else if (script.id === 'naves_espaciales' || script.id === 'colours_activation') {
      soundEngine.playWarpDrive();
      setShips((prev) =>
        prev.map((s) => ({
          ...s,
          speed: s.speed + 120,
          status: 'hipervelocidad',
        }))
      );
    } else if (script.id === 'colours_deployment') {
      soundEngine.playBlip(640);
      setFormation('constelación');
    } else {
      soundEngine.playBlip(780);
    }

    // Stream lines into terminal
    const lines = script.content.split('\n');
    let lineIdx = 0;

    const interval = setInterval(() => {
      if (lineIdx < lines.length) {
        const lineText = lines[lineIdx];
        if (lineText.trim()) {
          setTerminalLogs((prev) => [
            ...prev,
            {
              id: `log-${Date.now()}-${lineIdx}`,
              type: lineText.startsWith('╔') || lineText.startsWith('║') || lineText.startsWith('╚') ? 'banner' : 'stdout',
              text: lineText,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
        lineIdx++;
      } else {
        clearInterval(interval);
        setActiveScriptExecuting(null);

        // Success badge
        setTerminalLogs((prev) => [
          ...prev,
          {
            id: `success-${Date.now()}`,
            type: 'success',
            text: `[EXIT 0] '${script.name}' completado satisfactoriamente.`,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        // Increment execution counter
        setScripts((prev) =>
          prev.map((s) =>
            s.id === script.id
              ? {
                  ...s,
                  executionCount: s.executionCount + 1,
                  lastExecuted: new Date().toLocaleTimeString(),
                }
              : s
          )
        );
      }
    }, 120);
  };

  const handleDeployFleetAction = () => {
    const deploymentScript = scripts.find((s) => s.id === 'colours_deployment') || scripts[0];
    handleExecuteScript(deploymentScript);
    setActiveTab('constelacion');
  };

  const handleSaveScript = (updated: ScriptFile) => {
    setScripts((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleLaunchNewShip = (newShip: SpaceShip) => {
    setShips((prev) => [...prev, newShip]);
    setTerminalLogs((prev) => [
      ...prev,
      {
        id: `ship-launch-${Date.now()}`,
        type: 'success',
        text: `✦ [LANZAMIENTO] Nave '${newShip.name}' (${newShip.callsign}) insertada en órbita con firma espectral ${newShip.wavelength}.`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col antialiased">
      {/* Required In-App Quota Warning Banner (Demo Key / 100 req/day) */}
      {isQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Top Bar adhering to the Frontend Design 3-Zone Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onDeployFleet={handleDeployFleetAction}
        onOpenEmblems={() => setShowEmblemsModal(true)}
      />

      {/* Retro 6-color Apple Spectrum ribbon */}
      <SpectrumPaletteBar
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        onRunAppleScript={() => {
          const appleScript = scripts.find((s) => s.id === 'apple_its_back');
          if (appleScript) handleExecuteScript(appleScript);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Navigation pill tabs for mobile / quick access */}
        <div className="flex md:hidden items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('constelacion')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'constelacion' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400'
            }`}
          >
            Constelación
          </button>
          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'mapa' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400'
            }`}
          >
            Bases Terrestres
          </button>
          <button
            onClick={() => setActiveTab('flota')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'flota' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400'
            }`}
          >
            Naves
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'terminal' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400'
            }`}
          >
            Terminal
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
              activeTab === 'scripts' ? 'bg-amber-400 text-slate-900 font-bold' : 'text-slate-400'
            }`}
          >
            Scripts
          </button>
        </div>

        {/* Tab 1: Constelación de Todos */}
        {activeTab === 'constelacion' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h1 className="text-2xl font-bold font-tech text-slate-100 flex items-center gap-2">
                  <span className="text-amber-400">✦</span>
                  SNBV™ CONSTELACIÓN DE TODOS
                </h1>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Núcleo Estelar: α-SNBV</span>
                  <span aria-hidden="true">·</span>
                  <span>Coordenadas: RA 18h 36m / Dec +38° 47'</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-400 font-mono">
                    Flota Cromática: {ships.length} naves en órbita
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const navesScript = scripts.find((s) => s.id === 'naves_espaciales');
                    if (navesScript) handleExecuteScript(navesScript);
                  }}
                  className="px-3 py-1.5 text-xs font-mono bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-900 rounded transition-colors flex items-center gap-1.5"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Naves_Espaciales_de_Colores™</span>
                </button>
              </div>
            </div>

            <ConstellationCanvas
              ships={ships}
              setShips={setShips}
              stars={stars}
              selectedColor={selectedColor}
              onSelectShip={setSelectedShip}
              onSelectStar={setSelectedStar}
              selectedShip={selectedShip}
              selectedStar={selectedStar}
              formation={formation}
              setFormation={setFormation}
              onTriggerWarp={() => {
                setTerminalLogs((prev) => [
                  ...prev,
                  {
                    id: `warp-${Date.now()}`,
                    type: 'system',
                    text: '✦ [TELEMETRÍA] Salto hiperespacial activado en la constelación. Curvatura al 100%.',
                    timestamp: new Date().toLocaleTimeString(),
                  },
                ]);
              }}
            />

            {/* Quick Mission Dashboard below the canvas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0c0f17] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Directorio Operativo
                  </span>
                  <FolderGit2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xs font-mono text-slate-200">
                  C:\Documentos\SERGIO Berlanga\DAILY\
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Contiene 6 scripts interactivos Bash para control estelar y calibración retro.
                </div>
              </div>

              <div className="bg-[#0c0f17] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Espectro Apple™
                  </span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-200">
                  6 Bandas Cromáticas (1977 - 2026)
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Verde (520nm), Amarillo (580nm), Naranja (605nm), Rojo (650nm), Púrpura (420nm), Bondi (470nm).
                </div>
              </div>

              <div className="bg-[#0c0f17] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-slate-400 uppercase">
                    Comandante en Jefe
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-xs font-mono text-slate-200">
                  SERGIO Berlanga
                </div>
                <div className="mt-2 text-[11px] text-slate-400">
                  Sesión autorizada. Consola SNBV™ lista para despliegues de órbita y maniobras.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Bases Terrestres (Google Maps Platform) */}
        {activeTab === 'mapa' && (
          <GroundTrackingMap
            apiKey={googleMapsApiKey}
            selectedColor={selectedColor}
          />
        )}

        {/* Tab 2: Terminal Bash [DAILY] */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-tech text-slate-100 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                Terminal de Scripts Bash — C:\Documentos\SERGIO Berlanga\DAILY\
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ejecuta y diagnostica en tiempo real los scripts de la constelación y el puente PC/Apple.
              </p>
            </div>

            <TerminalConsole
              scripts={scripts}
              onExecuteScript={handleExecuteScript}
              terminalLogs={terminalLogs}
              onClearLogs={() => setTerminalLogs([])}
              activeScriptExecuting={activeScriptExecuting}
              onOpenScriptEditor={(s) => setEditingScript(s)}
            />
          </div>
        )}

        {/* Tab 3: Flota Naves Espaciales de Colores™ */}
        {activeTab === 'flota' && (
          <FleetDashboard
            ships={ships}
            setShips={setShips}
            formation={formation}
            setFormation={setFormation}
            onSelectShip={(ship) => {
              setSelectedShip(ship);
              setActiveTab('constelacion');
            }}
            onLaunchNewShip={handleLaunchNewShip}
          />
        )}

        {/* Tab 4: Editor de Scripts */}
        {activeTab === 'scripts' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold font-tech text-slate-100 flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                Gestor de Scripts — C:\Documentos\SERGIO Berlanga\DAILY\
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Intérprete: /bin/bash</span>
                <span aria-hidden="true">·</span>
                <span>{scripts.length} archivos .sh disponibles</span>
                <span aria-hidden="true">·</span>
                <span>Permisos: rwxr-xr-x</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="bg-[#0d1018] border border-slate-800 hover:border-slate-700 rounded-lg p-4 flex flex-col justify-between transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-emerald-400" />
                        <h3 className="font-mono text-sm font-bold text-slate-200">
                          {script.name}
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        Bash
                      </span>
                    </div>

                    <div className="text-xs font-mono text-slate-400 mb-2 truncate">
                      {script.path}
                    </div>

                    <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                      {script.description}
                    </p>

                    <div className="text-[11px] font-mono text-slate-500 mb-4 flex items-center gap-3">
                      <span>Ejecuciones: {script.executionCount}</span>
                      {script.lastExecuted && (
                        <span>Última vez: {script.lastExecuted}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleExecuteScript(script)}
                      className="flex-1 py-1.5 text-xs font-mono bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Ejecutar</span>
                    </button>
                    <button
                      onClick={() => setEditingScript(script)}
                      className="px-3 py-1.5 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                    >
                      Editar Código
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Script Editor Modal */}
      {editingScript && (
        <ScriptEditorModal
          script={editingScript}
          onClose={() => setEditingScript(null)}
          onSaveScript={handleSaveScript}
          onExecuteScript={handleExecuteScript}
        />
      )}

      {/* ASCII Emblem Modal */}
      {showEmblemsModal && (
        <AsciiEmblemModal
          onClose={() => setShowEmblemsModal(false)}
          onSendToTerminal={(art) => {
            setTerminalLogs((prev) => [
              ...prev,
              {
                id: `emblem-${Date.now()}`,
                type: 'banner',
                text: art,
                timestamp: new Date().toLocaleTimeString(),
              },
            ]);
            setActiveTab('terminal');
            setShowEmblemsModal(false);
          }}
        />
      )}

      {/* Quiet Footer adhering to anti-slop guidelines */}
      <footer className="border-t border-slate-800/80 bg-[#07090e] py-6 px-4 text-xs font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">✦ SNBV™</span>
            <span>CONSTELACIÓN DE TODOS</span>
            <span className="text-slate-700">·</span>
            <span>C:\Documentos\SERGIO Berlanga\DAILY</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowEmblemsModal(true)}
              className="hover:text-slate-200 transition-colors"
            >
              Emblemas Oficiales
            </button>
            <span className="text-slate-800">|</span>
            <span>PC™_APPLE_COLOURS™</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
