import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";

// GET all blog posts
export async function GET(req: NextRequest) {
    try {
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 503 }
            );
        }

        const { searchParams } = new URL(req.url);
        const publishedOnly = searchParams.get("published") === "true";
        const filter = publishedOnly ? { isPublished: true } : {};

        const posts = await BlogPost.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        const serialized = posts.map((p) => ({
            ...p,
            _id: String(p._id),
        }));

        return NextResponse.json({ posts: serialized });
    } catch (err: unknown) {
        console.error("GET /api/blog error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// POST – create new blog post
export async function POST(req: NextRequest) {
    try {
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected. Set MONGODB_URI in .env.local" },
                { status: 503 }
            );
        }

        const body = await req.json();

        // Auto-generate slug from title
        if (!body.slug && body.title) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        // Set publishedAt if publishing
        if (body.isPublished && !body.publishedAt) {
            body.publishedAt = new Date();
        }

        const post = await BlogPost.create(body);
        return NextResponse.json(
            { post: { ...post.toObject(), _id: String(post._id) } },
            { status: 201 }
        );
    } catch (err: unknown) {
        console.error("POST /api/blog error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
