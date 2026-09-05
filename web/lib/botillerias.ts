// Botillería única de Antofagasta que recibe los pedidos. No hay red de locales: todo el
// despacho pasa por este punto, así que el "radio de búsqueda" representa la zona de cobertura
// de despacho, no una lista de locales alternativos.

export type Botilleria = {
  id: string
  nombre: string
  sector: string
  direccion: string
  lat: number
  lng: number
  /** Distancia de referencia, medida desde La Chimba. La real se calcula por pedido. */
  distanciaKm: number
  /** Grados sobre el radar, medidos desde el norte. */
  angulo: number
  estrellas: number
  pedidosMes: number
  minutosPreparacion: number
  /** Con qué frecuencia acepta cuando el piloto automático responde por ella. */
  tasaAceptacion: number
  cierra: string
}

export const BOTILLERIAS: Botilleria[] = [
  {
    id: 'antofagasta',
    nombre: 'Edrink Antofagasta',
    sector: 'La Chimba',
    direccion: 'Av. Edmundo Pérez Zujovic 4764',
    lat: -23.6247,
    lng: -70.3912,
    distanciaKm: 0.8,
    angulo: 35,
    estrellas: 4.7,
    pedidosMes: 1850,
    minutosPreparacion: 8,
    tasaAceptacion: 0.85,
    cierra: '02:00',
  },
]

export const POR_ID: Record<string, Botilleria> = Object.fromEntries(BOTILLERIAS.map((b) => [b.id, b]))

/**
 * Radio único de cobertura: al ser una sola botillería no tiene sentido ampliar la búsqueda por
 * etapas (eso solo servía para alcanzar otro local cuando el más cercano no contestaba). Fuera de
 * este radio el pedido queda "sin cobertura".
 */
export const RADIOS_KM = [15]

export type Sector = { nombre: string; lat: number; lng: number }

export const SECTORES: Sector[] = [
  { nombre: 'La Chimba', lat: -23.618, lng: -70.393 },
  { nombre: 'Centro', lat: -23.6509, lng: -70.3986 },
  { nombre: 'Los Arenales', lat: -23.63, lng: -70.397 },
  { nombre: 'Coviefi', lat: -23.68, lng: -70.394 },
  { nombre: 'Bonilla', lat: -23.665, lng: -70.406 },
  { nombre: 'La Portada', lat: -23.585, lng: -70.401 },
  { nombre: 'Jardines del Sur', lat: -23.6975, lng: -70.3958 },
]

const RADIO_TIERRA_KM = 6371
const aRadianes = (grados: number) => (grados * Math.PI) / 180

export function distanciaEntre(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = aRadianes(b.lat - a.lat)
  const dLng = aRadianes(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(a.lat)) * Math.cos(aRadianes(b.lat)) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * RADIO_TIERRA_KM * Math.asin(Math.sqrt(h)) * 10) / 10
}

/** Distancia real de cada local a la comuna de entrega elegida en el checkout. */
export function distanciasDesde(nombreSector: string): Record<string, number> {
  const sector = SECTORES.find((s) => s.nombre === nombreSector) ?? SECTORES[0]
  return Object.fromEntries(BOTILLERIAS.map((b) => [b.id, distanciaEntre(sector, b)]))
}

export function distanciaDe(id: string, distancias?: Record<string, number>): number {
  return distancias?.[id] ?? POR_ID[id]?.distanciaKm ?? 0
}
