
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkStorage() {
    console.log("Checking storage buckets...");
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
        console.error("Error listing buckets:", listError);
    } else {
        console.log("Buckets found:", buckets.map(b => b.name));
        const portfolioExists = buckets.some(b => b.name === 'portfolio');
        console.log("Portfolio bucket exists:", portfolioExists);

        if (portfolioExists) {
            console.log("Attempting upload test...");
            const { data, error: uploadError } = await supabase.storage.from("portfolio").upload("test_verify.txt", "verification test", {
                upsert: true
            });

            if (uploadError) {
                console.error("Upload failed:", uploadError);
            } else {
                console.log("Upload successful:", data);
            }
        }
    }
}

checkStorage();
