import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";

/**
 * GET /api/bookings
 * Admin: Get all bookings (protected by proxy/middleware).
 * Query: ?email=user@email.com (for user's own bookings)
 */
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        const filter = email ? { email } : {};
        const bookings = await Booking.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        const serialized = bookings.map((b) => ({
            ...b,
            _id: String(b._id),
        }));

        return NextResponse.json({ bookings: serialized });
    } catch (err) {
        console.error("GET /api/bookings error:", err);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}
