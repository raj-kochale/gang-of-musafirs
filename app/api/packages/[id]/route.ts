import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PackageModel from "@/lib/models/Package";

// PUT – update a package
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectDB();
        if (!db) {
            return NextResponse.json({ error: "Database not connected" }, { status: 503 });
        }

        const body = await req.json();

        // Auto-update slug if name changed
        if (body.name && !body.slug) {
            body.slug = body.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        const updated = await PackageModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updated) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }

        return NextResponse.json({
            package: { ...updated, _id: String(updated._id), id: String(updated._id) },
        });
    } catch (err: unknown) {
        console.error("PUT /api/packages/[id] error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE – delete a package
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectDB();
        if (!db) {
            return NextResponse.json({ error: "Database not connected" }, { status: 503 });
        }

        const deleted = await PackageModel.findByIdAndDelete(id).lean();

        if (!deleted) {
            return NextResponse.json({ error: "Package not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Package deleted successfully" });
    } catch (err: unknown) {
        console.error("DELETE /api/packages/[id] error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
