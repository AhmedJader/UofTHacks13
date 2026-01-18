import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/data/analysis_results.json"
    );

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ alerts: [] });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);

    const alerts = data
      .map((item: any, index: number) => {
        const analysis = String(item.analysis || "").toLowerCase();

        const isThreat =
          analysis.includes("threat") ||
          analysis.includes("violence") ||
          analysis.includes("suspicious");

        if (!isThreat) return null;

        return {
          id: `analysis-${index}`,
          cameraId: item.cameraId,
          cameraName: item.cameraId,
          message: item.analysis.slice(0, 100) + "...",
          timestamp: item.timestamp * 1000, // ✅ NUMBER (epoch ms)
          severity: "high" as const,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Error reading alerts:", error);
    return NextResponse.json(
      { error: "Failed to fetch alerts" },
      { status: 500 }
    );
  }
}
