import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(" Missing Supabase credentials!");
  console.error("VITE_SUPABASE_URL:", supabaseUrl ? " Set" : " Missing");
  console.error(
    "VITE_SUPABASE_ANON_KEY:",
    supabaseAnonKey ? " Set" : "❌ Missing"
  );
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file.\n" +
      "Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY"
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch {
  console.error(" Invalid VITE_SUPABASE_URL format:", supabaseUrl);
  throw new Error("VITE_SUPABASE_URL must be a valid URL");
}

console.log(" Supabase config loaded");
console.log(" Supabase URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
