'use client'

// Estado de las fichas de mesón. Vive en el navegador: localStorage guarda, BroadcastChannel
// avisa a las otras pestañas. Así el panel de la botillería ve la ficha apenas se genera, sin
// servidor. No hay despacho: cada ficha espera a que el cliente la muestre en el mesón.
import { useSyncExternalStore } from 'react'
import { BOTILLERIAS } from './botillerias'

export type EstadoPedido = 'pendiente' | 'canjeado' | 'cancelado'

export type ItemPedido = {
  productoId: number
  nombre: string
  precio: number
  cantidad: number
  imagen: string | null
}

export type Evento = { en: number; texto: string }

export type Cliente = {
  nombre: string
  telefono: string
  notas: string
  /** Opt-in voluntario, desmarcado por defecto: recordatorios de promos/recetas por WhatsApp o SMS. */
  consent_messaging: boolean
}

export type Pedido = {
  id: string
  creadoEn: number
  estado: EstadoPedido
  items: ItemPedido[]
  total: number
  receta: { id: string; nombre: string } | null
  cliente: Cliente
  canjeadoEn: number | null
  eventos: Evento[]
}

const CLAVE = 'edrink.pedidos.v1'
const CANAL = 'edrink.pedidos'

const VACIO: Pedido[] = []
let cache: Pedido[] = VACIO
let cargado = false
let canal: BroadcastChannel | null = null
const oyentes = new Set<() => void>()

function hayNavegador(): boolean {
  return typeof window !== 'undefined'
}

function leerDisco(): Pedido[] {
  if (!hayNavegador()) return VACIO
  try {
    const bruto = window.localStorage.getItem(CLAVE)
    if (!bruto) return VACIO
    const datos = JSON.parse(bruto)
    return Array.isArray(datos) ? (datos as Pedido[]) : VACIO
  } catch {
    return VACIO
  }
}

function notificar() {
  for (const fn of oyentes) fn()
}

function guardar(lista: Pedido[], avisarOtras = true) {
  cache = lista
  if (hayNavegador()) {
    try {
      window.localStorage.setItem(CLAVE, JSON.stringify(lista))
    } catch {
      // Modo privado o cuota llena: la sesión sigue funcionando en memoria.
    }
    if (avisarOtras) canal?.postMessage('cambio')
  }
  notificar()
}

function recargar() {
  cache = leerDisco()
  notificar()
}

function iniciar() {
  if (cargado || !hayNavegador()) return
  cargado = true
  cache = leerDisco()
  try {
    canal = new BroadcastChannel(CANAL)
    canal.onmessage = () => recargar()
  } catch {
    canal = null
  }
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE) recargar()
  })
}

function suscribir(fn: () => void): () => void {
  iniciar()
  oyentes.add(fn)
  return () => {
    oyentes.delete(fn)
  }
}

const snapshotServidor = () => VACIO
const snapshot = () => cache

export function usePedidos(): Pedido[] {
  return useSyncExternalStore(suscribir, snapshot, snapshotServidor)
}

export function usePedido(id: string): Pedido | undefined {
  const pedidos = usePedidos()
  return pedidos.find((p) => p.id === id)
}

function mutar(id: string, fn: (p: Pedido) => Pedido | null) {
  const lista = leerDisco()
  const i = lista.findIndex((p) => p.id === id)
  if (i === -1) return
  const nuevo = fn(lista[i])
  if (!nuevo) return
  const copia = [...lista]
  copia[i] = nuevo
  guardar(copia)
}

function conEvento(p: Pedido, en: number, texto: string): Pedido {
  return { ...p, eventos: [...p.eventos, { en, texto }] }
}

export function crearPedido(datos: {
  items: ItemPedido[]
  total: number
  receta: { id: string; nombre: string } | null
  cliente: Cliente
}): Pedido {
  iniciar()
  const ahora = Date.now()
  const id = `FM-${String(ahora).slice(-6)}`
  const pedido: Pedido = {
    id,
    creadoEn: ahora,
    estado: 'pendiente',
    items: datos.items,
    total: datos.total,
    receta: datos.receta,
    cliente: datos.cliente,
    canjeadoEn: null,
    eventos: [{ en: ahora, texto: `Ficha generada para ${BOTILLERIAS[0].nombre}` }],
  }
  guardar([pedido, ...leerDisco()])
  return pedido
}

/** El botillero marca la ficha como canjeada cuando el cliente la muestra en el mesón. */
export function canjearPedido(pedidoId: string) {
  mutar(pedidoId, (p) => {
    if (p.estado !== 'pendiente') return null
    const ahora = Date.now()
    return conEvento({ ...p, estado: 'canjeado', canjeadoEn: ahora }, ahora, 'Canjeada en el mesón')
  })
}

export function cancelarPedido(pedidoId: string) {
  mutar(pedidoId, (p) => {
    if (p.estado !== 'pendiente') return null
    return conEvento({ ...p, estado: 'cancelado' }, Date.now(), 'El cliente canceló')
  })
}

export function borrarTodo() {
  guardar([])
}

export function pendientes(pedidos: Pedido[]): Pedido[] {
  return pedidos.filter((p) => p.estado === 'pendiente')
}
