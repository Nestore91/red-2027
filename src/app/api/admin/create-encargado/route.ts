import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { Resend } from "resend";

type Nivel = "root" | "dl" | "sector" | "zona" | "seccional";
type Rol = "root" | "admin" | "operativo" | "politico" | "consulta";

// Tablas SOLO para niveles que tienen encargados físicos
const TABLE_BY_NIVEL: Record<Exclude<Nivel, "root">, string> = {
  dl: "dl_encargados",
  sector: "sector_encargados",
  zona: "zona_encargados",
  seccional: "seccional_encargados",
};

const PK_BY_NIVEL: Record<Exclude<Nivel, "root">, string> = {
  dl: "id_dl_encargado",
  sector: "id_sector_encargado",
  zona: "id_zona_encargado",
  seccional: "id_seccional_encargado",
};

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const FROM_EMAIL = process.env.FROM_EMAIL || "Red 2027 <no-reply@neoba.mx>";

// password conservando tu estilo
function genPassword(nivel: Nivel) {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `R7-${nivel.toUpperCase()}-${rand}`;
}

// Crea cliente anon server para leer sesión/cookies
function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

// Matriz oficial de creación
function canCreate(creator: { nivel: Nivel; rol: Rol }, targetNivel: Nivel) {
  const { nivel, rol } = creator;

  if (rol === "root" && nivel === "root") return true;
  if (nivel === targetNivel) return false; // nadie crea en su mismo nivel

  // root puede crear todo
  if (nivel === "root") return true;

  // dl admin/operativo -> sector, zona
  if (nivel === "dl" && (rol === "admin" || rol === "operativo")) {
    return targetNivel === "sector" || targetNivel === "zona";
  }

  // sector -> no crea
  if (nivel === "sector") return false;

  // zona admin/operativo -> seccional
  if (nivel === "zona" && (rol === "admin" || rol === "operativo")) {
    return targetNivel === "seccional";
  }

  // seccional no crea (modelo actual)
  if (nivel === "seccional") return false;

  return false;
}

// valida que no se salga del territorio del creador
function validateTerritory(
  creatorScope: any,
  targetNivel: Nivel,
  targetScope: any
) {
  // root no se restringe
  if (creatorScope.nivel === "root") return;

  // Si el creador tiene id_dl, no puede crear fuera de ese DL
  if (creatorScope.id_dl && targetScope.id_dl !== creatorScope.id_dl) {
    throw new Error("No puedes crear fuera de tu DL.");
  }

  if (
    creatorScope.id_sector &&
    targetScope.id_sector !== creatorScope.id_sector
  ) {
    throw new Error("No puedes crear fuera de tu Sector.");
  }

  if (creatorScope.id_zona && targetScope.id_zona !== creatorScope.id_zona) {
    throw new Error("No puedes crear fuera de tu Zona.");
  }

  // extra: si quieres, puedes obligar a que sector/zona/seccional tengan su id obligatorio
  if (targetNivel === "sector" && !targetScope.id_sector) {
    throw new Error("Falta id_sector.");
  }
  if (targetNivel === "zona" && !targetScope.id_zona) {
    throw new Error("Falta id_zona.");
  }
  if (targetNivel === "seccional" && !targetScope.id_seccional) {
    throw new Error("Falta id_seccional.");
  }
}

