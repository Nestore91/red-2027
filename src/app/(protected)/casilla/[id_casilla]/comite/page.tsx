'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function ComitePage() {
  const { id_casilla } = useParams<{ id_casilla: string }>()

  return (
    <main className="min-h-screen p-6 bg-sky-50 text-gray-900">

      {/* 🔙 Regresar a la casilla */}
      <Link href={`/casillas`} className="inline-block mb-4">
        <Button variant="ghost" className="rounded-full px-3 py-2 text-sky-700 hover:bg-sky-100">
          ← Regresar
        </Button>
      </Link>

      <h1 className="text-2xl font-bold text-sky-700 mb-6 text-center">
        Comité de la Casilla
      </h1>

      <div className="bg-white shadow rounded-xl p-6 text-center border">
        <p className="text-lg font-semibold">
          ID de la casilla:
        </p>

        <p className="text-gray-700 mt-1">{id_casilla}</p>

        <p className="mt-4 text-gray-600">
          Esta pantalla será usada más adelante para mostrar la información del comité,
          agregar integrantes y ver estadísticas.
        </p>

        <p className="mt-2 text-gray-500 text-sm">
          (Placeholder temporal)
        </p>

        <Link href={`/comite/${id_casilla}/integrantes`}>
          <Button className="mt-6 rounded-2xl w-full">
            Ir a Integrantes →
          </Button>
        </Link>
      </div>
    </main>
  )
}
