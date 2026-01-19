
import { pool } from './connection';

const checkSchema = async () => {
  try {
    console.log('Verifying database schema...');
    
    // Check bookings table
    const tableRes = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'bookings'
      );
    `);
    
    if (!tableRes.rows[0].exists) {
        console.error('❌ Table "bookings" DOES NOT exist! Run migration.');
        process.exit(1);
    }
    console.log('✅ Table "bookings" exists.');

    // Check columns
    const columnsRes = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'bookings';
    `);

    const columns = columnsRes.rows.map((row: any) => row.column_name);
    console.log('Columns in bookings:', columns);

    if (!columns.includes('updated_at')) {
        console.error('❌ Column "updated_at" is MISSING in bookings table!');
    } else {
        console.log('✅ Column "updated_at" exists.');
    }

    // Try the problematic query with a dummy date
    try {
        const now = new Date();
        const query = `
          UPDATE bookings 
          SET status = 'completed', updated_at = CURRENT_TIMESTAMP
          WHERE booking_date < $1 
          AND status IN ('pending', 'confirmed')
          RETURNING id
        `;
        await pool.query(query, [now]);
        console.log('✅ updateExpiredBookings query executed successfully.');
    } catch (e: any) {
        console.error('❌ updateExpiredBookings query FAILED:', e.message);
    }

    process.exit(0);
  } catch (error) {
    console.error('Connection error:', error);
    process.exit(1);
  }
};

checkSchema();
