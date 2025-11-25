import RequireAuth from "@/components/RequireAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-md min-h-screen bg-white">
        {children}
      </div>
    </RequireAuth>
  );
}
