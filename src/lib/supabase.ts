import { createClient } from '@supabase/supabase-js';

// Remplacer ces informations par celles fournies par l'utilisateur
const supabaseUrl = 'https://kotyxwzalmqdwmhnsyxv.supabase.co';
const supabaseKey = 'sb_publishable_FGmE2-nIx2QsR8f2Yi2g_Q_TY9cxO59';

export const supabase = createClient(supabaseUrl, supabaseKey);
