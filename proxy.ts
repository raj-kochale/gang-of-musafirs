import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

/**
 * Validate the legacy admin_token cookie (SHA-256 of password + salt).
 * Returns true if the cookie is present and matches the expected hash.
 */
async function hasValidAdminToken(request: NextRequest): Promise<boolean> {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) return false;

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) return false;

    const encoder = new TextEncoder();
    const data = encoder.encode(adminPassword + "-gangofmusafirs-admin");
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const expectedToken = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    return token === expectedToken;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip auth for login page and auth API routes
    if (pathname === "/admin/login" || pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    // ── Admin page routes ──
    if (pathname.startsWith("/admin")) {
        const session = await auth();

        // Not signed in → check legacy token, else redirect to login
        if (!session?.user) {
            if (await hasValidAdminToken(request)) {
                return NextResponse.next();
            }
            const loginUrl = new URL("/admin/login", request.url);
            loginUrl.searchParams.set("callbackUrl", pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Signed in but not admin → redirect to home
        if (session.user.role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    }

    // ── Admin API routes (write operations) ──
    if (pathname.startsWith("/api/packages") || pathname.startsWith("/api/blog")) {
        if (request.method !== "GET") {
            const session = await auth();
            if (!session?.user || session.user.role !== "admin") {
                if (!(await hasValidAdminToken(request))) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
                }
            }
        }
        return NextResponse.next();
    }

    // ── Upload endpoint ──
    if (pathname === "/api/upload") {
        const session = await auth();
        if (!session?.user || session.user.role !== "admin") {
            if (!(await hasValidAdminToken(request))) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/api/packages/:path*",
        "/api/blog/:path*",
        "/api/upload",
    ],
};
