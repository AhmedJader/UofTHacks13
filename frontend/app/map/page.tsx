"use client";

import CrimeMap from "@/components/dashboard/crime-map";

export default function MapPage() {
  return (
    <main className="w-full h-screen bg-slate-950 flex flex-col">
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-white">
            Surveillance Map
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Geographic view of monitored regions
          </p>
        </div>
      </div>

      <div className="flex-1 p-8">
        <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
          <CrimeMap />
        </div>
      </div>
    </main>
  );
}
