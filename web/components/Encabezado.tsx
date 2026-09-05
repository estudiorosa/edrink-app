'use client'

import Image from 'next/image'
import Link from 'next/link'
import { abrirCarro, useCarrito } from '@/lib/carrito'
import { clp } from '@/lib/formato'

export function Marca() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-1.5 sm:gap-2">
      <Image
        src="/logo-edrink.svg"
        alt="Edrink"
        width={632}
        height={100}
        priority
        className="h-5 w-auto shrink-0 sm:h-10"
      />
      <span className="bajada shrink-0 text-sm text-cyan sm:text-base">bartender</span>
    </Link>
  )
}

export function Encabezado() {
  const { unidades, subtotal } = useCarrito()

  return (
    <header className="sticky top-0 z-40 border-b border-noche-borde/70 bg-noche/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-5 py-5 sm:gap-4">
        <Marca />
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={abrirCarro}
            className="rotulo flex items-center gap-2 rounded-sm border border-noche-borde bg-noche-alto px-3 py-2 text-sm transition-colors hover:border-lima sm:px-4"
          >
            <span>Carro</span>
            <span className="numero text-lima">{unidades}</span>
            {subtotal > 0 ? <span className="numero text-bruma">{clp(subtotal)}</span> : null}
          </button>
        </div>
      </div>
    </header>
  )
}
