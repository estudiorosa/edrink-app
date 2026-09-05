import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const marca = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--fuente-marca',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bartender Edrink | Dime qué te gusta y te armo el trago',
  description:
    'Elige un sabor o cuenta qué tienes en la casa y el bartender de Edrink arma la receta con el catálogo real de la botillería. Genera tu ficha y retírala en Edrink Antofagasta con hielo de regalo.',
  metadataBase: new URL('https://bartender.edrink.cl'),
  openGraph: {
    title: 'Bartender Edrink',
    description: 'Recetas armadas con el catálogo real de Edrink. Genera tu ficha y retírala en Edrink Antofagasta.',
    locale: 'es_CL',
    type: 'website',
  },
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={marca.variable}>
      <body className="min-h-screen bg-noche text-hueso">
        {children}
      </body>
    </html>
  )
}
