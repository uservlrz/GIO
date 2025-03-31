    // src/supabase/client.js
    import { createClient } from '@supabase/supabase-js';

    // Substitua com suas credenciais do Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_ANON_KEY;

    // Cria o cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    export default supabase;