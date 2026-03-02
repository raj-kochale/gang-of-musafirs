import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Max file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const uploaded: string[] = [];

        for (const file of files) {
            // Validate type
            if (!ALLOWED_TYPES.includes(file.type)) {
                return NextResponse.json(
                    { error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, SVG` },
                    { status: 400 }
                );
            }

            // Validate size
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: `File "${file.name}" exceeds 5MB limit` },
                    { status: 400 }
                );
            }

            // Generate unique filename
            const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`;
            const baseName = path
                .basename(file.name, ext)
                .replace(/[^a-zA-Z0-9_-]/g, "_")
                .substring(0, 50);
            const uniqueName = `${baseName}_${Date.now()}${ext}`;

            // Write to disk
            const bytes = await file.arrayBuffer();
            const filePath = path.join(uploadDir, uniqueName);
            await writeFile(filePath, Buffer.from(bytes));

            // Return public URL path
            uploaded.push(`/uploads/${uniqueName}`);
        }

        return NextResponse.json({ urls: uploaded }, { status: 200 });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
