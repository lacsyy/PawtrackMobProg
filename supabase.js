import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://khjljoizwczayueehwyn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtoamxqb2l6d2N6YXl1ZWVod3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMzAzODMsImV4cCI6MjA3NzkwNjM4M30.eAv0nHrxSlhbReVVBfIzro9cvkHqq6UV_N0a1yNoufk";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
