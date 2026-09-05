import Image from 'next/image'
import Link from 'next/link'

export function Pie({ totalProductos }: { totalProductos: number }) {
  return (
    <footer className="textura-marca border-t border-noche-borde py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-[42ch]">
          <div className="flex items-center gap-2">
            <Image src="/logo-edrink.svg" alt="Edrink — Click and brindis" width={220} height={82} className="h-9 w-auto" />
            <span className="bajada text-base text-cyan">bartender</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-bruma">
            Demostración construida sobre el catálogo público de edrink.cl: {totalProductos} productos con su
            precio real. No procesa pagos ni envía pedidos a la botillería.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/botilleria" className="text-bruma transition-colors hover:text-hueso">
            Panel de botillería
          </Link>
          <a
            href="https://www.edrink.cl"
            className="text-bruma transition-colors hover:text-hueso"
            rel="noreferrer"
            target="_blank"
          >
            Tienda de Edrink
          </a>
          <p className="mt-4 text-xs leading-relaxed text-bruma/70">
            Prohibida la venta de alcohol a menores de 18 años.
            <br />
            Bebe con moderación.
          </p>
        </div>
      </div>
    </footer>
  )
}
