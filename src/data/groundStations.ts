export interface GroundStation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  colorHex: string;
  colorName: string;
  wavelength: string;
  dishDiameter: string;
  frequency: string;
  linkedShip: string;
  status: 'ONLINE' | 'TRANSMITIENDO' | 'CALIBRANDO';
  description: string;
}

export const INITIAL_GROUND_STATIONS: GroundStation[] = [
  {
    id: 'station-cupertino',
    name: 'Sede Central SNBV Silicon Valley',
    code: 'SNBV-HQ-01',
    lat: 37.3346,
    lng: -122.009,
    city: 'Cupertino, California',
    country: 'EE.UU.',
    colorHex: '#61BB46',
    colorName: 'Verde Manzana',
    wavelength: '520 nm',
    dishDiameter: '32 metros',
    frequency: '8.45 GHz X-Band',
    linkedShip: 'SNBV-01 Esmeralda',
    status: 'ONLINE',
    description: 'Estación matriz de comando y enlace de telemetría de 6 frecuencias.',
  },
  {
    id: 'station-kennedy',
    name: 'Centro Espacial Kennedy',
    code: 'KSC-SNBV-02',
    lat: 28.5729,
    lng: -80.649,
    city: 'Cabo Cañaveral, Florida',
    country: 'EE.UU.',
    colorHex: '#FDB827',
    colorName: 'Amarillo Solar',
    wavelength: '580 nm',
    dishDiameter: '35 metros',
    frequency: '14.2 GHz Ku-Band',
    linkedShip: 'SNBV-02 Solar',
    status: 'TRANSMITIENDO',
    description: 'Plataforma orbital de lanzamiento y acoplamiento de la flota cromática.',
  },
  {
    id: 'station-kourou',
    name: 'Puerto Espacial Guayana',
    code: 'CSG-SNBV-03',
    lat: 5.239,
    lng: -52.768,
    city: 'Kourou',
    country: 'Guayana Francesa',
    colorHex: '#F58220',
    colorName: 'Naranja Fénix',
    wavelength: '605 nm',
    dishDiameter: '28 metros',
    frequency: '22.5 GHz Ka-Band',
    linkedShip: 'SNBV-03 Fénix',
    status: 'ONLINE',
    description: 'Estación ecuatorial de inserción orbital de alta aceleración.',
  },
  {
    id: 'station-canarias',
    name: 'Observatorio Roque de los Muchachos',
    code: 'ORM-SNBV-04',
    lat: 28.7566,
    lng: -17.892,
    city: 'La Palma, Canarias',
    country: 'España',
    colorHex: '#E03A3E',
    colorName: 'Rojo Rubí',
    wavelength: '650 nm',
    dishDiameter: 'Telescopio Óptico 10.4m',
    frequency: 'Enlace Láser 1550 nm',
    linkedShip: 'SNBV-04 Rubí',
    status: 'TRANSMITIENDO',
    description: 'Receptor de comunicación óptica cuántica y espectrometría estelar.',
  },
  {
    id: 'station-canberra',
    name: 'Complejo de Espacio Profundo Tidbinbilla',
    code: 'CDSCC-SNBV-05',
    lat: -35.4014,
    lng: 148.9817,
    city: 'Canberra',
    country: 'Australia',
    colorHex: '#963D97',
    colorName: 'Púrpura Cósmico',
    wavelength: '420 nm',
    dishDiameter: '70 metros',
    frequency: '32.1 GHz Ka-Band Deep Space',
    linkedShip: 'SNBV-05 Nebular',
    status: 'ONLINE',
    description: 'Red de espacio profundo para enlace continuo con la constelación α-SNBV.',
  },
  {
    id: 'station-tsukuba',
    name: 'Centro de Rastreo Espacial Tsukuba',
    code: 'TKSC-SNBV-06',
    lat: 36.0658,
    lng: 140.1272,
    city: 'Tsukuba, Ibaraki',
    country: 'Japón',
    colorHex: '#009DDC',
    colorName: 'Azul Bondi',
    wavelength: '470 nm',
    dishDiameter: '30 metros',
    frequency: '8.2 GHz X-Band',
    linkedShip: 'SNBV-06 Bondi',
    status: 'CALIBRANDO',
    description: 'Control de actitud, sensores estelares y escudo refractor.',
  },
  {
    id: 'station-monterrey',
    name: 'Puesto de Mando SERGIO Berlanga',
    code: 'SB-CMD-07',
    lat: 25.6866,
    lng: -100.3161,
    city: 'Monterrey, Nuevo León',
    country: 'México',
    colorHex: '#FDB827',
    colorName: 'Oro Solar',
    wavelength: '580 nm',
    dishDiameter: 'Consola Táctica Dual',
    frequency: 'Enlace Bash Directo [DAILY]',
    linkedShip: 'Supervisión Global de Flota',
    status: 'ONLINE',
    description: 'Puesto de comando del operador diario para tu_script.sh y despliegues estelares.',
  },
];
