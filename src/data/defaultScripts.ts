import { ScriptFile, ConstellationStar, SpaceShip } from '../types';

export const INITIAL_SCRIPTS: ScriptFile[] = [
  {
    id: 'apple_its_back',
    name: 'APPLE™_ITʼS.BACK™.sh',
    path: 'C:\\Documentos\\SERGIO Berlanga\\DAILY\\APPLE™_ITʼS.BACK™.sh',
    interpreter: 'Bash',
    description: 'Protocolo de reencendido retro: restaura el espectro cromático de 6 bandas y sintetiza el acorde original.',
    category: 'colours',
    executionCount: 1,
    isExecutable: true,
    content: `#!/usr/bin/env bash
# ==============================================================
# SNBV™ SYSTEM KERNEL // APPLE™_IT'S.BACK™
# HOST: C:\\Documentos\\SERGIO Berlanga\\DAILY\\
# ARCHITECTURE: 6-BAND CHROMATIC FREQUENCY (1977 - 2026)
# ==============================================================

set -euo pipefail

echo "✦ [SNBV-KERNEL] Iniciando secuencia retro APPLE™_IT'S.BACK™..."
echo "✦ Verificando integridad del espectro analógico..."
sleep 0.4

COLOUR_ARRAY=(
  "#61BB46:VERDE_MANZANA:520nm"
  "#FDB827:AMARILLO_SOLAR:580nm"
  "#F58220:NARANJA_FLAMA:605nm"
  "#E03A3E:ROJO_RUBÍ:650nm"
  "#963D97:PÚRPURA_CÓSMICO:420nm"
  "#009DDC:AZUL_PACÍFICO:470nm"
)

for entry in "\${COLOUR_ARRAY[@]}"; do
  IFS=":" read -r hex name wave <<< "$entry"
  echo "  [CARGANDO BANDA] $name -> $hex (Lambda: $wave) [OK]"
done

echo ""
echo "╔═══════════════════════════════════════╗"
echo "║          APPLE™ IT'S BACK™            ║"
echo "║      SINTETIZADOR DE ACORDE C         ║"
echo "║      ESPECTRO 6 BANDAS SINCRONIZADO   ║"
echo "╚═══════════════════════════════════════╝"
echo "✦ [AUDIO] Disparando frecuencia F#3 resonant chord..."
echo "✦ [STATUS] 100% Calibrado. La constelación brilla en 6 colores."
`
  },
  {
    id: 'pc_apple_colours',
    name: 'PC™_APPLE_COLOURS™',
    path: 'PC™_APPLE_COLOURS™',
    interpreter: 'Bash',
    description: 'Enlace bidireccional entre arquitecturas PC y la paleta de 6 tintes Apple™.',
    category: 'colours',
    executionCount: 2,
    isExecutable: true,
    content: `#!/usr/bin/env bash
# ==============================================================
# PC™_APPLE_COLOURS™ // INTERLINK BRIDGING UTILITY
# C: ( SNBV"™ ) - MATRIX MULTICOLOR
# ==============================================================

echo "✦ [PC™-BRIDGE] Estableciendo bus cromático PC <-> APPLE_COLOURS..."
echo "  Directorio de trabajo: C:\\ ( SNBV\\"™ )"

declare -A PALETTE=(
  ["BANDA_1"]="VERDE   (#61BB46)"
  ["BANDA_2"]="AMARILLO(#FDB827)"
  ["BANDA_3"]="NARANJA (#F58220)"
  ["BANDA_4"]="ROJO    (#E03A3E)"
  ["BANDA_5"]="PÚRPURA (#963D97)"
  ["BANDA_6"]="AZUL    (#009DDC)"
)

for band in "\${!PALETTE[@]}"; do
  echo "  >>> Mapeando registros de vídeo: $band => \${PALETTE[$band]}"
done

echo "✦ Sincronizando tabla CLUT (Color Look-Up Table)..."
echo "✦ Todos los puertos RGB calibrados a 32 bits punto flotante."
echo "✦ [EXIT 0] PC™_APPLE_COLOURS activado con éxito."
`
  },
  {
    id: 'colours_activation',
    name: 'COLOURS_ACTIVATION.sh',
    path: 'C:\\Documentos\\SERGIO Berlanga\\DAILY\\COLOURS_ACTIVATION.sh',
    interpreter: 'Bash',
    description: 'Enciende los propulsores de iones cromáticos de todas las naves en la constelación.',
    category: 'colours',
    executionCount: 3,
    isExecutable: true,
    content: `#!/usr/bin/env bash
# ==============================================================
# SNBV™ PROTOCOLO DE ACTIVACIÓN CROMÁTICA
# C:\\Documentos\\SERGIO Berlanga\\DAILY\\COLOURS_ACTIVATION.sh
# ==============================================================

echo "✦ [ACTIVATION] Encendiendo inyectores de plasma de color..."
echo "  Nivel de resonancia cuántica: 99.8%"

CHANNELS=("GAMMA_GREEN" "SOLAR_YELLOW" "PHOENIX_ORANGE" "RUBY_RED" "NEBULA_PURPLE" "BONDI_CYAN")

for chan in "\${CHANNELS[@]}"; do
  echo "  [ENLACE] $chan: Transmisor acoplado. Firma espectral bloqueada."
  sleep 0.1
done

echo "✦ [STATUS] 6 de 6 reactores cromáticos en línea."
echo "✦ Estela lumínica lista para vuelo orbital."
`
  },
  {
    id: 'colours_deployment',
    name: 'COLOURS_DEPLOYMENT.sh',
    path: 'C:\\Documentos\\SERGIO Berlanga\\DAILY\\COLOURS_DEPLOYMENT.sh',
    interpreter: 'Bash',
    description: 'Despliega la formación de naves en patrones estelares coordinados (Delta / Constelación).',
    category: 'deployment',
    executionCount: 2,
    isExecutable: true,
    content: `#!/usr/bin/env bash
# ==============================================================
# SNBV™ // COLOURS_DEPLOYMENT.sh
# C:\\Documentos\\SERGIO Berlanga\\DAILY\\
# ==============================================================

echo "✦ [DESPLIEGUE] Leyendo coordenadas estelares de la Constelación de Todos..."
echo "  Nodo Central: SNBV-Core [RA 18h 36m / Dec +38° 47']"
echo "  Calculando vectores de intercepción para 6 escuadrones..."

FORMATIONS=("DELTA" "HEXÁGONO" "ESPIRAL_CÓSMICA" "PATRULLA_LIBRE")
TARGET="CONSTELACIÓN_SNBV"

echo "  Matriz táctica asignada: $TARGET"
echo "  [SNBV-01] Verde Esmeralda -> Vector Orbital Alpha [OK]"
echo "  [SNBV-02] Amarillo Solar  -> Vector Orbital Beta  [OK]"
echo "  [SNBV-03] Naranja Fénix   -> Vector Orbital Gamma [OK]"
echo "  [SNBV-04] Rojo Rubí       -> Vector Orbital Delta [OK]"
echo "  [SNBV-05] Púrpura Nebular -> Vector Orbital Épsilon[OK]"
echo "  [SNBV-06] Azul Bondi      -> Vector Orbital Zeta  [OK]"

echo "✦ [CONFIRMACIÓN] Flota de Colores™ completamente posicionada."
`
  },
  {
    id: 'naves_espaciales',
    name: 'Naves_Espaciales_de_Colores™',
    path: 'Naves_Espaciales_de_Colores™',
    interpreter: 'Bash',
    description: 'Lanza maniobras de hipervelocidad y vuelos rasantes con la flota multicolor.',
    category: 'fleet',
    executionCount: 4,
    isExecutable: true,
    content: `#!/usr/bin/env bash
# ==============================================================
# Naves_Espaciales_de_Colores™ [ Bash ]
# COMANDANTE DE FLOTA: SERGIO Berlanga
# ==============================================================

echo "✦ [FLOTA] Inicializando módulo de vuelo: Naves_Espaciales_de_Colores™"
echo "  Comandante en puente: SERGIO Berlanga"
echo "  Propulsión: Curvatura Cromática de 6 Frecuencias"

echo "  [1/3] Calentando escudos refractarios..."
echo "  [2/3] Alineando giroscopios con ✦ SNBV ✦..."
echo "  [3/3] Potencia de motores al 100%..."

echo "╔═══════════════════════════════════════╗"
echo "║   NAVESS ESPACIALES DE COLORES™       ║"
echo "║   ¡LISTAS PARA MANIOBRA ORBITAL!      ║"
echo "╚═══════════════════════════════════════╝"
echo "✦ Salto warp sincronizado en 3... 2... 1... ¡IGNICIÓN!"
`
  },
  {
    id: 'tu_script',
    name: 'tu_script.sh',
    path: 'C:\\Documentos\\SERGIO Berlanga\\DAILY\\tu_script.sh',
    interpreter: 'Bash',
    description: 'Script personalizado del operador diario para diagnósticos de estación y notas de misión.',
    category: 'core',
    executionCount: 1,
    isExecutable: true,
    content: `#!/usr/bin/env bash
# ==============================================================
# tu_script.sh // ESTACIÓN DIARIA DE TRABAJO
# OPERADOR: SERGIO Berlanga
# UBICACIÓN: C:\\Documentos\\SERGIO Berlanga\\DAILY\\tu_script.sh
# ==============================================================

echo "✦ [DAILY] Ejecutando rutina de apertura de jornada..."
echo "  Fecha estelar: $(date +'%Y-%m-%d %H:%M:%S')"
echo "  Operador activo: SERGIO Berlanga"
echo "  Misión: Supervisar SNBV™ Constelación de Todos"

echo "  [DIAGNÓSTICO DIARIO]:"
echo "    - Terminal de telemetría: NOMINAL"
echo "    - Enlace de constelación: ACTIVO (9 nodos vinculados)"
echo "    - Flota de naves cromáticas: EN VUELO"
echo "    - Estado de ánimo: EXCELENTE"

echo "✦ [FIN DE RUTINA] Buen turno de exploración estelar."
`
  }
];

