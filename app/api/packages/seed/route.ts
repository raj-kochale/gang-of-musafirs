import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PackageModel from "@/lib/models/Package";
import { packages as staticPackages } from "@/lib/data";

// POST /api/packages/seed – migrate static data to MongoDB
export async function POST() {
    try {
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected. Set MONGODB_URI in .env.local" },
                { status: 503 }
            );
        }

        const existing = await PackageModel.countDocuments();
        if (existing > 0) {
            return NextResponse.json({
                message: `Database already has ${existing} packages. Skipping seed.`,
                count: existing,
            });
        }

        // Remove the static `id` field before inserting
        const toInsert = staticPackages.map(({ id, ...rest }) => rest);
        const inserted = await PackageModel.insertMany(toInsert);

        return NextResponse.json({
            message: `Successfully seeded ${inserted.length} packages`,
            count: inserted.length,
        });
    } catch (err: unknown) {
        console.error("Seed error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
