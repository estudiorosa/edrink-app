'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImagenProducto } from '@/components/ImagenProducto'
import { Boton } from '@/components/ui'
import { cambiarCantidad, cerrarCarro, quitar, useCarrito, vaciar } from '@/lib/carrito'
import { clp } from '@/lib/formato'
import { crearPedido } from '@/lib/pedidos'

type Formulario = {
  nombre: string
  telefono: string
  notas: string
  mayor: boolean
  consentMessaging: boolean
}

const INICIAL: Formulario = {
  nombre: '',
  telefono: '',
  notas: '',
  mayor: false,
  consentMessaging: false,
}

export function CajonCarrito() {
  const carrito = useCarrito()
  const router = useRouter()
  const [paso, setPaso] = useState<'carro' | 'datos'>('carro')
  const [form, setForm] = useState<Formulario>(INICIAL)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!carrito.abierto) return
    function alTeclear(e: KeyboardEvent) {
      if (e.key === 'Escape') cerrarCarro()
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [carrito.abierto])

  if (!carrito.abierto) return null

  function enviar() {
    if (!form.nombre.trim()) {
      setError('Falta tu nombre para dejarlo en la ficha.')
      return
    }
    if (form.telefono.replace(/\D/g, '').length < 8) {
      setError('El teléfono queda corto. El local lo pide por si hay que avisarte algo.')
      return
    }
    if (!form.mayor) {
      setError('Tienes que confirmar que eres mayor de 18 años.')
      return
    }
    const pedido = crearPedido({
      items: carrito.items.map((x) => ({
        productoId: x.producto.id,
        nombre: x.producto.nombre,
        precio: x.producto.precio,
        cantidad: x.cantidad,
        imagen: x.producto.imagen,
      })),
      total: carrito.total,
      receta: carrito.receta,
      cliente: {
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        notas: form.notas.trim(),
        consent_messaging: form.consentMessaging,
      },
    })
    vaciar()
    cerrarCarro()
    setPaso('carro')
    setForm(INICIAL)
    router.push(`/pedido/${pedido.id}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar el carro"
        onClick={cerrarCarro}
        className="absolute inset-0 bg-tinta/80"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Tu carro"
        className="relative flex h-full w-full max-w-md flex-col border-l border-noche-borde bg-noche"
      >
        <header className="flex items-center justify-between border-b border-noche-borde px-5 py-4">
          <h2 className="rotulo text-xl text-hueso">
            {paso === 'carro' ? 'Tu carro' : 'Tus datos para la ficha'}
          </h2>
          <button
            type="button"
            onClick={cerrarCarro}
            className="text-sm text-bruma transition-colors hover:text-hueso"
          >
            Cerrar
          </button>
        </header>

        {carrito.items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center px-6 text-center">
            <p className="text-lg text-hueso">Todavía no hay nada acá.</p>
            <p className="mt-2 text-sm leading-relaxed text-bruma">
              Elige un sabor arriba y agrega el pack que arme el bartender, o suma botellas sueltas desde la
              bodega.
            </p>
          </div>
        ) : paso === 'carro' ? (
          <ListaCarro />
        ) : (
          <FormularioEntrega form={form} setForm={setForm} />
        )}

        {carrito.items.length > 0 ? (
          <footer className="border-t border-noche-borde px-5 py-4">
            {carrito.receta ? (
              <p className="mb-3 text-sm text-bruma">
                Pack armado para {carrito.receta.nombre.toLowerCase()}.
              </p>
            ) : null}
            <div className="flex items-baseline justify-between border-t border-noche-borde pt-3">
              <span className="rotulo text-lg text-hueso">Total a pagar en el mesón</span>
              <span className="numero text-2xl text-lima">{clp(carrito.total)}</span>
            </div>

            {error ? <p className="mt-3 text-sm text-vino">{error}</p> : null}

            {paso === 'carro' ? (
              <Boton
                variante="lima"
                tamano="grande"
                className="mt-4 w-full"
                onClick={() => {
                  setError(null)
                  setPaso('datos')
                }}
              >
                Continuar
              </Boton>
            ) : (
              <div className="mt-4 flex gap-3">
                <Boton variante="contorno" onClick={() => setPaso('carro')}>
                  Volver
                </Boton>
                <Boton variante="lima" className="flex-1" onClick={enviar}>
                  Generar mi ficha de mesón
                </Boton>
              </div>
            )}
          </footer>
        ) : null}
      </aside>
    </div>
  )
}

function ListaCarro() {
  const { items } = useCarrito()
  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      <ul className="divide-y divide-noche-borde">
        {items.map(({ producto, cantidad }) => (
          <li key={producto.id} className="flex items-start gap-3 py-4">
            <ImagenProducto src={producto.imagen} alt={producto.nombre} lado={52} />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-hueso">{producto.nombre}</p>
              <p className="mt-0.5 text-xs text-bruma">
                {[producto.formato, clp(producto.precio)].filter(Boolean).join(' / ')}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(producto.id, cantidad - 1)}
                  aria-label={`Quitar una unidad de ${producto.nombre}`}
                  className="border border-noche-borde px-2 text-bruma transition-colors hover:text-lima"
                >
                  −
                </button>
                <span className="numero w-6 text-center text-sm text-hueso">{cantidad}</span>
                <button
                  type="button"
                  onClick={() => cambiarCantidad(producto.id, cantidad + 1)}
                  aria-label={`Sumar una unidad de ${producto.nombre}`}
                  className="border border-noche-borde px-2 text-bruma transition-colors hover:text-lima"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => quitar(producto.id)}
                  className="ml-2 text-xs text-bruma underline underline-offset-4 transition-colors hover:text-lima"
                >
                  Quitar
                </button>
              </div>
            </div>
            <p className="numero text-sm text-lima">{clp(producto.precio * cantidad)}</p>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={vaciar}
        className="mt-4 text-xs text-bruma underline underline-offset-4 transition-colors hover:text-lima"
      >
        Vaciar el carro
      </button>
    </div>
  )
}

function FormularioEntrega({
  form,
  setForm,
}: {
  form: Formulario
  setForm: (f: Formulario) => void
}) {
  const campo =
    'mt-1 w-full border border-noche-borde bg-noche-alto px-3 py-2.5 text-base text-hueso placeholder:text-bruma/60'

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4">
      <label className="block text-sm text-bruma">
        Nombre
        <input
          className={campo}
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Cómo te llama el dependiente"
          autoComplete="name"
        />
      </label>

      <label className="mt-4 block text-sm text-bruma">
        Teléfono
        <input
          className={campo}
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          placeholder="+56 9 ..."
          inputMode="tel"
          autoComplete="tel"
        />
      </label>

      <label className="mt-4 block text-sm text-bruma">
        Algo que deba saber el local
        <textarea
          className={campo}
          rows={2}
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          placeholder="Paso como a las 21:00, voy con otra persona a retirar, etc."
        />
      </label>

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 accent-cyan"
          checked={form.mayor}
          onChange={(e) => setForm({ ...form, mayor: e.target.checked })}
        />
        <span className="text-sm leading-relaxed text-bruma">
          Confirmo que soy mayor de 18 años. El dependiente puede pedir carnet al entregar.
        </span>
      </label>

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 accent-cyan"
          checked={form.consentMessaging}
          onChange={(e) => setForm({ ...form, consentMessaging: e.target.checked })}
        />
        <span className="text-sm leading-relaxed text-bruma">
          Acepto recibir recordatorios de promos y recetas por WhatsApp o SMS.
        </span>
      </label>

      <p className="mt-5 text-xs leading-relaxed text-bruma">
        Esta es una demostración: no se cobra nada y no se envía ningún dato a Edrink. El combo se paga en el
        mesón al retirarlo.
      </p>
    </div>
  )
}
