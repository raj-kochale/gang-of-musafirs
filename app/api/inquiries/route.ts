import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";

// GET all inquiries
export async function GET() {
    try {
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 503 }
            );
        }

        const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
        const serialized = inquiries.map((inq) => ({
            ...inq,
            _id: String(inq._id),
        }));

        return NextResponse.json({ inquiries: serialized });
    } catch (err: unknown) {
        console.error("GET /api/inquiries error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
