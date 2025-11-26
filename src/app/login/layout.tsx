export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md min-h-screen bg-[var(--color-bg)]">
      {children}
    </div>
  );
}
