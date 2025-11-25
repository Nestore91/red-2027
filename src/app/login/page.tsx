"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/");
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Escribe tu correo para enviar el enlace de recuperación.");
      return;
    }
    setError("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });
    if (error) {
      setError(error.message);
    } else {
      setError(
        "Te enviamos un correo con el enlace para restablecer tu contraseña."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      {/* Header tipo AppSheet */}
      <header className="px-4 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 rounded-full bg-[var(--color-primary)]" />
          <div>
            <p className="text-sm text-gray-500">Bienvenido a</p>
            <h1 className="text-lg font-semibold">Red 2027</h1>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500 max-w-xs">
          Inicia sesión para entrar a tu estructura territorial y navegar entre
          distritos, sectores y zonas.
        </p>
      </header>

      {/* Contenido centrado */}
      <main className="flex-1 px-4 pb-8 flex flex-col">
        <div className="flex-1 flex items-start">
          <Card className="w-full mt-2">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium py-2.5 active:scale-[0.98] transition disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full text-xs text-[var(--color-primary)] mt-1 text-center"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </Card>
        </div>

        <p className="mt-4 text-[10px] text-center text-gray-400">
          Red 2027 · Acceso restringido · NEOBA
        </p>
      </main>
    </div>
  );
}
