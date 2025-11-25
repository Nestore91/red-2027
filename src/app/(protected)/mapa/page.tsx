"use client";

import AppHeader from "@/components/ui/appheader";
import BottomNav from "@/components/ui/bottomnav";
import { Card } from "@/components/ui/card";

export default function MapaPage() {
  return (
    <>
      <AppHeader title="Mapa" />
      <main className="px-4 pb-24 mt-3 space-y-4">
        <h1 className="text-lg font-semibold">Mapa territorial</h1>

        <Card>
          <p className="text-sm text-gray-700">
            Aquí visualizarás la estructura (DL, sectores, zonas, seccionales y
            casillas) sobre el territorio.
          </p>
          <p className="text-[11px] text-gray-500 mt-2">
            En el siguiente bloque conectaremos este módulo con tus capas
            geográficas y la base de datos en Supabase.
          </p>
        </Card>

        <Card className="mt-2">
          <div className="h-64 rounded-lg bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-500">
            Aquí irá el mapa interactivo (Leaflet / capas).
          </div>
        </Card>
      </main>

      <BottomNav />
    </>
  );
}
