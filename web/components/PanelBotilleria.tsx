'use client'

import Link from 'next/link'
import { BOTILLERIAS } from '@/lib/botillerias'
import { clp, hora } from '@/lib/formato'
import { canjearPedido, pendientes, usePedidos, type Pedido } from '@/lib/pedidos'

const botilleria = BOTILLERIAS[0]

export function PanelBotilleria() {
  const pedidos = usePedidos()
  const porCanjear = pendientes(pedidos)
  const cerradas = pedidos.filter((p) => p.estado === 'canjeado' || p.estado === 'cancelado')

  return (
    <div className="min-h-screen bg-hueso text-noche">
      <header className="border-b-2 border-noche bg-hueso">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="titular text-2xl text-noche">EDRINK</p>
            <p className="text-sm text-noche/60">Mesón — {botilleria.nombre}</p>
          </div>
          <Link href="/" className="text-sm text-noche/60 underline underline-offset-4 hover:text-noche">
            Ir al bartender
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b-2 border-noche pb-4">
          <h1 className="titular peso-h1 text-grande text-noche">Fichas por canjear</h1>
          <p className="text-sm text-noche/70">
            {botilleria.direccion}, {botilleria.sector}. Cierra a las {botilleria.cierra}.{' '}
            {botilleria.pedidosMes} pedidos el mes pasado.
          </p>
        </div>

        <section className="mt-8">
          <h2 className="rotulo peso-h2 text-xl text-noche">
            Pendientes {porCanjear.length ? `(${porCanjear.length})` : ''}
          </h2>
          {porCanjear.length === 0 ? (
            <div className="mt-4 border-2 border-dashed border-noche/30 p-8 text-center">
              <p className="text-base text-noche/70">No hay fichas esperando.</p>
              <p className="mx-auto mt-2 max-w-[52ch] text-sm text-noche/60">
                Arma un combo en el bartender y genera una ficha de mesón. Aparece acá en el momento, en esta
                misma pestaña o en otra del mismo navegador.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {porCanjear.map((p) => (
                <TarjetaFicha key={p.id} pedido={p} />
              ))}
            </ul>
          )}
        </section>

        {cerradas.length ? (
          <section className="mt-12">
            <h2 className="rotulo peso-h2 text-xl text-noche">Cerradas hoy</h2>
            <ul className="mt-4 divide-y divide-noche/20 border-y border-noche/20">
              {cerradas.map((p) => (
                <li key={p.id} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <span className="numero text-noche/70">{p.id}</span>
                  <span className="text-noche/70">{p.cliente.nombre}</span>
                  <span className="numero text-noche">{clp(p.total)}</span>
                  <span className="text-noche/60">{p.estado === 'canjeado' ? 'canjeada' : 'cancelada'}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-14 border-t border-noche/20 pt-6 text-xs leading-relaxed text-noche/60">
          Demostración: las fichas viven en el navegador y se sincronizan entre pestañas del mismo equipo. En
          producción esto sería un servidor con notificaciones al celular del local.
        </p>
      </main>
    </div>
  )
}

function TarjetaFicha({ pedido }: { pedido: Pedido }) {
  return (
    <li className="border-2 border-noche bg-hueso">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-noche bg-noche px-5 py-3 text-hueso">
        <div>
          <p className="rotulo text-lg">Ficha {pedido.id}</p>
          <p className="text-sm text-bruma">
            {pedido.cliente.nombre}, {pedido.cliente.telefono}
          </p>
        </div>
        <p className="numero text-2xl text-lima">{clp(pedido.total)}</p>
      </div>

      <div className="grid gap-6 px-5 py-4 sm:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="text-sm text-noche/60">
            {pedido.receta ? `Pack para ${pedido.receta.nombre.toLowerCase()}` : 'Productos sueltos'}
          </p>
          <ul className="mt-2 space-y-1">
            {pedido.items.map((i) => (
              <li key={i.productoId} className="flex justify-between gap-4 text-sm">
                <span className="text-noche">
                  <span className="numero">{i.cantidad}</span> {i.nombre}
                </span>
                <span className="numero text-noche/70">{clp(i.precio * i.cantidad)}</span>
              </li>
            ))}
          </ul>
          {pedido.cliente.notas ? (
            <p className="mt-3 border-l-4 border-magenta pl-3 text-sm text-noche/80">{pedido.cliente.notas}</p>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-4">
          <p className="text-sm text-noche/70">Generada a las {hora(pedido.creadoEn)}</p>
          <button
            type="button"
            onClick={() => canjearPedido(pedido.id)}
            className="rotulo bg-noche px-5 py-3 text-base text-lima transition-colors hover:bg-noche-alto"
          >
            Marcar como canjeada
          </button>
        </div>
      </div>
    </li>
  )
}
