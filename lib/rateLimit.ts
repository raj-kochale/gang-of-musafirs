/**
 * Simple in-memory rate limiter for API routes.
 *
 * Usage:
 *   import { rateLimit } from "@/lib/rateLimit";
 *   const limiter = rateLimit({ interval: 60_000, max: 5 });
 *
 *   export async function POST(req: NextRequest) {
 *     const { success } = limiter.check(req);
 *     if (!success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
 *     ...
 *   }
 */

type Options = {
    /** Time window in milliseconds (default 60 000 = 1 min) */
    interval?: number;
    /** Maximum requests per interval per IP (default 10) */
    max?: number;
};

type Entry = { count: number; resetAt: number };

export function rateLimit(opts: Options = {}) {
    const interval = opts.interval ?? 60_000;
    const max = opts.max ?? 10;
    const store = new Map<string, Entry>();

    // Periodic cleanup (every 2× interval)
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of store) {
            if (entry.resetAt < now) store.delete(key);
        }
    }, interval * 2);

    return {
        /**
         * Check rate limit.  Returns `{ success: true }` if under limit,
         * `{ success: false }` if exceeded.
         */
        check(req: Request): { success: boolean } {
            const forwarded =
                req.headers.get("x-forwarded-for") ??
                req.headers.get("x-real-ip") ??
                "unknown";
            const ip = forwarded.split(",")[0].trim();
            const now = Date.now();

            let entry = store.get(ip);
            if (!entry || entry.resetAt < now) {
                entry = { count: 0, resetAt: now + interval };
                store.set(ip, entry);
            }

            entry.count++;
            return { success: entry.count <= max };
        },
    };
}
