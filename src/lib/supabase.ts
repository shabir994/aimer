import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get the functions URL with proper formatting
export const getFunctionsUrl = (functionName: string) => {
  // Remove any trailing slashes from the URL
  const baseUrl = supabaseUrl.replace(/\/+$/, '');
  return `${baseUrl}/functions/v1/${functionName}`;
};

// Helper function to get the default headers for function calls
export const getFunctionHeaders = () => ({
  'Authorization': `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
  // Add additional headers that might be needed for CORS
  'Accept': 'application/json'
});