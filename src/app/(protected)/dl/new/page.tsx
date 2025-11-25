'use client';
import AppHeader from "@/components/ui/appheader";
import { Card } from "@/components/ui/card";

export default function NewDLPage() {
  return (
    <>
      <AppHeader title="Nuevo DL" />

      <main className="px-4 py-4">
        <Card>
          <p className="app-subtle mb-2">Crear un nuevo Distrito Local</p>

          <input
            placeholder="Clave DL"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3"
          />

          <button className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg w-full">
            Guardar
          </button>
        </Card>
      </main>
    </>
  );
}
