'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import L from 'leaflet'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

// 🗺️ Map dynamic imports
const MapContainer = dynamic(() => import('react-leaflet').then((m) => m.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false })

type Integrante = {
  id_integrante: string
  nombre: string
  apellido: string | null
  telefono: string | null
  correo: string | null
  clave_elector: string | null
  ubicacion?: string | null
}

type ComiteInfo = {
  id_casilla: string
  clave_casilla: string
}

export default function IntegrantesPage() {
  const { id_comite } = useParams<{ id_comite: string }>()
  const [integrantes, setIntegrantes] = useState<Integrante[]>([])
  const [comiteInfo, setComiteInfo] = useState<ComiteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [nuevo, setNuevo] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    clave_elector: '',
    ubicacion: '',
  })

  const [position, setPosition] = useState<[number, number] | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const loadData = async () => {
      if (!id_comite) return

      const { data: integ } = await supabase
        .from('comite_integrantes')
        .select('id_integrante, nombre, apellido, telefono, correo, clave_elector, ubicacion')
        .eq('id_comite', id_comite)
        .order('creado_en', { ascending: false })

      setIntegrantes(integ || [])

      const { data: comite } = await supabase
        .from('comites')
        .select('id_casilla, clave_casilla')
        .eq('id_comite', id_comite)
        .maybeSingle()

      setComiteInfo(comite)
      setLoading(false)
    }

    loadData()
  }, [id_comite])

  const onCreate = async () => {
    if (!nuevo.nombre || !nuevo.clave_elector) {
      alert('Completa al menos nombre y clave de elector.')
      return
    }

    if (integrantes.length >= 5) {
      alert('Límite de 5 integrantes por comité alcanzado.')
      return
    }

    const insert = { id_comite, ...nuevo }
    const { error } = await supabase.from('comite_integrantes').insert(insert)

    if (error) {
      alert('No se pudo agregar el integrante.')
      return
    }

    setNuevo({ nombre: '', apellido: '', telefono: '', correo: '', clave_elector: '', ubicacion: '' })
    setPosition(null)
    setOpenCreate(false)

    const { data: nuevos } = await supabase
      .from('comite_integrantes')
      .select('id_integrante, nombre, apellido, telefono, correo, clave_elector, ubicacion')
      .eq('id_comite', id_comite)
      .order('creado_en', { ascending: false })

    setIntegrantes(nuevos || [])
  }

  const handleGeoLocation = () => {
    if (!navigator.geolocation) return alert('Geolocalización no soportada.')

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setPosition([latitude, longitude])
        setNuevo({ ...nuevo, ubicacion: `${latitude},${longitude}` })
      },
      () => alert('No se pudo obtener la ubicación.')
    )
  }

  const handleSearch = async () => {
    if (!search) return

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`
    )
    const data = await res.json()

    if (data.length === 0) return alert('No se encontró la ubicación.')

    const { lat, lon, display_name } = data[0]
    setPosition([parseFloat(lat), parseFloat(lon)])
    setNuevo({ ...nuevo, ubicacion: `${lat},${lon} (${display_name})` })
  }

  if (loading)
    return <main className="flex justify-center items-center min-h-screen text-lg">Cargando...</main>

  return (
    <main className="relative p-6 min-h-screen bg-sky-50 text-gray-900">

      {comiteInfo && (
        <Link href={`/casilla/${comiteInfo.id_casilla}/comite`} className="absolute top-4 left-4 z-10">
          <Button variant="ghost" className="text-sky-700 hover:bg-sky-100 rounded-full px-3 py-2">←</Button>
        </Link>
      )}

      <h1 className="text-2xl font-bold text-center text-sky-700 mb-4">Integrantes del comité</h1>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Listado de integrantes</h2>
        <Button onClick={() => setOpenCreate(true)} disabled={integrantes.length >= 5}>+ Agregar</Button>
      </div>

      {integrantes.length ? (
        <div className="grid gap-3">
          {integrantes.map((i) => (
            <Card key={i.id_integrante} className="border rounded-xl bg-white p-4">
              <p className="font-semibold text-lg">{i.nombre} {i.apellido ?? ''}</p>
              <p className="text-sm">Clave: {i.clave_elector ?? 'Sin registrar'}</p>
              {i.ubicacion && <p className="text-xs text-gray-500">📍 {i.ubicacion}</p>}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-700">No hay integrantes aún.</p>
      )}

      {/* Modal */}
      <Sheet open={openCreate} onOpenChange={setOpenCreate}>
        <SheetContent className="p-6">
          <SheetHeader>
            <SheetTitle>Agregar integrante</SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            <Input placeholder="Nombre" value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
            <Input placeholder="Apellido" value={nuevo.apellido} onChange={(e) => setNuevo({ ...nuevo, apellido: e.target.value })} />
            <Input placeholder="Teléfono" value={nuevo.telefono} onChange={(e) => setNuevo({ ...nuevo, telefono: e.target.value })} />
            <Input placeholder="Correo" value={nuevo.correo} onChange={(e) => setNuevo({ ...nuevo, correo: e.target.value })} />
            <Input placeholder="Clave de elector" value={nuevo.clave_elector} onChange={(e) => setNuevo({ ...nuevo, clave_elector: e.target.value })} />

            <Input placeholder="Buscar dirección..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button onClick={handleSearch} variant="outline">Buscar</Button>
            <Button onClick={handleGeoLocation}>Usar mi ubicación</Button>

            {nuevo.ubicacion && <p className="text-xs text-gray-600">Ubicación seleccionada: {nuevo.ubicacion}</p>}

            <Button onClick={onCreate} className="w-full mt-3">Guardar</Button>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  )
}
