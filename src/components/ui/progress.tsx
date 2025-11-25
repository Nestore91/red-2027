export function Progress({ value = 0 }: { value: number }) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full">
      <div
        className="h-2 bg-[var(--color-primary)] rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
