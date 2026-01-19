import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

const router = express.Router();

// Tutte le route richiedono autenticazione admin
router.use(authenticate);
router.use(requireAdmin);

// Funzione helper per aggiornare automaticamente le prenotazioni scadute
const updateExpiredBookings = async () => {
  try {
    const now = new Date();
    const result = await pool.query(
      `UPDATE bookings 
       SET status = 'completed', updated_at = CURRENT_TIMESTAMP
       WHERE booking_date < $1 
       AND status IN ('pending', 'confirmed')
       RETURNING id`,
      [now]
    );
    
    if (result.rows.length > 0) {
      console.log(`✅ Auto-completate ${result.rows.length} prenotazioni scadute`);
    }
  } catch (error) {
    console.error('Error updating expired bookings:', error);
  }
};

// Ottieni tutte le prenotazioni (admin)
router.get('/bookings', async (req: AuthRequest, res: Response) => {
  try {
    // Aggiorna automaticamente le prenotazioni scadute
    await updateExpiredBookings();

    const { status, from, to } = req.query;

    let query = `
      SELECT 
        b.id, b.service_id, b.service_name, b.service_price, b.booking_date, 
        b.duration_minutes, b.status, b.notes, b.created_at,
        u.id as user_id, u.email, u.first_name, u.last_name, u.phone
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramCount = 1;

    if (status) {
      query += ` AND b.status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (from) {
      query += ` AND b.booking_date >= $${paramCount}`;
      params.push(from);
      paramCount++;
    }

    if (to) {
      query += ` AND b.booking_date <= $${paramCount}`;
      params.push(to);
      paramCount++;
    }

    query += ' ORDER BY b.booking_date DESC';

    const result = await pool.query(query, params);

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle prenotazioni' });
  }
});

// Crea prenotazione (admin)
router.post(
  '/bookings',
  [
    body('serviceName').trim().notEmpty(),
    body('bookingDate').isISO8601(),
    body('userId').isInt(),
    body('servicePrice').optional().isFloat({ min: 0 }),
    body('durationMinutes').optional().isInt({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { serviceName, servicePrice, bookingDate, durationMinutes, notes, userId } = req.body;

      // Check if date is in the past
      const bookingDateTime = new Date(bookingDate);
      if (bookingDateTime < new Date()) {
        return res.status(400).json({ error: 'Non puoi creare una prenotazione nel passato' });
      }

      // Check for overlapping bookings
      const existingBookings = await pool.query(
        `SELECT id FROM bookings 
         WHERE booking_date = $1 
         AND status IN ('pending', 'confirmed')
         LIMIT 1`,
        [bookingDate]
      );

      if (existingBookings.rows.length > 0) {
        return res.status(400).json({ error: 'Data e ora già prenotate' });
      }

      // Try to find service by name to get service_id
      let serviceId = null;
      if (serviceName) {
        const serviceResult = await pool.query(
          'SELECT id FROM services WHERE name = $1 LIMIT 1',
          [serviceName]
        );
        if (serviceResult.rows.length > 0) {
          serviceId = serviceResult.rows[0].id;
        }
      }

      const result = await pool.query(
        `INSERT INTO bookings 
         (user_id, service_id, service_name, service_price, booking_date, duration_minutes, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
         RETURNING id, service_id, service_name, service_price, booking_date, duration_minutes, status, notes, created_at`,
        [
          userId,
          serviceId,
          serviceName,
          servicePrice || null,
          bookingDate,
          durationMinutes || 60,
          notes || null,
        ]
      );

      res.status(201).json({
        message: 'Prenotazione creata con successo',
        booking: result.rows[0],
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({ error: 'Errore nella creazione della prenotazione' });
    }
  }
);

// Aggiorna stato prenotazione (admin)
router.patch(
  '/bookings/:id/status',
  [body('status').isIn(['pending', 'confirmed', 'completed', 'cancelled'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status } = req.body;
      const { id } = req.params;

      const result = await pool.query(
        `UPDATE bookings 
         SET status = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2 
         RETURNING id, status`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      res.json({
        message: 'Stato prenotazione aggiornato',
        booking: result.rows[0],
      });
    } catch (error) {
      console.error('Update booking status error:', error);
      res.status(500).json({ error: 'Errore nell\'aggiornamento della prenotazione' });
    }
  }
);

// Ottieni tutti gli utenti (admin)
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, email, first_name, last_name, phone, role, created_at
       FROM users 
       ORDER BY created_at DESC`
    );

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Errore nel recupero degli utenti' });
  }
});

// Statistiche (admin)
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [bookingsStats, usersStats, recentBookings] = await Promise.all([
      pool.query(`
        SELECT 
          status, 
          COUNT(*) as count 
        FROM bookings 
        GROUP BY status
      `),
      pool.query('SELECT COUNT(*) as total FROM users WHERE role = $1', ['user']),
      pool.query(`
        SELECT COUNT(*) as count 
        FROM bookings 
        WHERE booking_date >= CURRENT_DATE
      `),
    ]);

    res.json({
      bookings: {
        byStatus: bookingsStats.rows,
        upcoming: parseInt(recentBookings.rows[0].count),
      },
      users: {
        total: parseInt(usersStats.rows[0].total),
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
});

export default router;

