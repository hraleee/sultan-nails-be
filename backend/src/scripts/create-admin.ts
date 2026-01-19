
import { supabase } from '../db/connection';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    const email = 'laura.sultanian@gmail.com'; // Email utente
    const password = 'barsik2005'; // Password utente

    console.log(`Configuring admin user: ${email}...`);

    // 1. Hash password with Node.js bcrypt (Guaranteed compatibility)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Check if user exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    let error;

    if (existingUser) {
        // UPDATE existing user
        console.log('User exists using UPDATE...');
        const result = await supabase
            .from('users')
            .update({
                password_hash: passwordHash,
                role: 'admin',
                is_verified: true,
                first_name: 'Sultan',
                last_name: 'Admin'
            })
            .eq('email', email);
        error = result.error;
    } else {
        // INSERT new user
        console.log('User does not exist, creating new...');
        const result = await supabase
            .from('users')
            .insert({
                email,
                password_hash: passwordHash,
                first_name: 'Sultan',
                last_name: 'Admin',
                role: 'admin',
                is_verified: true,
                phone: '3330000000'
            });
        error = result.error;
    }

    if (error) {
        console.error('❌ Error:', error.message);
    } else {
        console.log('✅ Admin configured successfully!');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Password: ${password}`);
        console.log('Try to login now.');
    }
};

createAdmin();
