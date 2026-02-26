import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";

/**
 * PATCH /api/bookings/[id]
 * Update booking status (admin only).
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        await connectDB();

        const booking = await Booking.findByIdAndUpdate(id, body, {
            new: true,
        }).lean();

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            booking: { ...booking, _id: String(booking._id) },
        });
    } catch (err) {
        console.error("PATCH /api/bookings/[id] error:", err);
        return NextResponse.json(
            { error: "Failed to update booking" },
            { status: 500 }
        );
    }
}
