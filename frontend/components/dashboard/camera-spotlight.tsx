"use client";

import { useState, useRef } from "react";
import { CAMERAS } from "@/lib/cameras";
import { CameraAnalysis } from "./camera-grid";
import { Button } from "@/components/ui/button";
import { MapPin, Video, AlertTriangle } from "lucide-react";
import PoseOverlayMulti from "../PoseOverlayMulti";


interface CameraSpotlightProps {
    cameraId: string;
    analyses: CameraAnalysis[];
    onAnalyze: (cameraId: string) => Promise<void>;
}

export default function CameraSpotlight({
    cameraId,
    analyses,
    onAnalyze,
}: CameraSpotlightProps) {
    const [loading, setLoading] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const camera = CAMERAS.find((c) => c.id === cameraId);
    const cameraAnalyses = analyses.filter((a) => a.cameraId === cameraId);

    if (!camera) return null;

    const runAnalysis = async () => {
        setLoading(true);
        await onAnalyze(cameraId);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Video className="w-5 h-5 text-blue-400" />
                        <h1 className="text-xl font-bold tracking-tight text-white">
                            {camera.name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{camera.location}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 border border-red-900/50 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs font-medium text-red-400">LIVE FEED</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Feed */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
                            {/* LIVE badge */}
                            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/60 px-2 py-1 rounded-md backdrop-blur-sm border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                <span className="text-[10px] font-bold text-red-500 tracking-widest">
                                    LIVE
                                </span>
                            </div>

                            {/* Video + Pose Overlay */}
                            <div className="relative w-full h-full">
                                <video
                                    ref={videoRef}
                                    src={camera.src}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                />

                                <PoseOverlayMulti
                                    videoRef={videoRef as React.RefObject<HTMLVideoElement>}
                                    cameraId={cameraId}
                                />


                            </div>
                        </div>

                        {/* Analyze Button */}
                        <div className="flex items-center justify-between bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                            <div>
                                <h3 className="text-sm font-medium text-slate-300">
                                    Context Analysis
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Run semantic analysis on this feed
                                </p>
                            </div>
                            <Button
                                onClick={runAnalysis}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-500 text-white"
                            >
                                {loading ? "Analyzing..." : "Analyze Feed"}
                            </Button>
                        </div>
                    </div>

                    {/* Activity Log */}
                    <div className="lg:col-span-1 bg-slate-900/30 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
                            <h3 className="font-semibold text-sm">Activity Log</h3>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {cameraAnalyses.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2">
                                    <AlertTriangle className="w-8 h-8 opacity-20" />
                                    <p className="text-sm">No analysis records found</p>
                                </div>
                            ) : (
                                cameraAnalyses.map((a, i) => (
                                    <div
                                        key={i}
                                        className={`rounded-lg p-3 text-sm border ${a.flagged
                                            ? "border-red-900/50 bg-red-950/20"
                                            : "border-slate-800 bg-slate-950/50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-slate-500 font-mono">
                                                {new Date(a.timestamp).toLocaleTimeString()}
                                            </span>
                                            {a.flagged && (
                                                <span className="text-[10px] font-bold bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded">
                                                    FLAGGED
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-300 leading-relaxed">
                                            {a.analysis}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
