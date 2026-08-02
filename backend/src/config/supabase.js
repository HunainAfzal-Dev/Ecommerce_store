/**
 * 🗄️ Supabase Client Configuration
 *
 * Creates and exports a single Supabase client instance.
 */

const { createClient } = require('@supabase/supabase-js');
const AppError = require('../utils/AppError');

require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new AppError(
        'SUPABASE_URL and SUPABASE_KEY must be defined in .env file. ' +
        'Copy .env.example to .env and fill in your Supabase project credentials.',
        500
    );
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;

