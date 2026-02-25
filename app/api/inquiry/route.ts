import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Inquiry from "@/lib/models/Inquiry";
import nodemailer from "nodemailer";

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

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { fullName, phone, email, destination, travelDate, travelers } = body;

        // Basic validation
        if (!fullName || !phone || !email || !destination || !travelDate || !travelers) {
            return NextResponse.json(
                { error: "Please fill in all required fields." },
                { status: 400 }
            );
        }

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
                budget: body.budget || "",
                message: body.message || "",
            });
        } else {
            console.log("New inquiry (DB not connected):", { fullName, phone, email, destination });
        }

        // Send email notification (non-blocking)
        sendEmailNotification({
            fullName,
            phone,
            email,
            destination,
            travelDate,
            travelers,
            budget: body.budget || "",
            message: body.message || "",
        }).catch((err) => console.error("Email send failed:", err));

        return NextResponse.json({ success: true, message: "Inquiry submitted!" });
    } catch (err) {
        console.error("Inquiry API error:", err);
        return NextResponse.json(
            { error: "Server error. Please try again." },
            { status: 500 }
        );
    }
}
