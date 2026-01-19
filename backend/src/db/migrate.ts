import { pool } from './connection';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        is_verified BOOLEAN DEFAULT FALSE,
        verification_code VARCHAR(6),
        verification_expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Services table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        is_visible BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Bookings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
        service_name VARCHAR(255) NOT NULL,
        service_price DECIMAL(10, 2),
        booking_date TIMESTAMP NOT NULL,
        duration_minutes INTEGER DEFAULT 60,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Password Resets table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        otp_code VARCHAR(6) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for faster queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
      CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_services_visible ON services(is_visible);
    `);

    // Create default services if not exist
    const servicesCheck = await pool.query('SELECT id FROM services LIMIT 1');
    if (servicesCheck.rows.length === 0) {
      await pool.query(`
        INSERT INTO services (name, description, price, duration_minutes, is_visible) VALUES
        ('Signature Gel', 'Copertura gel ultra-sottile con durata 3+ settimane', 60.00, 90, true),
        ('Luxe Manicure Spa', 'Esfoliazione, massaggio e smalto long-wear', 55.00, 75, true),
        ('Nail Art Couture', 'Design su misura con pigmenti specchio premium', 80.00, 120, true),
        ('Pedicure Spa', 'Trattamento completo piedi con massaggio', 65.00, 90, true)
      `);
      console.log('✅ Default services created');
    }

    console.log('✅ Database tables created successfully');

    // Create default admin user if not exists
    const adminCheck = await pool.query('SELECT id FROM users WHERE email = $1', ['admin@sultan-nails.it']);

    if (adminCheck.rows.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Admin is verified by default
      await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role, is_verified) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['admin@sultan-nails.it', hashedPassword, 'Admin', 'Sultan', 'admin', true]
      );

      console.log('✅ Default admin user created (email: admin@sultan-nails.it, password: admin123)');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

createTables();


