// Script per testare la connessione al database
import { pool } from './connection';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    console.log('✅ Database connected successfully!');
    console.log('⏰ Current time:', result.rows[0].current_time);
    console.log('📦 PostgreSQL version:', result.rows[0].version.split(',')[0]);
    
    // Test if tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tablesCheck.rows.length > 0) {
      console.log('📋 Existing tables:', tablesCheck.rows.map(r => r.table_name).join(', '));
    } else {
      console.log('⚠️  No tables found. Run "npm run migrate" to create tables.');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Check:');
    console.error('1. PostgreSQL is running');
    console.error('2. DATABASE_URL in .env is correct');
    console.error('3. Database exists');
    process.exit(1);
  }
}

testConnection();

