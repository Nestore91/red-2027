"use client";

import dynamic from "next/dynamic";

const LeafletMapInner = dynamic(() => import("./LeafletMapInner"), {
  ssr: false,
});

export default function MapPicker({
  lat,
  lon,
  onChange,
  onUseMyLocation,
}: {
  lat: number | null;
  lon: number | null;
  onChange: (lat: number, lon: number) => void;
  onUseMyLocation: () => void;
}) {
  return (
    <div className="relative border rounded-lg overflow-hidden">
      <div className="h-52">
        <LeafletMapInner lat={lat} lon={lon} onChange={onChange} />
      </div>

      <button
        type="button"
        onClick={onUseMyLocation}
        className="absolute top-2 right-2 z-[999] bg-white/95 border px-3 py-1.5 rounded text-xs shadow"
      >
        Mi ubicación actual
      </button>
    </div>
  );
}
