import { pool } from './connection';

const addVerificationColumn = async () => {
    const alterTableQuery = `
    ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6),
    ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMP;
  `;

    const updateExistingUsersQuery = `
    UPDATE users SET is_verified = TRUE WHERE is_verified IS FALSE;
  `;

    try {
        const client = await pool.connect();
        console.log('Connected to database...');

        await client.query(alterTableQuery);
        console.log('Added verification columns to users table.');

        await client.query(updateExistingUsersQuery);
        console.log('Marked existing users as verified.');

        client.release();
    } catch (err) {
        console.error('Error updating schema:', err);
    } finally {
        pool.end();
    }
};

addVerificationColumn();
