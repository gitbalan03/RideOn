// ============================================================
// RIDEON - SUPABASE CONNECTION
// ============================================================

// Supabase CDN is loaded in HTML before this file.
//
// Example:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="js/supabase.js"></script>

// Your Supabase project URL
const SUPABASE_URL = "https://zilntbrndcihygtvtqys.supabase.co";

// Your Supabase Publishable / Anon Key
const SUPABASE_ANON_KEY = "sb_publishable_vNjn6xdg8ToRVMI9e9bQhw_imPUiTbN";

// Create Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("RideOn Supabase connected successfully");