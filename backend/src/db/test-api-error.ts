
import jwt from 'jsonwebtoken';
// import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { pool } from './connection';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production-12345';

const runTest = async () => {
    try {
        const userRes = await pool.query('SELECT * FROM users LIMIT 1');
        let user = userRes.rows[0];

        if (!user) {
            console.error('❌ Nessun utente trovato.');
            process.exit(1);
        }

        console.log(`Testing with user: ${user.email}`);

        // INSERT EXPIRED BOOKING
        console.log('Inserimento prenotazione scaduta...');
        await pool.query(`
            INSERT INTO bookings (user_id, service_name, service_price, booking_date, duration_minutes, status)
            VALUES ($1, 'Test Service', 50.00, NOW() - INTERVAL '2 days', 60, 'pending')
        `, [user.id]);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Calling GET /api/bookings...');
        const res = await fetch(`${API_URL}/bookings`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = (await res.json()) as any;
        console.log('Status:', res.status);
        if (res.status !== 200) {
            console.log('Details:', data.details || data.message || data);
        } else {
            console.log('Success (no error triggered). Bookings:', data.bookings?.length);
        }

    } catch (error: any) {
        console.error('Test failed message:', error.message);
        console.error('Test failed stack:', error.stack);
        if (error.cause) console.error('Cause:', error.cause);
    } finally {
        // Cleanup optional but good practice
        // await pool.query('DELETE FROM bookings WHERE service_name = $1', ['Test Service']);
        pool.end();
    }
};

runTest();
