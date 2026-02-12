
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase Service Key or URL.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
    console.log("Creating 'portfolio' bucket...");
    const { data, error } = await supabase.storage.createBucket('portfolio', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    });

    if (error) {
        if (error.message.includes("already exists")) {
            console.log("Bucket 'portfolio' already exists.");
        } else {
            console.error("Error creating bucket:", error);
        }
    } else {
        console.log("Bucket 'portfolio' created successfully:", data);
    }

    // Double check it exists now
    const { data: buckets } = await supabase.storage.listBuckets();
    console.log("Buckets now:", buckets?.map(b => b.name));
}

setupStorage();
