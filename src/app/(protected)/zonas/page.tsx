'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

type ZonaResumen = {
  id_zona: string;
  clave: string | null;
  nombre: string | null;
  encargado: string | null;
  seccionales_count: number;
  casillas_count: number;
};

export default function ZonasPage() {
  const [zonas, setZonas] = useState<ZonaResumen[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase.rpc('get_zonas_resumen');
      if (error) {
        console.error('🟥 Error RPC get_zonas_resumen:', error.message);
      }
      setZonas(data ?? []);
      setLoading(false);
      console.log('✅ Zonas cargadas:', data);
    };
    load();
  }, []);

  if (loading) {
    return <main className="p-6">Cargando zonas…</main>;
  }

  return (
    <main className="p-6 pb-24 min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-50">
      <h1 className="text-2xl font-bold mb-4">Zonas registradas</h1>

      {zonas.length === 0 ? (
        <p>No hay zonas disponibles.</p>
      ) : (
        <ul className="grid gap-3">
          {zonas.map((z) => (
            <li key={z.id_zona} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
              <Link href={`/zonas/${z.id_zona}`} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {z.nombre ?? `Zona ${z.clave ?? ''}`}
                  </p>
                  <p className="text-sm text-gray-500">Encargado: {z.encargado ?? 'Sin asignar'}</p>
                  <p className="text-xs text-gray-400">
                    Seccionales: {z.seccionales_count} · Casillas: {z.casillas_count}
                  </p>
                </div>
                <span className="text-gray-400">{'>'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

