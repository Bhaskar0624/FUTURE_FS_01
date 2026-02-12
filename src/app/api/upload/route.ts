
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Client with Service Role Key for backend operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(request: Request) {
    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: "Server Configuration Error: Missing Supabase Keys" }, { status: 500 });
    }

    // 1. Check Authentication
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Sanitize filename and create unique ID
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Convert file to ArrayBuffer for Supabase
        const arrayBuffer = await file.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);

        // Upload to Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('uploads')
            .upload(filePath, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error("Supabase Storage Error:", error);
            throw new Error(error.message);
        }

        // Get Public URL
        const { data: { publicUrl } } = supabase
            .storage
            .from('uploads')
            .getPublicUrl(filePath);

        return NextResponse.json({ url: publicUrl });
    } catch (error: any) {
        console.error("Upload API Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