export const INITIAL_SHIPS: SpaceShip[] = [
  {
    id: 'ship-green',
    name: 'SNBV-01 Esmeralda',
    callsign: 'VERDE-ALPHA',
    colorHex: '#61BB46',
    colorName: 'Verde Manzana',
    wavelength: '520 nm',
    x: 28,
    y: 35,
    vx: 0.6,
    vy: -0.4,
    angle: 45,
    speed: 740,
    fuel: 98,
    shield: 100,
    status: 'en_formación',
    pilot: 'Sergio B.',
    mission: 'Reconocimiento de la Constelación'
  },
  {
    id: 'ship-yellow',
    name: 'SNBV-02 Solar',
    callsign: 'AMARILLO-BETA',
    colorHex: '#FDB827',
    colorName: 'Amarillo Solar',
    wavelength: '580 nm',
    x: 42,
    y: 22,
    vx: -0.5,
    vy: 0.7,
    angle: 120,
    speed: 810,
    fuel: 94,
    shield: 96,
    status: 'en_órbita',
    pilot: 'A. Hopper',
    mission: 'Calibración Espectral'
  },
  {
    id: 'ship-orange',
    name: 'SNBV-03 Fénix',
    callsign: 'NARANJA-GAMMA',
    colorHex: '#F58220',
    colorName: 'Naranja Fénix',
    wavelength: '605 nm',
    x: 68,
    y: 38,
    vx: 0.8,
    vy: 0.3,
    angle: 200,
    speed: 790,
    fuel: 91,
    shield: 98,
    status: 'en_formación',
    pilot: 'K. Wozniak',
    mission: 'Propulsión Iónica'
  },
  {
    id: 'ship-red',
    name: 'SNBV-04 Rubí',
    callsign: 'ROJO-DELTA',
    colorHex: '#E03A3E',
    colorName: 'Rojo Rubí',
    wavelength: '650 nm',
    x: 75,
    y: 65,
    vx: -0.7,
    vy: -0.5,
    angle: 310,
    speed: 850,
    fuel: 88,
    shield: 100,
    status: 'hipervelocidad',
    pilot: 'S. Jobs',
    mission: 'Vanguardia Vectorial'
  },
  {
    id: 'ship-purple',
    name: 'SNBV-05 Nebular',
    callsign: 'PÚRPURA-EPSILON',
    colorHex: '#963D97',
    colorName: 'Púrpura Cósmico',
    wavelength: '420 nm',
    x: 52,
    y: 78,
    vx: 0.4,
    vy: -0.8,
    angle: 90,
    speed: 730,
    fuel: 96,
    shield: 94,
    status: 'en_formación',
    pilot: 'M. Hamilton',
    mission: 'Telemetría y Enlace'
  },
  {
    id: 'ship-blue',
    name: 'SNBV-06 Bondi',
    callsign: 'AZUL-ZETA',
    colorHex: '#009DDC',
    colorName: 'Azul Bondi',
    wavelength: '470 nm',
    x: 25,
    y: 68,
    vx: -0.6,
    vy: 0.5,
    angle: 15,
    speed: 820,
    fuel: 99,
    shield: 99,
    status: 'patrulla',
    pilot: 'J. Ive',
    mission: 'Defensa de Perímetro'
  }
];

