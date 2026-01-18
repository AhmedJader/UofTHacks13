import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "public/data/analysis_results.json");

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ alerts: [] });
        }

        const fileContent = fs.readFileSync(filePath, "utf-8");
        const data = JSON.parse(fileContent);

        // Transform the raw analysis data into our Alert format
        // Note: This transformation depends on the actual output format of the Python script/LLM
        // For now, we'll assume a simple structure and map it.

        const alerts = data.map((item: any, index: number) => {
            // Simple heuristic to determine if it's an alert based on the text
            // In a real app, we'd parse the JSON output from the LLM more strictly
            const isThreat = item.analysis.toLowerCase().includes("threat") ||
                item.analysis.toLowerCase().includes("violence") ||
                item.analysis.toLowerCase().includes("suspicious");

            if (!isThreat) return null;

            return {
                id: `analysis-${index}`,
                cameraId: item.cameraId,
                cameraName: item.cameraId, // We could map this back to a name
                message: item.analysis.slice(0, 100) + "...", // Truncate for display
                timestamp: new Date(item.timestamp * 1000), // Python timestamp is seconds
                severity: "high", // Default to high for detected threats
            };
        }).filter(Boolean);

        return NextResponse.json({ alerts });
    } catch (error) {
        console.error("Error reading alerts:", error);
        return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
    }
}
