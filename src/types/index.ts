export interface SpaceShip {
  id: string;
  name: string;
  callsign: string;
  colorHex: string;
  colorName: string;
  wavelength: string; // e.g., '520 nm'
  x: number; // 0 - 100%
  y: number; // 0 - 100%
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  fuel: number; // percentage
  shield: number; // percentage
  status: 'en_órbita' | 'hipervelocidad' | 'en_formación' | 'patrulla';
  pilot: string;
  mission: string;
}

export interface ConstellationStar {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  magnitude: number;
  spectralType: string;
  connectedTo: string[];
  isCoreSNBV?: boolean;
}

export interface ScriptFile {
  id: string;
  name: string;
  path: string;
  interpreter: 'Bash';
  description: string;
  category: 'core' | 'deployment' | 'colours' | 'fleet';
  content: string;
  lastExecuted?: string;
  executionCount: number;
  isExecutable: boolean;
}

export interface TerminalLine {
  id: string;
  type: 'stdout' | 'stderr' | 'command' | 'system' | 'banner' | 'success' | 'rainbow';
  text: string;
  timestamp: string;
}

export type ThemeMode = 'spectrum' | 'obsidian' | 'bondi_blue' | 'amber_crt';
export type FleetFormation = 'delta' | 'constelación' | 'hexágono' | 'patrulla_libre';
