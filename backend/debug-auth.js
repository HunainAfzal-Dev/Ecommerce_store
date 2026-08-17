/**
 * Debug script - tests Supabase connection + user insert
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

console.log('\n========== DEBUG AUTH ==========');
console.log('1. SUPABASE_URL:', url);
console.log('2. SUPABASE_KEY:', key ? `${key.substring(0, 20)}...` : 'MISSING');
console.log('3. SUPABASE_KEY length:', key ? key.length : 0);
console.log('4. Key starts with "eyJ"?', key ? key.startsWith('eyJ') : false);
console.log('================================\n');

const supabase = createClient(url, key);

async function runTests() {
    // Test 1: Can we reach Supabase at all?
    console.log('--- TEST 1: Basic SELECT from users table ---');
    const { data: selectData, error: selectError } = await supabase
        .from('users')
        .select('id')
        .limit(1);
    
    if (selectError) {
        console.log('❌ SELECT FAILED:', JSON.stringify(selectError, null, 2));
    } else {
        console.log('✅ SELECT OK. Rows returned:', selectData ? selectData.length : 0);
    }

    // Test 2: Try INSERT (the exact operation that's failing)
    console.log('\n--- TEST 2: INSERT into users table ---');
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('TestPass123!', salt);

    const { data: insertData, error: insertError } = await supabase
        .from('users')
        .insert([{
            name: 'Test Debug User',
            email: 'debug-test-' + Date.now() + '@test.com',
            password_hash: hash,
            role: 'customer'
        }])
        .select('id, name, email, role, created_at');

    if (insertError) {
        console.log('❌ INSERT FAILED!');
        console.log('   Error message:', insertError.message);
        console.log('   Error details:', insertError.details);
        console.log('   Error hint:', insertError.hint);
        console.log('   Error code:', insertError.code);
        console.log('   Full error:', JSON.stringify(insertError, null, 2));
    } else {
        console.log('✅ INSERT OK:', JSON.stringify(insertData, null, 2));
        
        // Clean up test user
        if (insertData && insertData[0]) {
            await supabase.from('users').delete().eq('id', insertData[0].id);
            console.log('   (test user cleaned up)');
        }
    }

    // Test 3: Check if users table exists and has the right columns
    console.log('\n--- TEST 3: Check table structure ---');
    const { data: colData, error: colError } = await supabase.rpc('to_regclass', { 
        name: 'public.users' 
    }).maybeSingle();
    
    // Alternative: just try selecting all columns
    const { data: schemaData, error: schemaError } = await supabase
        .from('users')
        .select('*')
        .limit(0);
    
    if (schemaError) {
        console.log('❌ Schema check failed:', schemaError.message);
    } else {
        console.log('✅ Table "users" is accessible');
    }

    console.log('\n========== DONE ==========\n');
}

runTests().catch(err => {
    console.log('💥 UNHANDLED ERROR:', err.message);
    console.log(err);
});
