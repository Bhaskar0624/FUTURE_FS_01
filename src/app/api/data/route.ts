import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: Request) {
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const [profileRes, projectsRes, experiencesRes, skillsRes, certsRes] = await Promise.all([
            supabase.from("profile").select("*").limit(1).single(),
            supabase.from("projects").select("*").order("sort_order"),
            supabase.from("experiences").select("*").order("sort_order"),
            supabase.from("skills").select("*").order("sort_order"),
            supabase.from("certificates").select("*").order("sort_order"),
        ]);

        return NextResponse.json({
            profile: profileRes.data || {},
            projects: projectsRes.data || [],
            experiences: experiencesRes.data || [],
            skills: skillsRes.data || [],
            certificates: certsRes.data || []
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const body = await request.json();
        const { section, data } = body;

        if (!section || data === undefined) {
            return NextResponse.json({ error: "Missing section or data" }, { status: 400 });
        }

        let result;

        if (section === "profile") {
            // Update profile (single record)
            // First, get the existing profile ID
            const { data: existingProfile } = await supabase
                .from("profile")
                .select("id")
                .limit(1)
                .single();

            if (!existingProfile) {
                return NextResponse.json({ error: "Profile not found" }, { status: 404 });
            }

            const profileData = { ...data };
            delete profileData.id; // Don't update ID
            delete profileData.created_at; // Don't update created_at

            result = await supabase
                .from("profile")
                .update(profileData)
                .eq("id", existingProfile.id);
        } else {
            // For arrays (projects, experiences, skills, certificates)
            const tableName = section;

            // Delete existing records
            await supabase.from(tableName).delete().neq("id", "00000000-0000-0000-0000-000000000000");

            // Insert new records - remove IDs to let Supabase generate new ones
            if (Array.isArray(data) && data.length > 0) {
                const cleanData = data.map(item => {
                    const { id, created_at, ...rest } = item;
                    return rest;
                });
                result = await supabase.from(tableName).insert(cleanData);
            } else {
                result = { error: null };
            }
        }

        if (result.error) throw result.error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error updating data:", error);
        return NextResponse.json({ error: error.message || "Update failed" }, { status: 500 });
    }
}
