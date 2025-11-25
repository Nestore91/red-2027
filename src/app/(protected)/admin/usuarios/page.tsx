'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import UserModal from '@/components/ui/usermodal'
import { UserPlus, ShieldCheck } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    setLoading(true)

    const { data, error } = await supabase
      .from('user_scope')
      .select(`
        user_id,
        nivel,
        rol,
        id_dl,
        id_sector,
        id_zona,
        id_seccional,
        id_casilla,
        profiles (full_name, phone)
      `)

    if (error) console.error('Error cargando usuarios:', error)
    else setUsuarios(data || [])

    setLoading(false)
  }

  return (
    <div className="p-4 pb-20 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-sky-700 flex items-center gap-2">
          <ShieldCheck size={20} />
          Gestión de Usuarios
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-sky-600 text-white px-3 py-1 rounded-md text-sm hover:bg-sky-700 transition flex items-center gap-1"
        >
          <UserPlus size={16} />
          Nuevo
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 mt-10">Cargando usuarios...</div>
      ) : usuarios.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">No hay usuarios registrados.</div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {usuarios.map((u) => (
            <div key={u.user_id} className="bg-white rounded-2xl shadow-md p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{u.profiles?.full_name || 'Sin nombre'}</p>
                  <p className="text-sm text-gray-500">{u.nivel?.toUpperCase()} · {u.rol}</p>
                </div>
                <span className="text-xs text-sky-600">{u.user_id.slice(0, 8)}...</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <UserModal onClose={() => { setShowModal(false); fetchUsuarios() }} />}
    </div>
  )
}
