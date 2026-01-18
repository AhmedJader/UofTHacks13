"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, AlertTriangle, Activity, ShieldCheck } from "lucide-react";

// Mock Data Generation
const generateMockData = (): {
  alerts: Alert[];
  stations: { id: string; name: string; status: "active" | "inactive" }[];
} => {
  const stations = [
    { id: "cam-1", name: "Main Entrance", status: "active" as const },
    { id: "cam-2", name: "Parking Lot A", status: "active" as const },
    { id: "cam-3", name: "Lobby", status: "active" as const },
    { id: "cam-4", name: "Back Alley", status: "inactive" as const },
    { id: "cam-5", name: "Warehouse", status: "active" as const },
  ];

  const alerts: Alert[] = [];
  const now = new Date();

  // Helper to subtract time
  const subHours = (date: Date, h: number) =>
    new Date(date.getTime() - h * 60 * 60 * 1000);
  const subDays = (date: Date, d: number) =>
    new Date(date.getTime() - d * 24 * 60 * 60 * 1000);

  // Generate some alerts for different time ranges
  // Generate some alerts for different time ranges
  const ALERT_TYPES = [
    { message: "Person wielding knife", tag: "Weapon", severity: "high" as const },
    { message: "Motion detected", tag: "Suspicious", severity: "medium" as const },
    { message: "Unidentified object", tag: "Object", severity: "low" as const },
    { message: "Loitering detected", tag: "Suspicious", severity: "low" as const },
    { message: "Camera obstruction", tag: "System", severity: "high" as const },
    { message: "Unauthorized access", tag: "Security", severity: "high" as const },
    { message: "Glass breaking sound", tag: "Audio", severity: "high" as const },
  ];

  for (let i = 0; i < 50; i++) {
    const station = stations[Math.floor(Math.random() * stations.length)];
    // Distribute timestamps: some recent, some older
    let timestamp;
    const rand = Math.random();
    if (rand < 0.2)
      timestamp = subHours(now, Math.random()); // Last hour
    else if (rand < 0.5)
      timestamp = subHours(now, Math.random() * 24); // Last 24h
    else if (rand < 0.8)
      timestamp = subDays(now, Math.random() * 7); // Last week
    else timestamp = subDays(now, Math.random() * 30); // Older

    const alertType = ALERT_TYPES[Math.floor(Math.random() * ALERT_TYPES.length)];

    alerts.push({
      id: `alert-${i}`,
      cameraId: station.id,
      cameraName: station.name,
      message: alertType.message,
      timestamp: timestamp.getTime(),
      severity: alertType.severity,
      tag: alertType.tag,
    });
  }

  // Sort by newest first
  alerts.sort((a, b) => b.timestamp - a.timestamp);

  return { alerts, stations };
};

const { alerts: ALL_ALERTS, stations: STATIONS } = generateMockData();

type TimeRange = "1h" | "24h" | "7d" | "all";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  const filteredAlerts = useMemo(() => {
    const now = new Date();
    return ALL_ALERTS.filter((alert) => {
      const diff = now.getTime() - alert.timestamp;
      const hours = diff / (1000 * 60 * 60);

      switch (timeRange) {
        case "1h":
          return hours <= 1;
        case "24h":
          return hours <= 24;
        case "7d":
          return hours <= 24 * 7;
        case "all":
          return true;
      }
    });
  }, [timeRange]);

  const stats = useMemo(() => {
    return {
      total: filteredAlerts.length,
      high: filteredAlerts.filter((a) => a.severity === "high").length,
      medium: filteredAlerts.filter((a) => a.severity === "medium").length,
      low: filteredAlerts.filter((a) => a.severity === "low").length,
      activeStations: STATIONS.filter((s) => s.status === "active").length,
    };
  }, [filteredAlerts]);

  // Group alerts by station for the current period
  const stationStats = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredAlerts.forEach((a) => {
      counts[a.cameraId] = (counts[a.cameraId] || 0) + 1;
    });
    return STATIONS.map((s) => ({
      ...s,
      alertCount: counts[s.id] || 0,
    })).sort((a, b) => b.alertCount - a.alertCount);
  }, [filteredAlerts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Dashboard Overview
        </h2>
        <Tabs
          value={timeRange}
          onValueChange={(v) => setTimeRange(v as TimeRange)}
          className="w-[400px]"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="1h">1h</TabsTrigger>
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7d">7d</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Total Alerts
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <p className="text-xs text-slate-400">
              {timeRange === "all"
                ? "All time records"
                : `In the last ${timeRange}`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              High Severity
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.high}</div>
            <p className="text-xs text-slate-400">
              {stats.total > 0
                ? `${Math.round((stats.high / stats.total) * 100)}% of total`
                : "No alerts"}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Active Stations
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats.activeStations}/{STATIONS.length}
            </div>
            <p className="text-xs text-slate-400">Currently online</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              System Status
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Operational</div>
            <p className="text-xs text-slate-400">All systems normal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Recent Incidents</CardTitle>
            <CardDescription className="text-slate-400">
              Latest alerts from all stations in this period.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {filteredAlerts.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">
                    No alerts found for this period.
                  </p>
                ) : (
                  filteredAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-center justify-between border-b border-slate-800 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {alert.message}
                          <Badge variant="outline" className="ml-2 text-[10px] h-5 text-white">
                            {alert.tag}
                          </Badge>
                        </p>
                        <p className="text-xs text-slate-400">
                          {alert.cameraName} •{" "}
                          {alert.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Badge
                        variant={
                          alert.severity === "high"
                            ? "destructive"
                            : alert.severity === "medium"
                              ? "default"
                              : "secondary"
                        }
                        className={
                          alert.severity === "medium"
                            ? "bg-yellow-600 hover:bg-yellow-700"
                            : ""
                        }
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Station Overview */}
        <Card className="col-span-3 bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Station Overview</CardTitle>
            <CardDescription className="text-slate-400">
              Alert distribution by station.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-4">
              <div className="space-y-4">
                {stationStats.map((station) => (
                  <div
                    key={station.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${station.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none text-white">
                          {station.name}
                        </p>
                        <p className="text-xs text-slate-400">{station.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {station.alertCount}
                      </span>
                      <span className="text-xs text-slate-500">alerts</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
