import { BOTILLERIAS } from '@/lib/botillerias'

const botilleria = BOTILLERIAS[0]

const PASOS = [
  {
    titulo: 'El hielo corre por nuestra cuenta',
    texto: 'Entras buscando qué tomar y partes ganando: cada combo viene con una bolsa de hielo de regalo para que llegues directo a servir.',
  },
  {
    titulo: 'Armas tu combo',
    texto: 'Eliges la receta sugerida y ajustas la cantidad de vasos o invitados; el pack se arma con lo que hay en stock hoy.',
  },
  {
    titulo: 'Revisas la ficha de mesón',
    texto: 'Ves el desglose del combo, el precio cerrado y la bonificación del hielo confirmada a $0.',
  },
  {
    titulo: 'Vas hasta la tienda',
    texto: `Caminas o manejas hasta ${botilleria.nombre} con la ficha abierta o guardada en el teléfono.`,
  },
  {
    titulo: 'Compras en el mesón',
    texto: 'Le muestras la pantalla al dependiente: "quiero este combo con el hielo gratis", y pagas ahí mismo, sin fila ni explicaciones.',
  },
  {
    titulo: 'Preparas en casa',
    texto: 'Abres la guía de preparación, sigues las proporciones en 3 pasos y sirves al grupo.',
  },
]

export function ComoFunciona() {
  return (
    <section id="red" className="border-t border-noche-borde py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <h2 className="titular peso-h2 text-grande text-hueso">De la pantalla al mesón, en 6 pasos</h2>
            <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-bruma">
              Nada de reparto: arma tu combo con hielo de regalo incluido, camina hasta {botilleria.nombre} y
              muéstralo en caja. Tú llegas, el botillero ya sabe qué llevarte.
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

          <div className="border border-noche-borde bg-noche-alto/40 p-6">
            <h3 className="rotulo text-lg text-hueso">La botillería que te recibe</h3>
            <p className="mt-2 text-sm text-bruma">
              Un solo local en Antofagasta. Llegas tú directamente al mesón: no hay reparto ni tiempos de espera
              de por medio.
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
