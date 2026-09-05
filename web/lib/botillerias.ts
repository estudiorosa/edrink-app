// Botillería única de Antofagasta donde se retira el pedido en el mesón. No hay despacho ni
// red de locales: el cliente genera su ficha en la web y la muestra acá para pagar y llevarse
// el combo.

export type Botilleria = {
  id: string
  nombre: string
  sector: string
  direccion: string
  estrellas: number
  pedidosMes: number
  cierra: string
}

export const BOTILLERIAS: Botilleria[] = [
  {
    id: 'antofagasta',
    nombre: 'Edrink Antofagasta',
    sector: 'La Chimba',
    direccion: 'Av. Edmundo Pérez Zujovic 4764',
    estrellas: 4.7,
    pedidosMes: 1850,
    cierra: '02:00',
  },
]

export const POR_ID: Record<string, Botilleria> = Object.fromEntries(BOTILLERIAS.map((b) => [b.id, b]))

/** Link directo a Google Maps con la dirección del local, sin depender de coordenadas guardadas. */
export function urlMaps(b: Botilleria): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.direccion}, ${b.sector}, Antofagasta`)}`
}

/** Mapa embebido de Google Maps por dirección: no requiere API key. */
export function urlMapaEmbed(b: Botilleria): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(`${b.direccion}, ${b.sector}, Antofagasta`)}&output=embed`
}
