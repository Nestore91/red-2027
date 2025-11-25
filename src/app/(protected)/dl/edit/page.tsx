'use client';
import { useParams } from "next/navigation";
import AppHeader from "@/components/ui/appheader";
import { Card } from "@/components/ui/card";

export default function EditDLPage() {
  const { id_dl } = useParams();

  return (
    <>
      <AppHeader title={`Editar DL ${id_dl}`} />

      <main className="px-4 py-4">
        <Card>
          <p className="app-subtle mb-2">Modificar datos del DL</p>

          <input
            placeholder="Clave DL"
            className="border border-gray-300 rounded-lg px-3 py-2 w-full mb-3"
          />

          <button className="bg-[var(--color-primary)] text-white px-3 py-2 rounded-lg w-full">
            Guardar cambios
          </button>
        </Card>
      </main>
    </>
  );
}
