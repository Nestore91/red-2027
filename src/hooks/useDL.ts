"use client";

import { supabase } from "@/lib/supabaseClient";
import { useCallback, useEffect, useState } from "react";

export function useDL(id_dl: string) {
  const [dl, setDl] = useState<any>(null);
  const [encargados, setEncargados] = useState<any[]>([]);
  const [sectores, setSectores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id_dl) return;
    setLoading(true);

    const { data: dlData } = await supabase
      .from("dl")
      .select("*")
      .eq("id_dl", id_dl)
      .single();

    const { data: enc } = await supabase
      .from("dl_encargados")
      .select("*")
      .eq("id_dl", id_dl)
      .order("creado_en", { ascending: false });

    const { data: sect } = await supabase
      .from("sectores")
      .select("*, zonas(count), seccionales(count), casillas(count)")
      .eq("id_dl", id_dl)
      .order("clave", { ascending: true });

    setDl(dlData);
    setEncargados(enc || []);
    setSectores(sect || []);
    setLoading(false);
  }, [id_dl]);

  useEffect(() => {
    load();
  }, [load]);

  return { dl, encargados, sectores, loading, refresh: load };
}
