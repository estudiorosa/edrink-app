import { BOTILLERIAS, urlMapaEmbed } from '@/lib/botillerias'

const botilleria = BOTILLERIAS[0]

const PASOS = [
  {
    titulo: 'Arma tu cóctel',
    texto: 'Elige la receta sugerida según tu ocasión y ajusta la cantidad de personas con stock verificado.',
  },
  {
    titulo: 'Revisa tu Ficha de Mesón',
    texto: 'Confirma el combo cerrado a precio preferencial y tu bolsa de hielo gratis ($0) lista para retiro.',
  },
  {
    titulo: `Pasa por ${botilleria.nombre}`,
    texto: 'Ve a la botillería con la pantalla activa y muéstrasela directamente al botillero.',
  },
  {
    titulo: 'Paga y prepara en casa',
    texto: 'Te llevas todo en una sola bolsa, sigues la guía en 3 pasos y a brindar.',
  },
]

export function ComoFunciona() {
  return (
    <section id="red" className="border-t border-noche-borde py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <h2 className="titular peso-h2 text-grande text-hueso">
              De tu pantalla al mesón: tu previa lista en segundos
            </h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-bruma">
              Olvídate del reparto y de improvisar recetas. Arma tu pack con hielo de regalo incluido, pasa por{' '}
              {botilleria.nombre} y muéstralo en caja. Llegas, te pasan la bolsa y listo para el brindis.
            </p>

            <ol className="mt-10 space-y-8">
              {PASOS.map((paso, i) => (
                <li key={paso.titulo} className="flex gap-5">
                  <span className="numero text-3xl leading-none text-lima">{i + 1}</span>
                  <div>
                    <h3 className="rotulo text-lg text-hueso">{paso.titulo}</h3>
                    <p className="mt-2 max-w-[46ch] text-base leading-relaxed text-bruma">{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="self-start border border-noche-borde bg-noche-alto/40 p-6">
            <h3 className="rotulo text-lg text-hueso">La botillería que te recibe</h3>
            <p className="mt-2 text-sm text-bruma">
              Un solo local en Antofagasta. Llegas tú directamente al mesón: no hay reparto ni tiempos de espera
              de por medio.
            </p>
            <div className="mt-5 aspect-video w-full overflow-hidden border border-noche-borde">
              <iframe
                src={urlMapaEmbed(botilleria)}
                title={`Mapa de ${botilleria.nombre}`}
                className="h-full w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="mt-5 border-t border-noche-borde pt-4">
              <p className="text-sm text-hueso">{botilleria.nombre}</p>
              <p className="mt-0.5 text-xs text-bruma">
                {botilleria.direccion}, {botilleria.sector}. Cierra {botilleria.cierra}.
              </p>
              <p className="numero mt-3 text-sm text-lima">
                {botilleria.estrellas.toString().replace('.', ',')} estrellas · {botilleria.pedidosMes} pedidos el
                mes pasado
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
