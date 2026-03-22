// --- Supabase Client Setup ---
// Creates a single Supabase client that the whole app uses
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uhodzcdufzpultilxtjz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVob2R6Y2R1ZnpwdWx0aWx4dGp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NzAwOTksImV4cCI6MjA4ODU0NjA5OX0.dq9tVsqeVBV3nHekn-TRdsRR3ECc0JOTGAuxOnJbdAE'

export const supabase = createClient(supabaseUrl, supabaseKey)
