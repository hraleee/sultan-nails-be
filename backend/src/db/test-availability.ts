
import { pool } from './connection';

async function checkAvailability() {
    try {
        console.log('Testing availability query directly...');

        // Cerchiamo prenotazioni future
        const res = await pool.query(`
        SELECT id, booking_date, duration_minutes, status 
        FROM bookings 
        WHERE status IN ('pending', 'confirmed')
        ORDER BY booking_date ASC
    `);

        console.log('All future bookings in DB:', res.rows.map(r => ({
            id: r.id,
            date: r.booking_date, // Log raw date from DB
            status: r.status
        })));

        // Simuliamo la query dell'endpoint
        const from = new Date();
        from.setMonth(from.getMonth() - 1); // 1 mese fa
        const to = new Date();
        to.setMonth(to.getMonth() + 2); // tra 2 mesi

        const query = `
      SELECT booking_date, duration_minutes 
      FROM bookings 
      WHERE status IN ('pending', 'confirmed')
      AND booking_date >= $1 AND booking_date <= $2
    `;

        const apiRes = await pool.query(query, [from, to]);
        console.log(`\nQuery with date range (${from.toISOString()} - ${to.toISOString()}):`);
        console.log('Result count:', apiRes.rowCount);
        console.log('Rows:', apiRes.rows);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await pool.end();
    }
}

checkAvailability();
