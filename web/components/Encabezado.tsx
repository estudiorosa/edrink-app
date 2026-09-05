'use client'

import Image from 'next/image'
import Link from 'next/link'
import { abrirCarro, useCarrito } from '@/lib/carrito'
import { clp } from '@/lib/formato'

export function Marca() {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/logo-edrink.svg"
        alt="Edrink — Click and brindis"
        width={220}
        height={82}
        priority
        className="h-8 w-auto sm:h-9"
      />
    </Link>
  )
}

export function Encabezado() {
  const { unidades, subtotal } = useCarrito()

  return (
    <header className="sticky top-0 z-40 border-b border-noche-borde/70 bg-noche/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Marca />
        <div className="flex items-center gap-3">
          <Link
            href="/botilleria"
            className="hidden text-sm text-bruma transition-colors hover:text-hueso sm:block"
          >
            Panel de botillería
          </Link>
          <button
            type="button"
            onClick={abrirCarro}
            className="rotulo flex items-center gap-2 rounded-sm border border-noche-borde bg-noche-alto px-4 py-2 text-sm transition-colors hover:border-lima"
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
