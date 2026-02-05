import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xxtzdciosrjqjojhkhis.supabase.co";
const supabaseAnonKey = "sb_publishable_Mwtonrg7a8FRt8sdlKd5pQ_f3JCkDO3";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
