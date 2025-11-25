// import { Search, Ellipsis } from "lucide-react";

export default function AppHeader({title="Red 2027", right}: {title?: string; right?: React.ReactNode}) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-bg)]/80 backdrop-blur">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 rounded-full bg-[var(--color-primary)]" />
          <span className="font-semibold">{title}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          {/* <Search size={20} /> */}
          {/* {right ?? <Ellipsis size={20} />} */}
        </div>
      </div>
    </header>
  );
}
