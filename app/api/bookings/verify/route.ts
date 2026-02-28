import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";
import nodemailer from "nodemailer";

/**
 * POST /api/bookings/verify
 * Verify Razorpay payment signature and confirm booking.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing payment details" },
                { status: 400 }
            );
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json(
                { error: "Payment configuration error" },
                { status: 500 }
            );
        }

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            // Mark as failed
            await connectDB();
            await Booking.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { paymentStatus: "failed" }
            );
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            );
        }

        // Update booking as paid + confirmed
        await connectDB();
        const booking = await Booking.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
                paymentStatus: "paid",
                status: "confirmed",
            },
            { new: true }
        );

        if (!booking) {
            return NextResponse.json(
                { error: "Booking not found" },
                { status: 404 }
            );
        }

        // Send confirmation emails (non-blocking)
        sendBookingConfirmation(booking).catch((err) =>
            console.error("Booking email failed:", err)
        );

        return NextResponse.json({
            success: true,
            message: "Payment verified, booking confirmed!",
            bookingId: booking._id.toString(),
        });
    } catch (err) {
        console.error("Verify payment error:", err);
        return NextResponse.json(
            { error: "Verification failed" },
            { status: 500 }
        );
    }
}

/* ── Send booking confirmation emails ── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function sendBookingConfirmation(booking: any) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    if (!emailUser || !emailPass) return;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: emailUser, pass: emailPass },
    });

    const whatsapp = process.env.WHATSAPP_NUMBER || "7354177879";
    const date = new Date(booking.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // Email to customer
    const userHtml = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFAF7; border-radius: 12px;">
      <h2 style="color: #C05C3A; margin-bottom: 4px;">🎉 Booking Confirmed!</h2>
      <p style="color: #7A6A5E; font-size: 15px;">Thank you, ${booking.fullName}! Your trip is booked.</p>
      <hr style="border: none; border-top: 2px solid #EADDD5; margin: 16px 0;" />
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2D1F14;">
        <tr><td style="padding: 6px 0; font-weight: 600; width: 140px;">Trip</td><td>${booking.packageName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Travel Date</td><td>${booking.travelDate}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Travelers</td><td>${booking.travelers}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Total Paid</td><td>₹${booking.totalAmount.toLocaleString("en-IN")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Payment ID</td><td style="font-size: 12px; color: #7A6A5E;">${booking.razorpayPaymentId}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Booking Date</td><td>${date}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #EADDD5; margin: 16px 0;" />
      <p style="font-size: 14px; color: #2D1F14;">
        💬 Questions? Chat with us on
        <a href="https://wa.me/91${whatsapp}" style="color: #25D366; font-weight: 600;">WhatsApp</a>
      </p>
      <p style="font-size: 12px; color: #7A6A5E; margin-top: 16px;">— Team GangOfMusafirs 🌄</p>
    </div>`;

    // Email to admin
    const adminHtml = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFAF7; border-radius: 12px;">
      <h2 style="color: #C05C3A;">💰 New Booking Received!</h2>
      <hr style="border: none; border-top: 2px solid #EADDD5; margin: 16px 0;" />
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2D1F14;">
        <tr><td style="padding: 6px 0; font-weight: 600; width: 140px;">Name</td><td>${booking.fullName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Email</td><td>${booking.email}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Phone</td><td>${booking.phone}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Trip</td><td>${booking.packageName}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Travel Date</td><td>${booking.travelDate}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Travelers</td><td>${booking.travelers}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Total Amount</td><td>₹${booking.totalAmount.toLocaleString("en-IN")}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Payment ID</td><td style="font-size: 12px;">${booking.razorpayPaymentId}</td></tr>
        ${booking.specialRequests ? `<tr><td style="padding: 6px 0; font-weight: 600;">Special Requests</td><td>${booking.specialRequests}</td></tr>` : ""}
      </table>
      <p style="font-size: 12px; color: #7A6A5E; margin-top: 16px;">Booking received via gangofmusafirs.online</p>
    </div>`;

    await Promise.all([
        transporter.sendMail({
            from: `"GangOfMusafirs" <${emailUser}>`,
            to: booking.email,
            subject: `🎉 Booking Confirmed – ${booking.packageName} | GangOfMusafirs`,
            html: userHtml,
        }),
        transporter.sendMail({
            from: `"GangOfMusafirs" <${emailUser}>`,
            to: emailUser,
            replyTo: booking.email,
            subject: `💰 New Booking: ${booking.packageName} – ${booking.fullName} (₹${booking.totalAmount.toLocaleString("en-IN")})`,
            html: adminHtml,
        }),
    ]);
}
