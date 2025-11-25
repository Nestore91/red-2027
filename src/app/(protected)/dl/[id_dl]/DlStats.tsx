import { Card } from "@/components/ui/card";

export default function DlStats({ sectores }: { sectores: any[] }) {
  const totalZonas = sectores.reduce((acc, s) => acc + (s.zonas?.count ?? 0), 0);
  const totalSeccionales = sectores.reduce((acc, s) => acc + (s.seccionales?.count ?? 0), 0);
  const totalCasillas = sectores.reduce((acc, s) => acc + (s.casillas?.count ?? 0), 0);

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <Card className="p-4 text-center rounded-2xl">
        <p className="text-2xl font-bold">{sectores.length}</p>
        <p className="text-xs text-gray-500">Sectores</p>
      </Card>
      <Card className="p-4 text-center rounded-2xl">
        <p className="text-2xl font-bold">{totalZonas}</p>
        <p className="text-xs text-gray-500">Zonas</p>
      </Card>
      <Card className="p-4 text-center rounded-2xl">
        <p className="text-2xl font-bold">{totalSeccionales}</p>
        <p className="text-xs text-gray-500">Seccionales</p>
      </Card>
      <Card className="p-4 text-center rounded-2xl">
        <p className="text-2xl font-bold">{totalCasillas}</p>
        <p className="text-xs text-gray-500">Casillas</p>
      </Card>
    </div>
  );
}
