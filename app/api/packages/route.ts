import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PackageModel from "@/lib/models/Package";
import { packages as staticPackages } from "@/lib/data";

// GET all packages
export async function GET() {
    try {
        const db = await connectDB();
        if (db) {
            const pkgs = await PackageModel.find({}).sort({ createdAt: -1 }).lean();
            if (pkgs.length > 0) {
                const serialised = pkgs.map((p) => ({
                    ...p,
                    _id: String(p._id),
                    id: String(p._id),
                }));
                return NextResponse.json({ packages: serialised, source: "db" });
            }
        }
        // fallback to static data
        return NextResponse.json({ packages: staticPackages, source: "static" });
    } catch (err) {
        console.error("GET /api/packages error:", err);
        return NextResponse.json({ packages: staticPackages, source: "static" });
    }
}

// POST – create new package
export async function POST(req: NextRequest) {
    try {
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected. Set MONGODB_URI in .env.local" },
                { status: 503 }
            );
        }

        const body = await req.json();

        // Auto-generate slug from name if not provided
        if (!body.slug && body.name) {
            body.slug = body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const pkg = await PackageModel.create(body);
        return NextResponse.json(
            { package: { ...pkg.toObject(), _id: String(pkg._id), id: String(pkg._id) } },
            { status: 201 }
        );
    } catch (err: unknown) {
        console.error("POST /api/packages error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
