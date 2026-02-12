
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    // 1. Check Authentication
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        // We don't strictly need the 'path' param anymore for local storage structure, 
        // but we can use it to help name the file if we want, or just generate a unique name.
        // Let's generate a unique name to prevent collisions.

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = file.name.replace(/\s/g, "_"); // Sanitize filename
        const uniqueName = `${Date.now()}_${filename}`;

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Write file
        const filePath = path.join(uploadDir, uniqueName);
        await writeFile(filePath, buffer);

        // Return public URL
        const publicUrl = `/uploads/${uniqueName}`;

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
