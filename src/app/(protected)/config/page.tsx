"use client";

import { useEffect, useState } from "react";
import AppHeader from "@/components/ui/appheader";
import BottomNav from "@/components/ui/bottomnav";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface UserInfo {
  email: string | null;
}

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser({ email: data.user?.email ?? null });
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <>
      <AppHeader title="Perfil" />
      <main className="px-4 pb-24 mt-3 space-y-4">
        <h1 className="text-lg font-semibold">Perfil de usuario</h1>

        <Card>
          {loading ? (
            <p className="text-sm text-gray-500">Cargando datos...</p>
          ) : (
            <>
              <p className="text-sm text-gray-700">
                Correo de acceso:
              </p>
              <p className="text-sm font-semibold mt-1">
                {user?.email ?? "—"}
              </p>
              <p className="text-[11px] text-gray-500 mt-3">
                Más adelante aquí podremos mostrar el rol, el nivel de estructura
                (DL, sector, zona, etc.) y opciones adicionales.
              </p>
            </>
          )}
        </Card>

        <Card className="mt-2">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500 text-white text-sm font-medium py-2.5 active:scale-[0.98] transition"
          >
            Cerrar sesión
          </button>
        </Card>
      </main>

      <BottomNav />
    </>
  );
}
