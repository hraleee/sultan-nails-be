
import { pool } from './connection';

const seedServices = async () => {
    try {
        const servicesCheck = await pool.query('SELECT count(*) FROM services');
        if (parseInt(servicesCheck.rows[0].count) === 0) {
            console.log('Seeding default services...');
            await pool.query(`
        INSERT INTO services (name, description, price, duration_minutes, is_visible) VALUES
        ('Signature Gel', 'Copertura gel ultra-sottile con durata 3+ settimane', 60.00, 90, true),
        ('Luxe Manicure Spa', 'Esfoliazione, massaggio e smalto long-wear', 55.00, 75, true),
        ('Nail Art Couture', 'Design su misura con pigmenti specchio premium', 80.00, 120, true),
        ('Pedicure Spa', 'Trattamento completo piedi con massaggio', 65.00, 90, true)
      `);
            console.log('✅ Services seeded.');
        } else {
            console.log('ℹ️ Services table not empty, skipping seed.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedServices();
