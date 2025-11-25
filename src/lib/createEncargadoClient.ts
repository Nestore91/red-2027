export async function createEncargadoUniversal(params: {
  nivel: "root" | "dl" | "sector" | "zona" | "seccional";
  payload: any;
  scope: {
    id_dl?: string | null;
    id_sector?: string | null;
    id_zona?: string | null;
    id_seccional?: string | null;
    rol?: any; // root opcional
  };
}) {
  const res = await fetch("/api/admin/create-encargado", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Error creando encargado");
  }

  return json;
}
