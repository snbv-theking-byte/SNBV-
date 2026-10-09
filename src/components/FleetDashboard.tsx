import React, { useState } from 'react';
import { SpaceShip, FleetFormation } from '../types';
import { Rocket, Shield, Fuel, Gauge, Compass, Plus, Radio, Zap } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface FleetDashboardProps {
  ships: SpaceShip[];
  setShips: React.Dispatch<React.SetStateAction<SpaceShip[]>>;
  formation: FleetFormation;
  setFormation: (f: FleetFormation) => void;
  onSelectShip: (ship: SpaceShip) => void;
  onLaunchNewShip: (newShip: SpaceShip) => void;
}

export const FleetDashboard: React.FC<FleetDashboardProps> = ({
  ships,
  setShips,
  formation,
  setFormation,
  onSelectShip,
  onLaunchNewShip,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShipName, setNewShipName] = useState('SNBV-07 Prisma');
  const [newShipColor, setNewShipColor] = useState('#61BB46');
  const [newShipPilot, setNewShipPilot] = useState('Sergio B.');

  const handleCreateShip = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `ship-custom-${Date.now()}`;
    const ship: SpaceShip = {
      id,
      name: newShipName,
      callsign: `PRISMA-${Math.floor(Math.random() * 900 + 100)}`,
      colorHex: newShipColor,
      colorName: 'Espectro Estelar',
      wavelength: '550 nm',
      x: 45 + Math.random() * 10,
      y: 45 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      angle: Math.floor(Math.random() * 360),
      speed: 780 + Math.floor(Math.random() * 120),
      fuel: 100,
      shield: 100,
      status: 'en_formación',
      pilot: newShipPilot,
      mission: 'Exploración de la Constelación',
    };

    onLaunchNewShip(ship);
    setShowAddModal(false);
    soundEngine.playWarpDrive();
  };

  const boostShip = (id: string) => {
    soundEngine.playWarpDrive();
    setShips((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              speed: s.speed + 150,
              fuel: Math.max(10, s.fuel - 5),
              status: 'hipervelocidad',
            }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold font-tech text-slate-100 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            Naves Espaciales de Colores™ — Telemetría Orbital
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Comandancia General: SERGIO Berlanga</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{ships.length} naves en servicio activo</span>
            <span aria-hidden="true">·</span>
            <span>Matriz cromática de 6 bandas</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setShowAddModal(true);
              soundEngine.playKeyClick();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Nave Cromática</span>
          </button>
        </div>
      </div>

      {/* Ships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ships.map((ship) => {
          return (
            <div
              key={ship.id}
              className="bg-[#0e121b] border border-slate-800/90 rounded-lg p-4 hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 group-hover:scale-125 transition-transform"
                      style={{
                        backgroundColor: ship.colorHex,
                        boxShadow: `0 0 10px ${ship.colorHex}66`,
                      }}
                    />
                    <div>
                      <h3 className="font-tech text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                        {ship.name}
                      </h3>
                      <div className="text-[11px] font-mono text-slate-400">
                        {ship.callsign} <span className="text-slate-600">·</span> {ship.colorName}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {ship.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded bg-slate-900/60 border border-slate-800/50 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Velocidad</span>
                    <span className="text-slate-200 font-semibold tabular-nums">
                      {Math.round(ship.speed)} km/s
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Longitud Onda</span>
                    <span style={{ color: ship.colorHex }} className="font-semibold">
                      {ship.wavelength}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Escudo Refractor</span>
                    <span className="text-cyan-400 tabular-nums">{ship.shield}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block">Combustible Iónico</span>
                    <span className="text-amber-400 tabular-nums">{ship.fuel}%</span>
                  </div>
                </div>

                {/* Pilot and mission info */}
                <div className="text-[11px] text-slate-400 space-y-0.5 mb-3">
                  <div className="flex justify-between">
                    <span>Piloto asignado:</span>
                    <span className="text-slate-300 font-medium">{ship.pilot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Misión en curso:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{ship.mission}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => onSelectShip(ship)}
                  className="flex-1 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors text-center font-medium"
                >
                  Localizar en Radar
                </button>
                <button
                  onClick={() => boostShip(ship.id)}
                  title="Impulso Warp"
                  className="px-2.5 py-1.5 text-xs text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded transition-colors flex items-center gap-1"
                >
                  <Zap className="w-3 h-3" />
                  <span>Warp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Ship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f131d] border border-slate-700 rounded-xl p-5 max-w-md w-full shadow-2xl">
            <h3 className="font-tech text-lg font-bold text-slate-100 mb-1 flex items-center gap-2">
              <Rocket className="w-4 h-4 text-emerald-400" />
              Construir Nueva Nave Cromática
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Añade una nave a la constelación con la firma espectral que desees.
            </p>

            <form onSubmit={handleCreateShip} className="space-y-3.5 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Nombre de la Nave:</label>
                <input
                  type="text"
                  value={newShipName}
                  onChange={(e) => setNewShipName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Piloto al Mando:</label>
                <input
                  type="text"
                  value={newShipPilot}
                  onChange={(e) => setNewShipPilot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-slate-100 focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Color / Frecuencia del Motor:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newShipColor}
                    onChange={(e) => setNewShipColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-slate-300 font-mono">{newShipColor}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded transition-colors"
                >
                  Lanzar a la Constelación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
