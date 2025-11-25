"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DLHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dl/lista");
  }, [router]);

  return (
    <div className="p-4 text-sm text-gray-500">
      Cargando...
    </div>
  );
}
