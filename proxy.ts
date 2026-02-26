import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip auth for login page and auth API routes
    if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    // No password configured – allow access (dev convenience)
    if (!adminPassword) {
        return NextResponse.next();
    }

    // Check admin_token cookie
    const token = request.cookies.get("admin_token")?.value;

    // Compute expected token: SHA-256(password + salt)
    const encoder = new TextEncoder();
    const data = encoder.encode(adminPassword + "-gangofmusafirs-admin");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const expectedToken = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    if (token !== expectedToken) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
