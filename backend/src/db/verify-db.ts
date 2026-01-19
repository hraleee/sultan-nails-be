
import { pool } from './connection';

const verify = async () => {
    try {
        console.log('Testing SELECT from bookings...');
        const res = await pool.query('SELECT * FROM bookings LIMIT 1');
        console.log('✅ SELECT successful. Rows:', res.rows);
        process.exit(0);
    } catch (error) {
        console.error('❌ SELECT failed:', error);
        process.exit(1);
    }
};

verify();
