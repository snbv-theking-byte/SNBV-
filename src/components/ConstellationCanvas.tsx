import React, { useState, useEffect, useRef } from 'react';
import { SpaceShip, ConstellationStar, FleetFormation } from '../types';
import { Compass, Navigation, Zap, Shield, Eye, Layers, RotateCcw, Target } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface ConstellationCanvasProps {
  ships: SpaceShip[];
  setShips: React.Dispatch<React.SetStateAction<SpaceShip[]>>;
  stars: ConstellationStar[];
  selectedColor: string | null;
  onSelectShip: (ship: SpaceShip | null) => void;
  onSelectStar: (star: ConstellationStar | null) => void;
  selectedShip: SpaceShip | null;
  selectedStar: ConstellationStar | null;
  formation: FleetFormation;
  setFormation: (f: FleetFormation) => void;
  onTriggerWarp: () => void;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  ships,
  setShips,
  stars,
  selectedColor,
  onSelectShip,
  onSelectStar,
  selectedShip,
  selectedStar,
  formation,
  setFormation,
  onTriggerWarp,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [showRadar, setShowRadar] = useState(true);
  const [warpActive, setWarpActive] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Animation frame loop for continuous ship movement
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setShips((prevShips) =>
        prevShips.map((ship) => {
          let { x, y, vx, vy, angle, speed } = ship;

          if (formation === 'constelación') {
            // Orbiting around central SNBV-Core at (50, 48)
            const cx = 50;
            const cy = 48;
            const dx = x - cx;
            const dy = y - cy;
            const currentAngle = Math.atan2(dy, dx);
            const orbitRadius = Math.max(16, Math.min(38, Math.sqrt(dx * dx + dy * dy)));
            const angularSpeed = (speed / 1500) * (warpActive ? 2.5 : 1);
            const nextAngle = currentAngle + angularSpeed * dt;

            const nextX = cx + Math.cos(nextAngle) * orbitRadius;
            const nextY = cy + Math.sin(nextAngle) * orbitRadius;
            const shipAngle = ((nextAngle + Math.PI / 2) * 180) / Math.PI;

            return {
              ...ship,
              x: nextX,
              y: nextY,
              angle: shipAngle,
              status: warpActive ? 'hipervelocidad' : 'en_órbita',
            };
          }

          if (formation === 'delta') {
            // V-formation heading northeast
            const targetX = 50 + (parseInt(ship.id.slice(-1)) || 1) * 5 - 15;
            const targetY = 35 + Math.abs((parseInt(ship.id.slice(-1)) || 1) - 3) * 7;
            const lerpSpeed = 2 * dt;
            const nextX = x + (targetX - x) * lerpSpeed;
            const nextY = y + (targetY - y) * lerpSpeed;

            return {
              ...ship,
              x: nextX,
              y: nextY,
              angle: 315,
              status: 'en_formación',
            };
          }

          // Free patrol mode with boundary bounce
          const moveSpeed = (speed / 280) * (warpActive ? 2.8 : 1) * dt;
          let nextX = x + vx * moveSpeed;
          let nextY = y + vy * moveSpeed;
          let nextVx = vx;
          let nextVy = vy;

          if (nextX < 8) {
            nextX = 8;
            nextVx = Math.abs(vx);
          } else if (nextX > 92) {
            nextX = 92;
            nextVx = -Math.abs(vx);
          }

          if (nextY < 12) {
            nextY = 12;
            nextVy = Math.abs(vy);
          } else if (nextY > 88) {
            nextY = 88;
            nextVy = -Math.abs(vy);
          }

          const heading = (Math.atan2(nextVy, nextVx) * 180) / Math.PI + 90;

          return {
            ...ship,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
            angle: heading,
            status: warpActive ? 'hipervelocidad' : 'patrulla',
          };
        })
      );

      animId = requestAnimationFrame(updatePhysics);
    };

    animId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animId);
  }, [formation, warpActive, setShips]);

  const handleWarp = () => {
    setWarpActive(true);
    soundEngine.playWarpDrive();
    onTriggerWarp();
    setTimeout(() => {
      setWarpActive(false);
    }, 4000);
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    // Check if clicked outside stars and ships
    const target = e.target as SVGElement;
    if (target.tagName === 'svg' || target.id === 'canvas-bg') {
      onSelectShip(null);
      onSelectStar(null);
    }
  };

  return (
    <div className="relative w-full h-[620px] bg-[#07090e] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-2xl select-none">
      {/* Top HUD Telemetry Bar */}
      <div className="h-10 bg-[#0d111a]/90 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-mono text-slate-400 z-20">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-tech font-bold tracking-widest flex items-center gap-1.5">
            <span className="animate-pulse">●</span> SNBV-RADAR
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">SECTOR: 18h 36m +38°47'</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-semibold tabular-nums">
            FLOTA: {ships.length} NAVES ACTIVAS
          </span>
        </div>

        {/* HUD Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => {
                setFormation('constelación');
                soundEngine.playKeyClick();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                formation === 'constelación' ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:text-slate-200'
              }`}
            >
              Órbita SNBV
            </button>
            <button
              onClick={() => {
                setFormation('delta');
                soundEngine.playKeyClick();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                formation === 'delta' ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:text-slate-200'
              }`}
            >
              Delta
            </button>
            <button
              onClick={() => {
                setFormation('patrulla_libre');
                soundEngine.playKeyClick();
              }}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                formation === 'patrulla_libre' ? 'bg-amber-400 text-slate-900 font-bold' : 'hover:text-slate-200'
              }`}
            >
              Patrulla
            </button>
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            title="Conmutar cuadrícula estelar"
            className={`p-1.5 rounded border text-xs transition-colors ${
              showGrid ? 'border-amber-400/50 text-amber-400 bg-amber-950/20' : 'border-slate-800 text-slate-500'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setShowConnections(!showConnections)}
            title="Conmutar líneas de la constelación"
            className={`p-1.5 rounded border text-xs transition-colors ${
              showConnections ? 'border-cyan-400/50 text-cyan-400 bg-cyan-950/20' : 'border-slate-800 text-slate-500'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleWarp}
            disabled={warpActive}
            className={`flex items-center gap-1 px-2.5 py-1 rounded border text-xs font-mono font-bold transition-all ${
              warpActive
                ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                : 'bg-indigo-950/60 hover:bg-indigo-900/80 border-indigo-500/50 text-indigo-300'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{warpActive ? 'WARP ACTIVO' : 'HIPERVELOCIDAD'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div ref={canvasContainerRef} className="relative flex-1 w-full h-full overflow-hidden bg-[#07090e]">
        {/* Radar beam animation overlay */}
        {showRadar && (
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background: 'conic-gradient(from 0deg at 50% 48%, transparent 0deg, rgba(6, 182, 212, 0.15) 60deg, transparent 65deg)',
              animation: 'spin 12s linear infinite',
            }}
          />
        )}

        <svg
          className="w-full h-full cursor-crosshair"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          onClick={handleCanvasClick}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="star-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.2" />
            </pattern>

            {/* Apple 6-color linear gradient for core badge */}
            <linearGradient id="apple-spectrum-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#61BB46" />
              <stop offset="20%" stopColor="#FDB827" />
              <stop offset="40%" stopColor="#F58220" />
              <stop offset="60%" stopColor="#E03A3E" />
              <stop offset="80%" stopColor="#963D97" />
              <stop offset="100%" stopColor="#009DDC" />
            </linearGradient>

            {/* Glow Filter */}
            <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Grid */}
          {showGrid && <rect id="canvas-bg" width="100" height="100" fill="url(#star-grid)" />}

          {/* Concentric Orbital Radar Rings */}
          <circle cx="50" cy="48" r="16" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="1 2" strokeWidth="0.3" />
          <circle cx="50" cy="48" r="28" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="1 2" strokeWidth="0.3" />
          <circle cx="50" cy="48" r="40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="1 3" strokeWidth="0.3" />

          {/* Background Micro Stars */}
          {[
            [12, 18], [22, 10], [38, 14], [85, 15], [92, 32], [88, 85], [14, 88], [8, 42],
            [64, 12], [44, 6], [82, 92], [32, 90], [60, 92], [94, 68], [15, 62], [42, 60]
          ].map(([sx, sy], idx) => (
            <circle
              key={`bg-star-${idx}`}
              cx={sx}
              cy={sy}
              r={0.3 + (idx % 3) * 0.15}
              fill="rgba(255, 255, 255, 0.45)"
            />
          ))}

          {/* Constellation Connection Lines */}
          {showConnections &&
            stars.map((star) => {
              return star.connectedTo.map((targetId) => {
                const targetStar = stars.find((s) => s.id === targetId);
                if (!targetStar) return null;
                return (
                  <line
                    key={`line-${star.id}-${targetId}`}
                    x1={star.x}
                    y1={star.y}
                    x2={targetStar.x}
                    y2={targetStar.y}
                    stroke={star.isCoreSNBV || targetStar.isCoreSNBV ? 'rgba(251, 191, 36, 0.35)' : 'rgba(56, 189, 248, 0.22)'}
                    strokeWidth={star.isCoreSNBV ? 0.35 : 0.22}
                    strokeDasharray={star.isCoreSNBV ? 'none' : '1.5 1'}
                  />
                );
              });
            })}

          {/* Constellation Stars Rendering */}
          {stars.map((star) => {
            const isSelected = selectedStar?.id === star.id;
            const isCore = star.isCoreSNBV;

            return (
              <g
                key={star.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStar(star);
                  onSelectShip(null);
                  soundEngine.playBlip(isCore ? 600 : 800);
                }}
                className="cursor-pointer transition-transform hover:scale-125"
              >
                {/* Glow ring for core star */}
                {isCore && (
                  <>
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r="4.2"
                      fill="none"
                      stroke="url(#apple-spectrum-grad)"
                      strokeWidth="0.3"
                      className="animate-spin"
                      style={{ transformOrigin: '50px 48px' }}
                    />
                    <circle
                      cx={star.x}
                      cy={star.y}
                      r="2.8"
                      fill="rgba(251, 191, 36, 0.15)"
                    />
                  </>
                )}

                {/* Selection ring */}
                {isSelected && (
                  <circle
                    cx={star.x}
                    cy={star.y}
                    r={isCore ? 5 : 3}
                    fill="none"
                    stroke="#FDB827"
                    strokeWidth="0.4"
                    strokeDasharray="1 1"
                  />
                )}

                {/* Star center dot / diamond */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={isCore ? 1.6 : 0.9}
                  fill={isCore ? '#FDB827' : '#93C5FD'}
                  filter={isCore ? 'url(#core-glow)' : undefined}
                />

                {/* Star Label */}
                <text
                  x={star.x}
                  y={star.y + (isCore ? 4.2 : 2.8)}
                  fill={isCore ? '#FDB827' : '#94A3B8'}
                  fontSize={isCore ? '2.1' : '1.4'}
                  fontWeight={isCore ? 'bold' : 'normal'}
                  textAnchor="middle"
                  fontFamily="'Chakra Petch', sans-serif"
                >
                  {isCore ? '✦ SNBV-Core ✦' : star.name}
                </text>
              </g>
            );
          })}

          {/* Flying Spaceships ("Naves_Espaciales_de_Colores™") */}
          {ships.map((ship) => {
            const isSelected = selectedShip?.id === ship.id;
            const matchesFilter = !selectedColor || ship.colorHex.toLowerCase() === selectedColor.toLowerCase();

            return (
              <g
                key={ship.id}
                transform={`translate(${ship.x}, ${ship.y}) rotate(${ship.angle})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectShip(ship);
                  onSelectStar(null);
                  soundEngine.playBlip(parseInt(ship.wavelength));
                }}
                className={`cursor-pointer transition-opacity ${
                  matchesFilter ? 'opacity-100' : 'opacity-25'
                }`}
              >
                {/* Engine Thruster Flame / Rainbow Trail */}
                <path
                  d="M -0.8 1.5 L 0 4 L 0.8 1.5 Z"
                  fill={ship.colorHex}
                  opacity={warpActive ? 0.95 : 0.65}
                  transform={warpActive ? 'scale(1.8)' : 'scale(1)'}
                />

                {/* Spaceship Hull (Stylized Arrowhead interceptor) */}
                <polygon
                  points="0,-2.6 1.8,1.4 0,0.6 -1.8,1.4"
                  fill={ship.colorHex}
                  stroke={isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.5)'}
                  strokeWidth="0.3"
                />

                {/* Cockpit canopy */}
                <circle cx="0" cy="-0.6" r="0.5" fill="#FFFFFF" />

                {/* Selection Marker */}
                {isSelected && (
                  <circle
                    cx="0"
                    cy="0"
                    r="3.2"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="0.3"
                    strokeDasharray="0.8 0.8"
                  />
                )}
              </g>
            );
          })}

          {/* Central Emblem Badge Text Overlay */}
          <g transform="translate(50, 48)">
            <text
              x="0"
              y="-5"
              fill="#FDB827"
              fontSize="1.6"
              fontFamily="'JetBrains Mono', monospace"
              textAnchor="middle"
              opacity="0.8"
            >
              ✦ ─ SNBV ─ ✦
            </text>
          </g>
        </svg>

        {/* Selected Star / Ship Floating Inspector HUD Card */}
        {selectedShip && (
          <div className="absolute top-4 left-4 max-w-xs bg-[#0d111a]/95 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-md z-30 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedShip.colorHex }}
                />
                <span className="font-tech font-bold text-slate-100">
                  {selectedShip.name}
                </span>
              </div>
              <button
                onClick={() => onSelectShip(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Distintivo:</span>
                <span className="text-amber-300">{selectedShip.callsign}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Color / Espectro:</span>
                <span style={{ color: selectedShip.colorHex }}>
                  {selectedShip.colorName} ({selectedShip.wavelength})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Piloto:</span>
                <span className="text-slate-300">{selectedShip.pilot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Velocidad:</span>
                <span className="tabular-nums font-semibold text-emerald-400">
                  {Math.round(selectedShip.speed)} km/s
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Escudo / Combustible:</span>
                <span className="tabular-nums text-cyan-400">
                  {selectedShip.shield}% / {selectedShip.fuel}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Misión:</span>
                <span className="text-slate-300 truncate max-w-[150px]">
                  {selectedShip.mission}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  soundEngine.playWarpDrive();
                  setShips((prev) =>
                    prev.map((s) =>
                      s.id === selectedShip.id
                        ? { ...s, speed: s.speed + 200, status: 'hipervelocidad' }
                        : s
                    )
                  );
                }}
                className="flex-1 py-1 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded hover:bg-amber-500/30 transition-colors"
              >
                Propulsión Warp
              </button>
              <button
                onClick={() => {
                  soundEngine.playBlip(750);
                  setShips((prev) =>
                    prev.map((s) =>
                      s.id === selectedShip.id
                        ? { ...s, shield: 100, fuel: 100 }
                        : s
                    )
                  );
                }}
                className="py-1 px-2 text-[10px] bg-slate-800 text-slate-300 border border-slate-700 rounded hover:bg-slate-700 transition-colors"
              >
                Recargar
              </button>
            </div>
          </div>
        )}

        {selectedStar && (
          <div className="absolute top-4 left-4 max-w-xs bg-[#0d111a]/95 border border-slate-700/80 rounded-lg p-3 shadow-xl backdrop-blur-md z-30 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 text-sm">✦</span>
                <span className="font-tech font-bold text-slate-100">
                  {selectedStar.name}
                </span>
              </div>
              <button
                onClick={() => onSelectStar(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Código IAU:</span>
                <span className="text-cyan-300">{selectedStar.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tipo Espectral:</span>
                <span className="text-slate-300">{selectedStar.spectralType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Magnitud Visual:</span>
                <span className="tabular-nums text-amber-300">{selectedStar.magnitude} m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coordenadas:</span>
                <span className="tabular-nums text-slate-400">
                  X:{selectedStar.x.toFixed(1)}% Y:{selectedStar.y.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Enlaces:</span>
                <span className="text-slate-300">{selectedStar.connectedTo.length} nodos</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Right Legend Bar */}
        <div className="absolute bottom-3 right-3 bg-[#0d111a]/85 border border-slate-800 rounded px-2.5 py-1.5 text-[10px] font-mono text-slate-400 flex items-center gap-3 backdrop-blur-sm pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>SNBV-Core</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Nodos Estelares</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Flota de Colores™</span>
          </div>
        </div>
      </div>
    </div>
  );
};
