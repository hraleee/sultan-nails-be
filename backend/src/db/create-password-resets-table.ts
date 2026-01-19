import { pool } from './connection';

const createPasswordResetsTable = async () => {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      otp_code VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

    try {
        const client = await pool.connect();
        console.log('Connected to database...');

        await client.query(createTableQuery);
        console.log('Created password_resets table successfully');

        client.release();
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        pool.end();
    }
};

createPasswordResetsTable();
