
import { pool } from './connection';

const verifyServiceId = async () => {
    try {
        const res = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'service_id'
        `);

        if (res.rows.length > 0) {
            console.log('✅ Column service_id FOUND in bookings table.');
        } else {
            console.error('❌ Column service_id NOT FOUND in bookings table.');
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

verifyServiceId();
