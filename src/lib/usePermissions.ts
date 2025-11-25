"use client";

import { useUserScope } from "@/hooks/useUserScope";

export function usePermissions() {
  const { scope, loadingScope } = useUserScope();

  if (loadingScope) return { loading: true };
  if (!scope) return { loading: false, allowed: false };

  const nivel = scope.nivel;
  const rol = scope.rol;

  const isRoot = rol === "root";
  const isAdmin = rol === "admin";
  const isOperativo = rol === "operativo";

  // ---------------------------
  // CREACIÓN DE USUARIOS
  // ---------------------------

  function canCreate(targetNivel: string) {
    if (isRoot) return true;

    switch (nivel) {
      case "dl":
        // DL admin/operativo → crear sector | zona
        if (isAdmin || isOperativo) {
          return targetNivel === "sector" || targetNivel === "zona";
        }
        return false;

      case "zona":
        // Zona admin/operativo crea seccional | comité | integrante | promotor
        if (isAdmin || isOperativo) {
          return (
            targetNivel === "seccional" ||
            targetNivel === "comite" ||
            targetNivel === "integrante" ||
            targetNivel === "promotor"
          );
        }
        return false;

      case "seccional":
        // Seccional admin solo si tú lo permites
        if (isAdmin) {
          return (
            targetNivel === "comite" ||
            targetNivel === "integrante"
          );
        }
        return false;

      case "comite":
        // Comité crea integrantes
        return targetNivel === "integrante";

      case "integrante":
        // Integrante crea promotores
        return targetNivel === "promotor";

      default:
        return false;
    }
  }

  // ---------------------------
  // EDICIÓN
  // ---------------------------
  function canEdit(recordNivel: string) {
    if (isRoot) return true;
    if (isAdmin) return nivel === recordNivel;
    if (isOperativo) return nivel === recordNivel;
    return false;
  }

  // ---------------------------
  // ELIMINACIÓN
  // ---------------------------
  function canDelete(recordNivel: string) {
    if (isRoot) return true;
    if (nivel === recordNivel && isAdmin) return true;
    return false;
  }

  return {
    loading: false,
    scope,

    // funciones
    canCreate,
    canEdit,
    canDelete,

    // atajos comunes
    isRoot,
    isAdmin,
    isOperativo,
  };
}
