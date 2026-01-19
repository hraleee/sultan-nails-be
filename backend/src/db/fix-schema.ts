
import { pool } from './connection';
import dotenv from 'dotenv';

dotenv.config();

const updateSchema2 = async () => {
    try {
        console.log('🔄 Checking and updating database schema (Part 2)...');

        // Fix missing service_id in bookings if table existed but was old
        console.log('--- Bookings Table Fix ---');
        await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS service_id INTEGER REFERENCES services(id) ON DELETE SET NULL;
    `);

        console.log('✅ Schema updated successfully (service_id added).');
        process.exit(0);
    } catch (error) {
        console.error('❌ Schema update failed:', error);
        process.exit(1);
    }
};

updateSchema2();
