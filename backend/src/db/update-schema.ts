
import { pool } from './connection';
import dotenv from 'dotenv';

dotenv.config();

const updateSchema = async () => {
    try {
        console.log('🔄 Checking and updating database schema...');

        // 1. SERVICES Table Updates
        console.log('--- Services Table ---');
        await pool.query(`
      ALTER TABLE services 
      ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
      ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

        // 2. USERS Table Updates
        console.log('--- Users Table ---');
        await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
      ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

        // 3. BOOKINGS Table Updates
        console.log('--- Bookings Table ---');
        await pool.query(`
      ALTER TABLE bookings 
      ADD COLUMN IF NOT EXISTS service_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS service_price DECIMAL(10, 2),
      ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60,
      ADD COLUMN IF NOT EXISTS notes TEXT,
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);

        // 4. Update constraints/types if needed (idempotent checks)
        // Ensure service_name is NOT NULL if possible, but only if we have data or defaults.
        // We skip strict constraint addition on existing columns to avoid errors with bad data.

        console.log('✅ Schema updated successfully (missing columns added).');

        process.exit(0);
    } catch (error) {
        console.error('❌ Schema update failed:', error);
        process.exit(1);
    }
};

updateSchema();
