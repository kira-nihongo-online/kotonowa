const SUPABASE_URL =
  "https://mnihrwoukhvounsxxbvj.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_0InGDN60i6TuNz62X9rFiA_KiyxAqVx";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