export const CONSTELLATION_STARS: ConstellationStar[] = [
  {
    id: 'snbv-core',
    name: 'SNBV-Core',
    code: 'α-SNBV',
    x: 50,
    y: 48,
    magnitude: 1.1,
    spectralType: 'O5V Hyperion',
    connectedTo: ['star-north', 'star-east', 'star-south', 'star-west', 'star-ne', 'star-sw'],
    isCoreSNBV: true
  },
  {
    id: 'star-north',
    name: 'Corona Polaris',
    code: 'β-CPOL',
    x: 50,
    y: 18,
    magnitude: 2.3,
    spectralType: 'B2IV',
    connectedTo: ['snbv-core', 'star-ne', 'star-nw']
  },
  {
    id: 'star-ne',
    name: 'Vega Australis',
    code: 'γ-VEGA',
    x: 72,
    y: 26,
    magnitude: 1.8,
    spectralType: 'A0V',
    connectedTo: ['star-north', 'star-east', 'snbv-core']
  },
  {
    id: 'star-east',
    name: 'Sirius Orientalis',
    code: 'δ-SIRI',
    x: 82,
    y: 50,
    magnitude: 1.4,
    spectralType: 'A1V',
    connectedTo: ['star-ne', 'star-se', 'snbv-core']
  },
  {
    id: 'star-se',
    name: 'Antares Nova',
    code: 'ε-ANTA',
    x: 74,
    y: 74,
    magnitude: 2.5,
    spectralType: 'M1Ib',
    connectedTo: ['star-east', 'star-south']
  },
  {
    id: 'star-south',
    name: 'Centauri Prime',
    code: 'ζ-CENT',
    x: 50,
    y: 84,
    magnitude: 1.6,
    spectralType: 'G2V',
    connectedTo: ['snbv-core', 'star-se', 'star-sw']
  },
  {
    id: 'star-sw',
    name: 'Rigel Nebula',
    code: 'η-RIGL',
    x: 26,
    y: 74,
    magnitude: 1.9,
    spectralType: 'B8Ia',
    connectedTo: ['star-south', 'star-west', 'snbv-core']
  },
  {
    id: 'star-west',
    name: 'Aldebaran Star',
    code: 'θ-ALDE',
    x: 18,
    y: 50,
    magnitude: 2.1,
    spectralType: 'K5III',
    connectedTo: ['star-sw', 'star-nw', 'snbv-core']
  },
  {
    id: 'star-nw',
    name: 'Pleione Cluster',
    code: 'ι-PLEI',
    x: 28,
    y: 26,
    magnitude: 2.8,
    spectralType: 'B8Vne',
    connectedTo: ['star-north', 'star-west']
  }
];

export const RETRO_ASCII_EMBLEMS = {
  cross: `   ✦
         ╱  │  ╲
      ✦ ─ SNBV ─ ✦
         ╲  │  ╱
            ✦`,
  bannerBox: `╔════════════════════╗
║      SNBV™         ║
║  CONSTELACIÓN      ║
║      DE TODOS      ║
╚════════════════════╝`,
  badge: `   ╭─────╮
  │ SNBV │
  │  ◉   │
   ╰─────╯`,
  pill: `    ╭───────╮
    │ SNBV™ │
    ╰───────╯`
};
