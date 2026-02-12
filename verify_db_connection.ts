
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables.");
    console.log("URL:", supabaseUrl);
    console.log("Key:", supabaseAnonKey ? "Present (hidden)" : "Missing");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
    console.log("Testing connection to:", supabaseUrl);
    try {
        const { data, error } = await supabase.from("profile").select("*").limit(1);
        if (error) {
            console.error("Connection failed:", error.message);
            console.error("Details:", error);
        } else {
            console.log("Connection successful!");
            console.log("Data received:", data);
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        console.error(err);
    }
}

checkConnection();
