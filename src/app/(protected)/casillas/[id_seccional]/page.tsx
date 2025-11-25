export default function CasillaDetallePage({ params }: { params: { id_seccional: string } }) {
  return (
    <main className="p-6">
      <h1 className="text-xl font-bold">Seccional {params.id_seccional}</h1>
      <p className="text-gray-600">Página de detalle por seccional.</p>
    </main>
  );
}
