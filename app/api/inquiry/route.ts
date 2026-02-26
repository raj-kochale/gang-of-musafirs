import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";
import {
    sanitizeString,
    sanitizeObject,
    isValidPhone,
    isValidEmail,
    isValidName,
    isValidDate,
    normalizePhone,
} from "@/lib/sanitize";

const limiter = rateLimit({ interval: 60_000, max: 5 });

async function sendEmailNotification(data: {
    fullName: string;
    phone: string;
    email: string;
    destination: string;
    travelDate: string;
    travelers: string;
    budget: string;
    message: string;
}) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.warn("Email credentials not configured – skipping email notification");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: emailPass,
        },
    });

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFAF7; border-radius: 12px;">
      <h2 style="color: #C05C3A; margin-bottom: 8px;">🏔️ New Trip Inquiry – GangOfMusafirs</h2>
      <hr style="border: none; border-top: 2px solid #EADDD5; margin: 16px 0;" />
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2D1F14;">
        <tr><td style="padding: 8px 0; font-weight: 600; width: 140px;">Name</td><td>${data.fullName}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Phone</td><td>${data.phone}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Email</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Destination</td><td>${data.destination}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Travel Date</td><td>${data.travelDate}</td></tr>
        <tr><td style="padding: 8px 0; font-weight: 600;">Travelers</td><td>${data.travelers}</td></tr>
        ${data.budget ? `<tr><td style="padding: 8px 0; font-weight: 600;">Budget</td><td>${data.budget}</td></tr>` : ""}
        ${data.message ? `<tr><td style="padding: 8px 0; font-weight: 600;">Message</td><td>${data.message}</td></tr>` : ""}
      </table>
      <hr style="border: none; border-top: 1px solid #EADDD5; margin: 16px 0;" />
      <p style="font-size: 12px; color: #7A6A5E;">This inquiry was submitted via gangofmusafirs.in</p>
    </div>`;

    await transporter.sendMail({
        from: `"GangOfMusafirs" <${emailUser}>`,
        to: emailUser,
        replyTo: data.email,
        subject: `🏔️ New Inquiry: ${data.destination} – ${data.fullName}`,
        html,
    });
}

async function sendUserConfirmation(data: {
    fullName: string;
    email: string;
    destination: string;
    travelDate: string;
    travelers: string;
}) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
        console.warn("Email credentials not configured – skipping user confirmation");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: emailUser, pass: emailPass },
    });

    const whatsapp = process.env.WHATSAPP_NUMBER || "7354177879";

    const html = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FFFAF7; border-radius: 12px;">
      <h2 style="color: #C05C3A; margin-bottom: 4px;">🏔️ Thank You, ${data.fullName}!</h2>
      <p style="color: #7A6A5E; font-size: 15px;">We've received your trip inquiry and our team will get back to you within 1 hour.</p>
      <hr style="border: none; border-top: 2px solid #EADDD5; margin: 16px 0;" />
      <h3 style="color: #2D1F14; font-size: 14px; margin-bottom: 8px;">Your Inquiry Summary</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #2D1F14;">
        <tr><td style="padding: 6px 0; font-weight: 600; width: 120px;">Destination</td><td>${data.destination}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Travel Date</td><td>${data.travelDate}</td></tr>
        <tr><td style="padding: 6px 0; font-weight: 600;">Travelers</td><td>${data.travelers}</td></tr>
      </table>
      <hr style="border: none; border-top: 1px solid #EADDD5; margin: 16px 0;" />
      <p style="font-size: 14px; color: #2D1F14;">
        💬 Need a quicker response? Chat with us on
        <a href="https://wa.me/91${whatsapp}" style="color: #25D366; font-weight: 600;">WhatsApp</a>
      </p>
      <p style="font-size: 12px; color: #7A6A5E; margin-top: 16px;">— Team GangOfMusafirs 🌄</p>
    </div>`;

    await transporter.sendMail({
        from: `"GangOfMusafirs" <${emailUser}>`,
        to: data.email,
        subject: `✅ Inquiry Received – ${data.destination} Trip | GangOfMusafirs`,
        html,
    });
}

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
        const phone = normalizePhone(sanitizeString(body.phone));
        const email = sanitizeString(body.email).toLowerCase();
        const destination = sanitizeString(body.destination);
        const travelDate = sanitizeString(body.travelDate);
        const travelers = sanitizeString(body.travelers);

        // Required fields
        if (!fullName || !phone || !email || !destination || !travelDate || !travelers) {
            return NextResponse.json(
                { error: "Please fill in all required fields." },
                { status: 400 }
            );
        }

        // Field-level validation
        if (!isValidName(fullName)) {
            return NextResponse.json({ error: "Invalid name (2–100 characters, letters only)." }, { status: 400 });
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

        const budget = sanitizeString(body.budget || "");
        const message = sanitizeString(body.message || "");

        // Try to save to MongoDB (non-blocking if no URI)
        const db = await connectDB();
        if (db) {
            await Inquiry.create({
                fullName,
                phone,
                email,
                destination,
                travelDate,
                travelers,
                budget,
                message,
            });
        } else {
            console.log("New inquiry (DB not connected):", { fullName, phone, email, destination });
        }

        // Send email notification to admin (non-blocking)
        sendEmailNotification({
            fullName,
            phone,
            email,
            destination,
            travelDate,
            travelers,
            budget,
            message,
        }).catch((err) => console.error("Email send failed:", err));

        // Send confirmation email to user (non-blocking)
        sendUserConfirmation({
            fullName,
            email,
            destination,
            travelDate,
            travelers,
        }).catch((err) => console.error("User confirmation email failed:", err));

        return NextResponse.json({ success: true, message: "Inquiry submitted!" });
    } catch (err) {
        console.error("Inquiry API error:", err);
        return NextResponse.json(
            { error: "Server error. Please try again." },
            { status: 500 }
        );
    }
}
