import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import getRazorpay from "@/lib/razorpay";
import Booking from "@/lib/models/Booking";
import { rateLimit } from "@/lib/rateLimit";
import {
    sanitizeString,
    sanitizeObject,
    isValidPhone,
    isValidEmail,
    isValidName,
    isValidDate,
    isValidTravelers,
    normalizePhone,
} from "@/lib/sanitize";

const limiter = rateLimit({ interval: 60_000, max: 5 });

/**
 * POST /api/bookings/create-order
 * Creates a Razorpay order and a pending Booking document.
 */
export async function POST(req: NextRequest) {
    const { success } = limiter.check(req);
    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    try {
        const rawBody = await req.json();
        const body = sanitizeObject(rawBody);
        const fullName = sanitizeString(body.fullName);
        const email = sanitizeString(body.email).toLowerCase();
        const phone = normalizePhone(sanitizeString(body.phone));
        const travelDate = sanitizeString(body.travelDate);
        const specialRequests = sanitizeString(body.specialRequests || "");
        const packageId = sanitizeString(body.packageId);
        const packageSlug = sanitizeString(body.packageSlug);
        const packageName = sanitizeString(body.packageName);
        const travelers = Number(body.travelers);
        const pricePerPerson = Number(body.pricePerPerson);

        // Sanitize traveler names array
        const rawNames = Array.isArray(rawBody.travelerNames) ? rawBody.travelerNames : [];
        const travelerNames: string[] = rawNames
            .map((n: unknown) => sanitizeString(n))
            .filter((n: string) => n.length > 0)
            .slice(0, 30);

        // Validate required fields
        if (
            !fullName ||
            !email ||
            !phone ||
            !travelers ||
            !travelDate ||
            !packageId ||
            !packageSlug ||
            !packageName ||
            !pricePerPerson
        ) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Field-level validation
        if (!isValidName(fullName)) {
            return NextResponse.json({ error: "Invalid name (2–100 characters)." }, { status: 400 });
        }
        if (!isValidPhone(phone)) {
            return NextResponse.json({ error: "Invalid phone number (10–15 digits)." }, { status: 400 });
        }
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
        }
        if (!isValidDate(travelDate)) {
            return NextResponse.json({ error: "Travel date must be today or in the future." }, { status: 400 });
        }
        if (!isValidTravelers(travelers)) {
            return NextResponse.json({ error: "Travelers must be between 1 and 100." }, { status: 400 });
        }
        if (pricePerPerson <= 0 || pricePerPerson > 10_000_000) {
            return NextResponse.json({ error: "Invalid price." }, { status: 400 });
        }

        const totalAmount = pricePerPerson * travelers;
        const amountInPaise = Math.round(totalAmount * 100);

        // Create Razorpay order
        const razorpay = getRazorpay();
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `booking_${Date.now()}`,
            notes: {
                packageName,
                fullName,
                email,
                phone,
                travelers: String(travelers),
            },
        });

        // Connect to DB and create booking record
        await connectDB();
        const booking = await Booking.create({
            fullName,
            email,
            phone,
            travelers: Number(travelers),
            travelerNames,
            travelDate,
            specialRequests,
            packageId,
            packageSlug,
            packageName,
            pricePerPerson,
            totalAmount,
            razorpayOrderId: order.id,
            paymentStatus: "created",
            status: "pending",
        });

        return NextResponse.json({
            orderId: order.id,
            amount: amountInPaise,
            currency: "INR",
            bookingId: booking._id.toString(),
            key: process.env.RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("Create order error:", err);
        return NextResponse.json(
            { error: "Failed to create order. Please try again." },
            { status: 500 }
        );
    }
}
