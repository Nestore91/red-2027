export default function PlaceholderPage({ title = "En construcción", description = "" }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-gray-600 text-center">{description}</p>
    </main>
  );
}
