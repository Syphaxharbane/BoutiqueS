const SUPABASE_URL = "https://wcywehfmnvcehgihgqsk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_nFQ8XXdhLqhmmpq2x8Yf7w_wEj1rht2";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
