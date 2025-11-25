import { Card } from "@/components/ui/card";

export default function DlHeader({ dl }: { dl: any }) {
  return (
    <Card className="p-4 rounded-2xl mb-4 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight">{dl.nombre}</h1>
      <div className="mt-1 text-sm text-gray-600">
        <p>Clave: <span className="font-medium">{dl.clave}</span></p>
        <p>{dl.municipio}, {dl.estado}</p>
      </div>
    </Card>
  );
}
