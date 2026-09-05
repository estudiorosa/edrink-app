'use client'

import Link from 'next/link'
import { ImagenProducto } from '@/components/ImagenProducto'
import { Boton, Etiqueta } from '@/components/ui'
import { BOTILLERIAS, urlMaps } from '@/lib/botillerias'
import { clp, hora } from '@/lib/formato'
import { cancelarPedido, usePedido, type EstadoPedido, type Pedido } from '@/lib/pedidos'

const botilleria = BOTILLERIAS[0]

export function FichaMeson({ id }: { id: string }) {
  const pedido = usePedido(id)

  if (!pedido) {
    return (
      <Aviso
        titulo={`No encuentro la ficha ${id}`}
        texto="Las fichas de esta demostración se guardan en el navegador donde se generaron. Si abriste el enlace en otro equipo o borraste los datos del sitio, ya no está."
      />
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-sm text-bruma transition-colors hover:text-hueso">
          Volver al bartender
        </Link>
        <div className="flex items-center gap-2">
          <Etiqueta tono="lima">Ficha {pedido.id}</Etiqueta>
          <Etiqueta>{ESTADO_TEXTO[pedido.estado]}</Etiqueta>
        </div>
      </div>

      <Titular pedido={pedido} />

      {pedido.estado !== 'cancelado' ? (
        <div className="textura-marca mt-8 border-2 border-lima p-6 text-center">
          <p className="rotulo text-sm text-bruma">Muestra esta pantalla en el mesón de</p>
          <p className="titular mt-1 text-2xl text-hueso">{botilleria.nombre}</p>
          <p className="numero mt-5 text-5xl text-lima">{pedido.id}</p>
          <p className="rotulo mt-1 text-xs text-bruma">Código de tu ficha</p>
          <p className="mt-4 text-sm text-bruma">
            {botilleria.direccion}, {botilleria.sector}. Cierra {botilleria.cierra}.
          </p>
          <a
            href={urlMaps(botilleria)}
            target="_blank"
            rel="noreferrer"
            className="rotulo mt-4 inline-block border border-lima px-5 py-2.5 text-sm text-lima transition-colors hover:bg-lima hover:text-noche"
          >
            Cómo llegar
          </a>
        </div>
      ) : null}

      <Detalle pedido={pedido} />

      <Bitacora pedido={pedido} />

      {pedido.estado === 'pendiente' ? (
        <div className="mt-10">
          <Boton variante="contorno" onClick={() => cancelarPedido(pedido.id)}>
            Cancelar la ficha
          </Boton>
        </div>
      ) : null}
    </main>
  )
}

const ESTADO_TEXTO: Record<EstadoPedido, string> = {
  pendiente: 'por retirar',
  canjeado: 'canjeada',
  cancelado: 'cancelada',
}

function Aviso({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-5">
      <h1 className="titular peso-h1 text-grande text-hueso">{titulo}</h1>
      <p className="mt-4 text-base leading-relaxed text-bruma">{texto}</p>
      <Link
        href="/"
        className="rotulo mt-8 self-start border border-lima px-5 py-2.5 text-base text-lima transition-colors hover:bg-lima hover:text-noche"
      >
        Armar otro trago
      </Link>
    </main>
  )
}

function Titular({ pedido }: { pedido: Pedido }) {
  const copia: Record<EstadoPedido, { titulo: string; texto: string }> = {
    pendiente: {
      titulo: 'Tu ficha está lista',
      texto: 'Llévala al mesón y muéstrasela al dependiente para retirar tu combo con el hielo de regalo.',
    },
    canjeado: {
      titulo: 'Ficha ya canjeada',
      texto: 'Retiraste tu combo en el mesón. Que lo disfrutes — prohibida la venta a menores de 18 años.',
    },
    cancelado: {
      titulo: 'Ficha cancelada',
      texto: 'No se cobró nada. Puedes armar otro trago cuando quieras.',
    },
  }

  const { titulo, texto } = copia[pedido.estado]

  return (
    <div className="mt-6 border-b border-noche-borde pb-8">
      <h1 className="titular peso-h1 text-grande text-hueso">{titulo}</h1>
      <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-bruma">{texto}</p>
    </div>
  )
}

function Detalle({ pedido }: { pedido: Pedido }) {
  return (
    <div className="mt-8 border border-noche-borde bg-noche-alto/40">
      <div className="border-b border-noche-borde px-5 py-3">
        <p className="rotulo text-base text-hueso">
          {pedido.receta ? `Pack para ${pedido.receta.nombre.toLowerCase()}` : 'Tu pedido'}
        </p>
        <p className="mt-1 text-xs text-bruma">{pedido.cliente.nombre}</p>
      </div>
      <ul className="divide-y divide-noche-borde">
        {pedido.items.map((item) => (
          <li key={item.productoId} className="flex items-center gap-3 px-5 py-3">
            <ImagenProducto src={item.imagen} alt={item.nombre} lado={40} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-hueso">{item.nombre}</p>
              <p className="numero text-xs text-bruma">
                {item.cantidad} x {clp(item.precio)}
              </p>
            </div>
            <p className="numero text-sm text-lima">{clp(item.precio * item.cantidad)}</p>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between border-t border-noche-borde px-5 py-4">
        <span className="rotulo text-base text-hueso">Total a pagar en el mesón</span>
        <span className="numero text-2xl text-lima">{clp(pedido.total)}</span>
      </div>
    </div>
  )
}

function Bitacora({ pedido }: { pedido: Pedido }) {
  return (
    <div className="mt-10 border-t border-noche-borde pt-6">
      <p className="rotulo text-base text-hueso">Lo que fue pasando</p>
      <ul className="mt-4 space-y-2">
        {pedido.eventos.map((e, i) => (
          <li key={`${e.en}-${i}`} className="flex gap-4 text-sm">
            <span className="numero shrink-0 text-bruma">{hora(e.en)}</span>
            <span className="text-bruma">{e.texto}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
