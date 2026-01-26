import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxbqcwgvoqripawwoowg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4YnFjd2d2b3FyaXBhd3dvb3dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMTM5MjYsImV4cCI6MjA4NDY4OTkyNn0.PMsGuEwPTJ1knZM1wJTmVkLrf4j5I0rp2KqTVBWQ5oo';

export const supabase = createClient(supabaseUrl, supabaseKey);
