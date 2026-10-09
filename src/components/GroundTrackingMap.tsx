import React, { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { GroundStation, INITIAL_GROUND_STATIONS } from '../data/groundStations';
import { Radio, Globe2, Signal, Satellite, MapPin, Compass, Plus, Send } from 'lucide-react';
import { soundEngine } from '../utils/sound';

interface GroundTrackingMapProps {
  apiKey: string;
  selectedColor: string | null;
}

// Inner helper component to pan the map programmatically
const MapController: React.FC<{ selectedStation: GroundStation | null }> = ({ selectedStation }) => {
  const map = useMap();

  React.useEffect(() => {
    if (map && selectedStation) {
      map.panTo({ lat: selectedStation.lat, lng: selectedStation.lng });
      map.setZoom(5);
    }
  }, [map, selectedStation]);

  return null;
};

export const GroundTrackingMap: React.FC<GroundTrackingMapProps> = ({
  apiKey,
  selectedColor,
}) => {
  const [stations, setStations] = useState<GroundStation[]>(INITIAL_GROUND_STATIONS);
  const [activeStation, setActiveStation] = useState<GroundStation | null>(stations[0]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [lastPingTime, setLastPingTime] = useState<string | null>(null);

  const filteredStations = stations.filter((station) => {
    if (selectedColor && station.colorHex.toLowerCase() !== selectedColor.toLowerCase()) {
      return false;
    }
    if (filterStatus !== 'all' && station.status !== filterStatus) {
      return false;
    }
    return true;
  });

  const handleMapClick = useCallback((e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      const newStation: GroundStation = {
        id: `station-custom-${Date.now()}`,
        name: `Baliza Táctica Relé #${Math.floor(Math.random() * 900 + 100)}`,
        code: `RELAY-${Math.floor(Math.random() * 80 + 10)}`,
        lat,
        lng,
        city: `Coord [${lat.toFixed(2)}°, ${lng.toFixed(2)}°]`,
        country: 'Red Orbital',
        colorHex: '#009DDC',
        colorName: 'Azul Bondi',
        wavelength: '470 nm',
        dishDiameter: 'Antena Portátil 5m',
        frequency: '11.8 GHz X-Band',
        linkedShip: 'Enlace Proyectado',
        status: 'ONLINE',
        description: 'Baliza de retransmisión terrestre desplegada manualmente.',
      };

      setStations((prev) => [...prev, newStation]);
      setActiveStation(newStation);
      soundEngine.playBlip(920);
    }
  }, []);

  const handleSendPing = (station: GroundStation) => {
    soundEngine.playBlip(parseInt(station.wavelength) || 600);
    setLastPingTime(new Date().toLocaleTimeString());
  };

  return (
    <div className="space-y-4">
      {/* Header telemetry section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-xl font-bold font-tech text-slate-100 flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-emerald-400" />
            Bases Terrestres & Estaciones de Rastreo Global SNBV™
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>Red Planetaria de Telemetría</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{stations.length} estaciones activas</span>
            <span aria-hidden="true">·</span>
            <span>Google Maps Platform Integration</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Filtrar Estado:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas ({stations.length})</option>
            <option value="ONLINE">Online</option>
            <option value="TRANSMITIENDO">Transmitiendo</option>
            <option value="CALIBRANDO">Calibrando</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Map + Ground Stations Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Google Maps Container */}
        <div className="lg:col-span-3 bg-[#07090e] border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative h-[600px] flex flex-col">
          {/* Map Status HUD Bar */}
          <div className="h-9 bg-[#0d111a]/90 border-b border-slate-800 px-3 flex items-center justify-between text-xs font-mono text-slate-400 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-tech text-slate-200 font-bold">DOWNLINK TERRESTRE</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <span className="text-slate-400 hidden sm:inline text-[11px]">
                Haz clic en el mapa para situar una nueva baliza
              </span>
            </div>
            {lastPingTime && (
              <span className="text-amber-400 text-[11px]">
                Último ping: {lastPingTime}
              </span>
            )}
          </div>

          {/* Explicitly sized Map Container (CF2 Compliance) */}
          <div className="flex-1 w-full h-[calc(100%-36px)] relative">
            <APIProvider apiKey={apiKey}>
              <Map
                mapId="DEMO_MAP_ID"
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                defaultCenter={{ lat: 26, lng: -10 }}
                defaultZoom={2}
                minZoom={1.5}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onClick={handleMapClick}
                style={{ width: '100%', height: '100%' }}
              >
                <MapController selectedStation={activeStation} />

                {/* Advanced Markers for each Ground Station */}
                {filteredStations.map((station) => (
                  <AdvancedMarker
                    key={station.id}
                    position={{ lat: station.lat, lng: station.lng }}
                    onClick={() => {
                      setActiveStation(station);
                      soundEngine.playBlip(parseInt(station.wavelength) || 700);
                    }}
                    title={`${station.name} (${station.code})`}
                  >
                    <Pin
                      background={station.colorHex}
                      borderColor="#FFFFFF"
                      glyphColor="#FFFFFF"
                      scale={activeStation?.id === station.id ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                ))}

                {/* Info Window for Active Station */}
                {activeStation && (
                  <InfoWindow
                    position={{ lat: activeStation.lat, lng: activeStation.lng }}
                    onCloseClick={() => setActiveStation(null)}
                    pixelOffset={[0, -38]}
                  >
                    <div className="p-1 max-w-[260px] text-slate-900 font-sans">
                      <div className="flex items-center gap-2 pb-1 mb-1 border-b border-slate-200">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: activeStation.colorHex }}
                        />
                        <h4 className="font-bold text-xs truncate text-slate-900">
                          {activeStation.name}
                        </h4>
                      </div>

                      <div className="text-[11px] space-y-1 font-mono text-slate-600">
                        <div>
                          <span className="font-semibold text-slate-800">Código:</span> {activeStation.code}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Ubicación:</span> {activeStation.city}, {activeStation.country}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Antena:</span> {activeStation.dishDiameter}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Frecuencia:</span> {activeStation.frequency}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Nave Asociada:</span>{' '}
                          <span className="text-indigo-600 font-bold">{activeStation.linkedShip}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendPing(activeStation)}
                        className="mt-2 w-full py-1 text-[10px] font-mono font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <Send className="w-2.5 h-2.5" />
                        <span>Transmitir Ping de Enlace</span>
                      </button>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>
        </div>

        {/* Ground Station List & Selected Station Telemetry Card */}
        <div className="space-y-3 flex flex-col justify-between">
          <div className="bg-[#0c0f17] border border-slate-800 rounded-xl p-3 max-h-[380px] overflow-y-auto space-y-2">
            <h3 className="font-tech text-xs uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center justify-between">
              <span>Estaciones Terrestres</span>
              <span className="tabular-nums text-amber-400">{filteredStations.length}</span>
            </h3>

            {filteredStations.map((station) => {
              const isSelected = activeStation?.id === station.id;
              return (
                <button
                  key={station.id}
                  onClick={() => {
                    setActiveStation(station);
                    soundEngine.playKeyClick();
                  }}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs font-mono flex items-start gap-2.5 ${
                    isSelected
                      ? 'border-amber-400/80 bg-slate-900 shadow-sm'
                      : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/60'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full mt-0.5 shrink-0"
                    style={{ backgroundColor: station.colorHex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-200 truncate">{station.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{station.city}</div>
                    <div className="text-[10px] text-emerald-400 mt-0.5 font-semibold">
                      {station.status} <span className="text-slate-600">·</span> {station.wavelength}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Station Detail Card */}
          {activeStation && (
            <div className="bg-[#0e121b] border border-slate-700 rounded-xl p-3.5 text-xs font-mono space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-tech font-bold text-amber-300">TELEMETRÍA DE ESTACIÓN</span>
                <span className="text-[10px] text-slate-400">{activeStation.code}</span>
              </div>
              <div className="text-slate-300 text-[11px] leading-relaxed">
                {activeStation.description}
              </div>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Lat/Lng:</span>
                <span className="tabular-nums text-cyan-400">
                  {activeStation.lat.toFixed(4)}, {activeStation.lng.toFixed(4)}
                </span>
              </div>
              <button
                onClick={() => handleSendPing(activeStation)}
                className="w-full py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded transition-colors text-xs flex items-center justify-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Emitir Señal de Enlace</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
