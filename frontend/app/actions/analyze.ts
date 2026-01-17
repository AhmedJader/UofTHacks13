"use server";

import client from "@/lib/twelvelabs";

export async function searchVideos(indexId: string, query: string) {
    try {
        const results = await client.search.create({
            indexId,
            queryText: query,
            searchOptions: ["visual", "transcription"],
        });
        return { success: true, data: results.data };
    } catch (error) {
        console.error("Twelve Labs Search Error:", error);
        return { success: false, error: "Failed to search videos" };
    }
}

export async function generateText(videoId: string, prompt: string) {
    try {
        const result = await client.generate({
            videoId,
            prompt,
            stream: false,
        });
        return { success: true, data: result };
    } catch (error) {
        console.error("Twelve Labs Generate Error:", error);
        return { success: false, error: "Failed to generate text" };
    }
}

export async function listIndexes() {
    try {
        const indexes = await client.indexes.list();
        return { success: true, data: indexes.data };
    } catch (error) {
        console.error("Twelve Labs List Indexes Error:", error);
        return { success: false, error: "Failed to list indexes" };
    }
}
