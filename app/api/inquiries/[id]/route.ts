import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";

// PATCH – update inquiry (status, etc.)
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 503 }
            );
        }

        const body = await req.json();
        const updated = await Inquiry.findByIdAndUpdate(id, body, {
            new: true,
        }).lean();

        if (!updated) {
            return NextResponse.json(
                { error: "Inquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            inquiry: { ...updated, _id: String(updated._id) },
        });
    } catch (err: unknown) {
        console.error("PATCH /api/inquiries/[id] error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE – delete an inquiry
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 503 }
            );
        }

        const deleted = await Inquiry.findByIdAndDelete(id).lean();
        if (!deleted) {
            return NextResponse.json(
                { error: "Inquiry not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Inquiry deleted" });
    } catch (err: unknown) {
        console.error("DELETE /api/inquiries/[id] error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
