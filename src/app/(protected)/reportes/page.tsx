'use client';
import AppHeader from "@/components/ui/appheader";
import BottomNav from "@/components/ui/bottomnav";
import { Card } from "@/components/ui/card";

export default function ReportesPage() {
  return (
    <>
      <AppHeader />
      <main className="px-4 pb-24">
        <h1 className="app-title mt-2 mb-3">Reportes</h1>

        <Card>
          <p className="app-subtle">Aquí podrás ver métricas y estadísticas.</p>
        </Card>
      </main>
      <BottomNav />
    </>
  );
}
