"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useUserScope } from "@/hooks/useUserScope";
import { useDL } from "@/hooks/useDL";
import DlHeader from "./DlHeader";
import DlStats from "./DlStats";
import EncargadosCard from "./EncargadosCard";
import AddEncargadoSheet from "./AddEncargadoSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function DlPage() {
  const params = useParams();
  const id_dl = params.id_dl as string;

  const { scope, userId, loadingScope } = useUserScope();
  const { dl, encargados, sectores, loading, refresh } = useDL(id_dl);

  const [openAdd, setOpenAdd] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  if (loading || loadingScope) {
    return <div className="p-4 text-gray-500">Cargando DL...</div>;
  }
  if (!dl) {
    return <div className="p-4 text-gray-500">No se encontró el DL.</div>;
  }

  // PERMISOS (según tu regla oficial final)
  const canAddEncargado =
    scope?.nivel === "root" ||
    (scope?.nivel === "dl" && ["admin", "operativo"].includes(scope.rol));

  const canEditEncargado =
    scope?.nivel === "root" ||
    (scope?.nivel === "dl" && scope.rol === "admin");

  const canDeleteEncargado = scope?.nivel === "root";

  const onDelete = async (enc: any) => {
    if (!confirm("¿Eliminar encargado?")) return;
    const { error } = await supabase
      .from("dl_encargados")
      .delete()
      .eq("id_dl_encargado", enc.id_dl_encargado);
    if (error) return alert(error.message);
    refresh();
  };

  return (
    <div className="p-4 pb-24">
      <DlHeader dl={dl} />
      <DlStats sectores={sectores} />

      {/* Encargados */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Encargados del DL</h2>
        {canAddEncargado && (
          <Button
            onClick={() => {
              setEditing(null);
              setOpenAdd(true);
            }}
          >
            + Agregar
          </Button>
        )}
      </div>

      <EncargadosCard
        encargados={encargados}
        canEdit={!!canEditEncargado}
        canDelete={!!canDeleteEncargado}
        onEdit={(enc) => {
          setEditing(enc);
          setOpenAdd(true);
        }}
        onDelete={onDelete}
      />

      {/* Sectores */}
      <h2 className="text-lg font-bold mt-8 mb-2">Sectores</h2>
      <div className="space-y-3">
        {sectores.map((s: any) => (
          <Card key={s.id_sector} className="p-4 rounded-2xl">
            <p className="font-semibold">Sector {s.clave}</p>
            <p className="text-sm text-gray-600">{s.nombre}</p>
            <div className="mt-2 text-xs text-gray-500 flex gap-3">
              <span>Zonas: {s.zonas?.count ?? 0}</span>
              <span>Seccionales: {s.seccionales?.count ?? 0}</span>
              <span>Casillas: {s.casillas?.count ?? 0}</span>
            </div>
            <a
              href={`/sectores/${s.id_sector}`}
              className="text-blue-600 text-sm mt-2 inline-block"
            >
              Ver detalle →
            </a>
          </Card>
        ))}
      </div>

      {/* Sheet */}
      {userId && (
        <AddEncargadoSheet
          open={openAdd}
          setOpen={setOpenAdd}
          id_dl={id_dl}
          userId={userId}
          editing={editing}
          onSaved={refresh}
        />
      )}
    </div>
  );
}
