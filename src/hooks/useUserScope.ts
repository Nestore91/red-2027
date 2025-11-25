"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUserScope() {
  const [scope, setScope] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loadingScope, setLoadingScope] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user ?? null;

      if (!mounted) return;

      if (!user) {
        setLoadingScope(false);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("user_scope")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!mounted) return;

      if (error) {
        console.error("❌ Error user_scope:", error);
        setScope(null);
      } else {
        setScope(data);
      }

      setLoadingScope(false);
    };

    load();
    return () => { mounted = false };
  }, []);

  return { scope, userId, loadingScope };
}
