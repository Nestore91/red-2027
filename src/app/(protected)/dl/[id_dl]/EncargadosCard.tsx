"use client";

import { Card } from "@/components/ui/card";
import { Phone, Mail, Trash2, Edit, MapPin } from "lucide-react";

export default function EncargadosCard({
  encargados,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}: {
  encargados: any[];
  onEdit: (enc: any) => void;
  onDelete: (enc: any) => void;
  canEdit: boolean;
  canDelete: boolean;
}) {
  if (!encargados.length) {
    return (
      <p className="text-gray-500 text-center mt-4">
        No hay encargados registrados.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {encargados.map((e) => (
        <Card key={e.id_dl_encargado} className="p-4 rounded-2xl shadow-sm">
          <p className="font-semibold text-base">
            {e.nombre} {e.apellido}
          </p>
          <p className="text-sm text-gray-600">{e.telefono ?? "Sin teléfono"}</p>
          {e.correo && <p className="text-sm text-gray-600">{e.correo}</p>}
          {e.colonia && (
            <p className="text-xs text-gray-500 mt-1">
              {e.calle_numero} · {e.colonia} · CP {e.codigo_postal}
            </p>
          )}

          <div className="flex items-center gap-4 mt-3">
            {e.telefono && (
              <a href={`tel:${e.telefono}`} title="Llamar">
                <Phone className="w-5 h-5 text-blue-600" />
              </a>
            )}
            {e.correo && (
              <a href={`mailto:${e.correo}`} title="Correo">
                <Mail className="w-5 h-5 text-blue-600" />
              </a>
            )}
            {e.lat && e.lon && (
              <a
                href={`https://www.google.com/maps?q=${e.lat},${e.lon}`}
                target="_blank"
                title="Ver mapa"
              >
                <MapPin className="w-5 h-5 text-blue-600" />
              </a>
            )}

            <div className="ml-auto flex items-center gap-3">
              {canEdit && (
                <button onClick={() => onEdit(e)} title="Editar">
                  <Edit className="w-5 h-5 text-green-600" />
                </button>
              )}
              {canDelete && (
                <button onClick={() => onDelete(e)} title="Eliminar">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
