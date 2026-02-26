import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/lib/models/BlogPost";

// PUT – update a blog post
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 503 }
            );
        }

        const body = await req.json();

        // Auto-update slug if title changed
        if (body.title && !body.slug) {
            body.slug = body.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
        }

        // Set publishedAt if publishing for the first time
        if (body.isPublished && !body.publishedAt) {
            body.publishedAt = new Date();
        }

        const updated = await BlogPost.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        }).lean();

        if (!updated) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            post: { ...updated, _id: String(updated._id) },
        });
    } catch (err: unknown) {
        console.error("PUT /api/blog/[id] error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

// DELETE – delete a blog post
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = await connectDB();
        if (!db) {
            return NextResponse.json(
                { error: "Database not connected" },
                { status: 503 }
            );
        }

        const deleted = await BlogPost.findByIdAndDelete(id).lean();
        if (!deleted) {
            return NextResponse.json(
                { error: "Post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Post deleted" });
    } catch (err: unknown) {
        console.error("DELETE /api/blog/[id] error:", err);
        const message = err instanceof Error ? err.message : "Server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
