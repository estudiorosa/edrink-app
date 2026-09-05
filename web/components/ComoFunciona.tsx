import Link from 'next/link'
import { BOTILLERIAS } from '@/lib/botillerias'

const botilleria = BOTILLERIAS[0]

const PASOS = [
  {
    titulo: 'Pides el pack',
    texto: `El pedido llega directo al panel de ${botilleria.nombre} con tu dirección y el detalle de las botellas.`,
  },
  {
    titulo: 'Suena en el local',
    texto: 'La botillería lo ve al instante en su panel y tiene 22 segundos para tomarlo antes de que quede sin respuesta.',
  },
  {
    titulo: 'Si no contesta a tiempo',
    texto: 'El pedido queda "sin cobertura" y puedes reenviarlo con un clic. Es un canal directo, sin otro local al que redirigirlo.',
  },
]

export function ComoFunciona() {
  return (
    <section id="red" className="border-t border-noche-borde py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <h2 className="titular text-grande text-hueso">Cómo llega a tu casa</h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-bruma">
              Funciona como pedir un auto, pero con un solo conductor: tú pides, se le avisa a {botilleria.nombre} y
              ella confirma que puede tomarlo.
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

            <div className="mt-10 border border-noche-borde bg-noche-alto/50 p-5">
              <p className="text-base text-hueso">¿Quieres ver el otro lado del mostrador?</p>
              <p className="mt-2 text-sm leading-relaxed text-bruma">
                Abre el panel de botillería en otra pestaña del mismo navegador y toma tú mismo el pedido que
                acabas de hacer. Es la pantalla que vería el local.
              </p>
              <Link
                href="/botilleria"
                className="rotulo mt-4 inline-block border border-lima px-5 py-2.5 text-sm text-lima transition-colors hover:bg-lima hover:text-noche"
              >
                Abrir el panel de botillería
              </Link>
            </div>
          </div>

          <div className="border border-noche-borde bg-noche-alto/40 p-6">
            <h3 className="rotulo text-lg text-hueso">La botillería que despacha</h3>
            <p className="mt-2 text-sm text-bruma">
              Un solo local en Antofagasta. La distancia se recalcula contra el sector que elijas en el
              checkout.
            </p>
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
