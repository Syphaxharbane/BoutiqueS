// 1) Crée ton projet Supabase.
// 2) Remplace les deux valeurs ci-dessous.
// IMPORTANT : la clé anon est faite pour être publique côté navigateur.
// La sécurité vient des règles RLS dans schema.sql.
const SUPABASE_URL = "https://TON-PROJET.supabase.co";
const SUPABASE_ANON_KEY = "TA_CLE_ANON";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
