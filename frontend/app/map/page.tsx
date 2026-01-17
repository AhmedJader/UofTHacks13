"use client";

import { useState } from "react";

export default function MapPage() {
    return (
        <main className="w-full h-screen bg-slate-950 flex flex-col">
            <div className="border-b border-slate-700 bg-slate-900">
                <div className="p-4">
                    <h1 className="text-2xl font-semibold text-white">Surveillance Map</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Geographic view of monitored regions
                    </p>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full h-full bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder Map Background */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-slate-950" />

                    {/* Grid Lines for "Map" feel */}
                    <div className="absolute inset-0"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    <div className="relative z-10 text-center">
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-500/10 border-2 border-blue-500/50 flex items-center justify-center animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.553-.894L15 7m0 13V7" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-medium text-slate-200 mb-2">Map View Placeholder</h2>
                        <p className="text-slate-400 max-w-md mx-auto">
                            This area will display an interactive map highlighting regions with active CCTV footage.
                        </p>
                    </div>

                    {/* Dummy Hotspots */}
                    <div className="absolute top-1/4 left-1/4">
                        <div className="relative">
                            <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute" />
                            <div className="w-4 h-4 bg-red-500 rounded-full relative border-2 border-white shadow-lg shadow-red-500/50" />
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-white px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                                Zone A - Alert
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-1/3 right-1/3">
                        <div className="relative">
                            <div className="w-3 h-3 bg-green-500 rounded-full relative border-2 border-white shadow-lg shadow-green-500/50" />
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-slate-800 text-xs text-slate-300 px-2 py-1 rounded border border-slate-700 whitespace-nowrap">
                                Zone B - Active
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
