import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Otp from "@/lib/models/Otp";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rateLimit";
import { sanitizeString, isValidEmail } from "@/lib/sanitize";

const limiter = rateLimit({ max: 5, interval: 60_000 }); // 5 requests per minute per IP

export async function POST(req: NextRequest) {
  if (!limiter.check(req).success) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const email = sanitizeString(body.email || "")
      .toLowerCase()
      .trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    // Delete any existing OTPs for this email
    await Otp.deleteMany({ email });

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.create({ email, code, expiresAt });

    // Send OTP via email
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      // In dev without email config, log the OTP
      console.log(`[DEV] OTP for ${email}: ${code}`);
      return NextResponse.json({
        success: true,
        message: "OTP sent to your email.",
        // Only in dev: expose OTP for testing
        ...(process.env.NODE_ENV === "development" && { devOtp: code }),
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: emailUser, pass: emailPass },
    });

    await transporter.sendMail({
      from: `"GangOfMusafirs" <${emailUser}>`,
      to: email,
      subject: "Your Sign-In OTP – GangOfMusafirs",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem; background: #FFFAF7;">
          <h2 style="color: #C05C3A; margin-bottom: 0.25rem; font-size: 1.5rem;">GangOfMusafirs</h2>
          <p style="color: #7A6A5E; font-size: 0.85rem; margin-bottom: 1.5rem;">Travel Experiences</p>
          
          <p style="color: #2D1F14; font-size: 1rem; margin-bottom: 0.5rem;">Your one-time sign-in code is:</p>
          
          <div style="background: #FEF5F0; border: 2px solid #C05C3A; border-radius: 12px; padding: 1.5rem; text-align: center; margin: 1.25rem 0;">
            <span style="font-size: 2.25rem; font-weight: 800; letter-spacing: 0.6rem; color: #C05C3A;">${code}</span>
          </div>
          
          <p style="color: #7A6A5E; font-size: 0.875rem; line-height: 1.6;">
            This code expires in <strong>10 minutes</strong>. Do not share it with anyone.
          </p>
          
          <hr style="border: none; border-top: 1px solid #EADDD5; margin: 1.5rem 0;" />
          <p style="color: #999; font-size: 0.75rem;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
