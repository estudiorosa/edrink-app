import { Encabezado } from '@/components/Encabezado'
import { FichaMeson } from '@/components/FichaMeson'

export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <>
      <Encabezado />
      <FichaMeson id={id} />
    </>
  )
}
