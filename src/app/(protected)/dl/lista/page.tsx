"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type DLRow = {
  id_dl: string;
  clave: string;
  nombre: string;
  activo: boolean | null;
};

type ScopeRow = {
  user_id: string;
  nivel: "root" | "dl" | "sector" | "zona" | "seccional" | "casilla";
  rol: "root" | "admin" | "operativo" | "politico" | "consulta";
  id_dl: string | null;
  id_sector: string | null;
  id_zona: string | null;
  id_seccional: string | null;
  id_casilla: string | null;
};

export default function DLListaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dls, setDls] = useState<DLRow[]>([]);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      // 1) mi scope
      const { data: scope, error: scopeErr } = await supabase
        .from("user_scope")
        .select("*")
        .single<ScopeRow>();

      if (scopeErr || !scope) {
        setError("No se pudo leer user_scope.");
        setLoading(false);
        return;
      }

      // 2) segun nivel, cargamos DL
      let q = supabase.from("dl").select("id_dl, clave, nombre, activo");

      if (scope.nivel === "root") {
        // root ve todo (RLS lo permite)
      } else if (scope.id_dl) {
        // cualquier nivel ligado a un DL ve solo ese DL
        q = q.eq("id_dl", scope.id_dl);
      } else {
        // sector/zona/etc sin id_dl explícito:
        // buscamos el DL por jerarquia si existe en tablas padres
        // (por ahora no bloqueamos, solo dejamos vacío)
        q = q.limit(0);
      }

      const { data: dlData, error: dlErr } = await q
        .order("clave", { ascending: true });

      if (dlErr) {
        setError(dlErr.message);
        setLoading(false);
        return;
      }

      setDls(dlData ?? []);
      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Cargando DL...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-600">
        Error: {error}
      </div>
    );
  }

  if (!dls.length) {
    return (
      <div className="p-4 text-sm text-gray-600">
        No se encontró ningún DL para tu usuario.
      </div>
    );
  }

  return (
    <div className="p-3 space-y-3">
      <header className="px-1 pt-2">
        <h1 className="text-lg font-semibold">Distritos Locales</h1>
        <p className="text-xs text-gray-500">
          Selecciona un DL para ver su estructura.
        </p>
      </header>

      <div className="space-y-2">
        {dls.map((dl) => (
          <Card
            key={dl.id_dl}
            className="p-4 flex items-center justify-between active:scale-[0.99] transition"
            onClick={() => router.push(`/dl/${dl.id_dl}`)}
          >
            <div>
              <p className="text-xs text-gray-500">DL {dl.clave}</p>
              <p className="text-sm font-medium">{dl.nombre}</p>
              <p className="text-[11px] mt-1">
                {dl.activo ? (
                  <span className="text-emerald-600">Activo</span>
                ) : (
                  <span className="text-gray-400">Inactivo</span>
                )}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/dl/${dl.id_dl}`);
              }}
            >
              Entrar
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