export async function POST(req: Request) {
  try {
    const supabase = supabaseServer();
    const body = await req.json();

    const { nivel, payload, scope } = body as {
      nivel: Nivel;
      payload: any;
      scope: {
        id_dl?: string | null;
        id_sector?: string | null;
        id_zona?: string | null;
        id_seccional?: string | null;
        rol?: Rol; // solo root
      };
    };

    // ---------- Validación básica ----------
    if (!nivel) {
      return NextResponse.json(
        { error: "Nivel es obligatorio." },
        { status: 400 }
      );
    }

    // ---------- Leer sesión real ----------
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr || !authData.user) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    const creatorId = authData.user.id;

    // ---------- Leer scope del creador ----------
    const { data: creatorScope, error: csErr } = await supabase
      .from("user_scope")
      .select("*")
      .eq("user_id", creatorId)
      .single();

    if (csErr || !creatorScope) {
      return NextResponse.json(
        { error: "Scope del creador no encontrado." },
        { status: 403 }
      );
    }

    const creator = {
      nivel: creatorScope.nivel as Nivel,
      rol: creatorScope.rol as Rol,
    };

    // ---------- Validar permisos ----------
    if (!canCreate(creator, nivel)) {
      return NextResponse.json(
        { error: "No tienes permiso para crear ese nivel." },
        { status: 403 }
      );
    }

    const email = payload?.correo?.trim()?.toLowerCase();
    if (!email) {
      return NextResponse.json(
        { error: "Correo es obligatorio." },
        { status: 400 }
      );
    }

    // ---------- Definir rol FINAL del nuevo usuario ----------
    let finalRol: Rol = "operativo"; // regla: si no es root → operativo siempre

    if (creator.rol === "root" && creator.nivel === "root") {
      finalRol = (payload?.rol as Rol) || scope?.rol || "admin";
    }

    // ---------- Territory final ----------
    const finalScope = {
      id_dl: scope?.id_dl ?? creatorScope.id_dl ?? null,
      id_sector: scope?.id_sector ?? creatorScope.id_sector ?? null,
      id_zona: scope?.id_zona ?? creatorScope.id_zona ?? null,
      id_seccional: scope?.id_seccional ?? null,
      id_casilla: null,
    };

    validateTerritory(creatorScope, nivel, finalScope);

    // ---------- Crear usuario auth ----------
    const password = genPassword(nivel);

    const { data: userCreated, error: userErr } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          nombre: payload.nombre ?? "",
          apellido: payload.apellido ?? "",
          nivel,
          rol: finalRol,
        },
      });

    if (userErr || !userCreated.user) {
      return NextResponse.json(
        { error: userErr?.message || "No se pudo crear usuario." },
        { status: 400 }
      );
    }

    const newUserId = userCreated.user.id;

    // ---------- Insertar encargado si aplica ----------
    let encRow: any = null;

    if (nivel !== "root") {
      const table = TABLE_BY_NIVEL[nivel];
      const encargadoInsert = {
        ...payload,
        user_id: newUserId, // 🔥 amarre auth ↔ encargado
        creado_por: creatorId,

        ...(nivel === "dl" && { id_dl: finalScope.id_dl }),
        ...(nivel === "sector" && { id_sector: finalScope.id_sector }),
        ...(nivel === "zona" && { id_zona: finalScope.id_zona }),
        ...(nivel === "seccional" && {
          id_seccional: finalScope.id_seccional,
          id_casilla: payload.id_casilla ?? null,
        }),
      };

      const { data, error: encErr } = await supabaseAdmin
        .from(table)
        .insert([encargadoInsert])
        .select("*")
        .single();

      if (encErr) {
        await supabaseAdmin.auth.admin.deleteUser(newUserId);
        return NextResponse.json(
          { error: encErr.message },
          { status: 400 }
        );
      }

      encRow = data;
    }

    // ---------- Insertar user_scope ----------
    const scopeInsert = {
      user_id: newUserId,
      nivel,
      rol: finalRol,
      ...finalScope,
    };

    const { error: scopeErr } = await supabaseAdmin
      .from("user_scope")
      .insert([scopeInsert]);

    if (scopeErr) {
      await supabaseAdmin.auth.admin.deleteUser(newUserId);

      if (nivel !== "root") {
        const table = TABLE_BY_NIVEL[nivel];
        const pk = PK_BY_NIVEL[nivel];
        await supabaseAdmin.from(table).delete().eq(pk, encRow[pk]);
      }

      return NextResponse.json(
        { error: scopeErr.message },
        { status: 400 }
      );
    }

    // ---------- Enviar correo ----------
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Acceso a Red 2027",
        html: `
          <div style="font-family:Arial,sans-serif;font-size:14px;">
            <h2>Bienvenido a Red 2027</h2>
            <p>Tu acceso ha sido creado.</p>
            <p><b>Usuario:</b> ${email}</p>
            <p><b>Contraseña temporal:</b> ${password}</p>
            <p><b>Nivel:</b> ${nivel}</p>
            <p><b>Rol:</b> ${finalRol}</p>
            <p>Entra aquí:</p>
            <p><a href="${APP_URL}/login">${APP_URL}/login</a></p>
            <p>Te recomendamos cambiar tu contraseña en tu primer ingreso.</p>
            <hr/>
            <p style="font-size:12px;color:#666;">NEOBA · Red 2027</p>
          </div>
        `,
      });
    } catch (mailErr: any) {
      console.error("❌ Error enviando correo:", mailErr?.message);
    }

    // ---------- Respuesta final ----------
    return NextResponse.json({
      ok: true,
      user_id: newUserId,
      password,
      encargado: encRow,
      scope: scopeInsert,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Error inesperado." },
      { status: 500 }
    );
  }
}
