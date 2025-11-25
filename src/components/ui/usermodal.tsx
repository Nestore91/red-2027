'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { XCircle } from 'lucide-react'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!  // ⚠️ SERVICE KEY necesaria (solo root)
)

export default function UserModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    nivel: 'dl',
    rol: 'operativo',
    id_dl: '',
    id_sector: '',
    id_zona: '',
    id_seccional: '',
    id_casilla: '',
  })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg('')

    // 1️⃣ Crear usuario en Supabase Auth
    const { data: newUser, error: authError } = await supabase.auth.admin.createUser({
      email: form.email,
      password: form.password,
      email_confirm: true,
      user_metadata: { full_name: form.full_name },
    })

    if (authError) {
      setMsg('❌ Error creando usuario: ' + authError.message)
      setSaving(false)
      return
    }

    // 2️⃣ Insertar en user_scope
    const { error: scopeError } = await supabase.from('user_scope').insert([
      {
        user_id: newUser.user?.id,
        nivel: form.nivel,
        rol: form.rol,
        id_dl: form.id_dl || null,
        id_sector: form.id_sector || null,
        id_zona: form.id_zona || null,
        id_seccional: form.id_seccional || null,
        id_casilla: form.id_casilla || null,
      },
    ])

    if (scopeError) {
      setMsg('⚠️ Usuario creado pero error al asignar nivel: ' + scopeError.message)
    } else {
      setMsg('✅ Usuario creado exitosamente.')
    }

    setSaving(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-sky-700">Nuevo Usuario</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500">
            <XCircle size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Nombre completo"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded p-2"
            required
          />

          <div className="flex gap-2">
            <select
              value={form.nivel}
              onChange={(e) => setForm({ ...form, nivel: e.target.value })}
              className="flex-1 border rounded p-2"
            >
              <option value="dl">DL</option>
              <option value="sector">Sector</option>
              <option value="zona">Zona</option>
              <option value="seccional">Seccional</option>
              <option value="casilla">Casilla</option>
            </select>

            <select
              value={form.rol}
              onChange={(e) => setForm({ ...form, rol: e.target.value })}
              className="flex-1 border rounded p-2"
            >
              <option value="operativo">Operativo</option>
              <option value="admin">Administrador</option>
              <option value="politico">Político</option>
              <option value="consulta">Consulta</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="ID territorial (id_dl, id_sector, etc.)"
            value={form.id_dl}
            onChange={(e) => setForm({ ...form, id_dl: e.target.value })}
            className="w-full border rounded p-2 text-sm"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded transition"
          >
            {saving ? 'Guardando...' : 'Crear usuario'}
          </button>
        </form>

        {msg && <p className="mt-3 text-center text-sm text-gray-700">{msg}</p>}
      </div>
    </div>
  )
}
