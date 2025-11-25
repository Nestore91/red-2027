"use client";

import AppHeader from "@/components/ui/appheader";
import BottomNav from "@/components/ui/bottomnav";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      <AppHeader title="Red 2027" />

      <main className="px-4 pb-24 mt-3 space-y-4">
        <h1 className="text-lg font-semibold">Inicio</h1>

        <Card className="mb-2">
          <p className="text-sm text-gray-700">
            Bienvenido a{" "}
            <span className="font-semibold text-[var(--color-primary)]">
              Red 2027
            </span>
            .
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Usa las tarjetas para navegar entre la estructura territorial, el
            mapa y tu perfil.
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className="hover:shadow-md"
            onClick={() => router.push("/dl")}
          >
            <p className="text-gray-600 text-sm">Estructura</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Distritos, sectores, zonas, seccionales, casillas y comités.
            </p>
          </Card>

          <Card
            className="hover:shadow-md"
            onClick={() => router.push("/mapa")}
          >
            <p className="text-gray-600 text-sm">Mapa</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Visualiza la estructura sobre el territorio.
            </p>
          </Card>

          <Card
            className="hover:shadow-md"
            onClick={() => router.push("/config")}
          >
            <p className="text-gray-600 text-sm">Perfil</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Datos de acceso y configuración del usuario.
            </p>
          </Card>

          <Card
            className="hover:shadow-md"
            onClick={() => router.push("/equipo")}
          >
            <p className="text-gray-600 text-sm">Equipo</p>
            <p className="text-[11px] text-gray-500 mt-1">
              (Más adelante) verás aquí encargados e integrantes.
            </p>
          </Card>
        </div>
      </main>

      <BottomNav />
    </>
  );
}
