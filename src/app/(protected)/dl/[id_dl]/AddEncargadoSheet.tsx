"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetHeader,
  SheetTitle,
  SheetContent,
} from "@/components/ui/sheet";
import { supabase } from "@/lib/supabaseClient";
import MapPicker from "./MapPicker";
import { createEncargadoUniversal } from "@/lib/createEncargadoClient";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
  id_dl: string;
  userId: string;
  onSaved: () => void;
  editing?: any | null;
};

type FormState = {
  // personales
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;

  // INE
  clave_elector: string;
  curp: string;
  ine_vigente: boolean;
  foto_ine_frente_url: string;
  foto_ine_reverso_url: string;

  // domicilio
  calle_numero: string;
  colonia: string;
  codigo_postal: string;
  municipio: string;
  estado: string;

  // rol de acceso (scope)
  rol: "admin" | "operativo" | "politico" | "consulta" | "candidato";

  observaciones: string;

  lat: number | null;
  lon: number | null;
};

const emptyForm: FormState = {
  nombre: "",
  apellido: "",
  telefono: "",
  correo: "",

  clave_elector: "",
  curp: "",
  ine_vigente: false,
  foto_ine_frente_url: "",
  foto_ine_reverso_url: "",

  calle_numero: "",
  colonia: "",
  codigo_postal: "",
  municipio: "Mazatlán",
  estado: "Sinaloa",

  rol: "admin",

  observaciones: "",

  lat: null,
  lon: null,
};

export default function AddEncargadoSheet({
  open,
  setOpen,
  id_dl,
  userId,
  onSaved,
  editing = null,
}: Props) {
  const [form, setForm] = useState<FormState>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"frente" | "reverso" | null>(null);

  const isEdit = !!editing?.id_dl_encargado;
  const SheetContentAny = SheetContent as any;

  useEffect(() => {
    if (editing) setForm({ ...emptyForm, ...editing });
    else setForm({ ...emptyForm });
  }, [editing, open]);

  const BUCKET_INE = "ine"; // <-- este nombre debe existir

  const uploadINE = async (file: File, side: "frente" | "reverso") => {
    try {
      setUploading(side);
      const ext = file.name.split(".").pop();
      const path = `${id_dl}/${Date.now()}_${side}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET_INE)
        .upload(path, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from(BUCKET_INE).getPublicUrl(path);

      setForm((f) => ({
        ...f,
        [side === "frente" ? "foto_ine_frente_url" : "foto_ine_reverso_url"]:
          data.publicUrl,
      }));
    } catch (e: any) {
      alert("Error subiendo INE: " + e.message);
    } finally {
      setUploading(null);
    }
  };

  const onUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Tu navegador no soporta geolocalización.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({
          ...f,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        }));
      },
      (err) => {
        console.log(err);
        alert("No se pudo obtener tu ubicación. Revisa permisos del navegador.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const save = async () => {
    setSaving(true);

    try {
      if (isEdit) {
        const payloadEdit = { ...form, id_dl, creado_por: userId };

        const { error } = await supabase
          .from("dl_encargados")
          .update(payloadEdit)
          .eq("id_dl_encargado", editing.id_dl_encargado);

        if (error) throw error;

        onSaved();
        setOpen(false);
        return;
      }

      const result = await createEncargadoUniversal({
        nivel: "dl",
        payload: { ...form, creado_por: userId },
        scope: { id_dl, rol: form.rol }, // <-- mandamos rol
      });

      alert(
        `✅ Encargado creado.\n\nUsuario: ${form.correo}\nContraseña temporal: ${result.password}`
      );

      onSaved();
      setOpen(false);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContentAny side="bottom" className="p-4 max-h-[92vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {isEdit ? "Editar encargado del DL" : "Nuevo encargado del DL"}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-3 mt-4">
          <input className="p-2 border rounded" placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />
          <input className="p-2 border rounded" placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
          />
          <input className="p-2 border rounded" placeholder="Teléfono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
          <input className="p-2 border rounded" placeholder="Correo"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
          />

          {/* ROL FUNCIONAL */}
          <select
            className="p-2 border rounded text-sm"
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value as any })}
          >
            <option value="admin">Admin del nivel</option>
            <option value="operativo">Operativo</option>
            <option value="politico">Político</option>
            <option value="consulta">Consulta</option>
            <option value="candidato">Candidato</option>
          </select>

          <input className="p-2 border rounded" placeholder="Clave de elector"
            value={form.clave_elector}
            onChange={(e) => setForm({ ...form, clave_elector: e.target.value.toUpperCase() })}
          />
          <input className="p-2 border rounded" placeholder="CURP"
            value={form.curp}
            onChange={(e) => setForm({ ...form, curp: e.target.value.toUpperCase() })}
          />

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox"
              checked={form.ine_vigente}
              onChange={(e) => setForm({ ...form, ine_vigente: e.target.checked })}
            />
            INE vigente
          </label>

          {/* INE uploads */}
          <div className="space-y-2">
            <label className="text-xs text-gray-600">INE Frente</label>
            <input type="file" accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadINE(e.target.files[0], "frente")}
            />
            {uploading === "frente" && <p className="text-xs text-gray-500">Subiendo frente...</p>}
            {form.foto_ine_frente_url && <img src={form.foto_ine_frente_url} className="w-full rounded-lg border" />}
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-600">INE Reverso</label>
            <input type="file" accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadINE(e.target.files[0], "reverso")}
            />
            {uploading === "reverso" && <p className="text-xs text-gray-500">Subiendo reverso...</p>}
            {form.foto_ine_reverso_url && <img src={form.foto_ine_reverso_url} className="w-full rounded-lg border" />}
          </div>

          {/* Domicilio */}
          <input className="p-2 border rounded" placeholder="Calle y número"
            value={form.calle_numero}
            onChange={(e) => setForm({ ...form, calle_numero: e.target.value })}
          />
          <input className="p-2 border rounded" placeholder="Colonia"
            value={form.colonia}
            onChange={(e) => setForm({ ...form, colonia: e.target.value })}
          />
          <input className="p-2 border rounded" placeholder="Código postal"
            value={form.codigo_postal}
            onChange={(e) => setForm({ ...form, codigo_postal: e.target.value })}
          />

          {/* Mapa */}
          <MapPicker
            lat={form.lat}
            lon={form.lon}
            onChange={(lat, lon) => setForm({ ...form, lat, lon })}
            onUseMyLocation={onUseMyLocation}
          />

          {/* Observaciones */}
          <textarea
            className="p-2 border rounded text-sm min-h-[80px]"
            placeholder="Observaciones"
            value={form.observaciones}
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
          />

          <button
            className="bg-blue-600 text-white p-2.5 rounded mt-3 text-sm font-medium disabled:opacity-60"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </SheetContentAny>
    </Sheet>
  );
}
