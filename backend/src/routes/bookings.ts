import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

const router = express.Router();

// Tutte le route richiedono autenticazione
router.use(authenticate);

// Funzione helper per aggiornare automaticamente le prenotazioni scadute
const updateExpiredBookings = async (userId?: number) => {
  try {
    const now = new Date();
    let query = `
      UPDATE bookings 
      SET status = 'completed', updated_at = CURRENT_TIMESTAMP
      WHERE booking_date < $1 
      AND status IN ('pending', 'confirmed')
    `;
    const params: any[] = [now];

    if (userId) {
      query += ` AND user_id = $2`;
      params.push(userId);
    }

    query += ` RETURNING id`;

    const result = await pool.query(query, params);

    if (result.rows.length > 0) {
      console.log(`✅ Auto-completate ${result.rows.length} prenotazioni scadute`);
    }
  } catch (error) {
    console.error('Error updating expired bookings:', error);
  }
};

// Ottieni tutte le prenotazioni dell'utente
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    // Aggiorna automaticamente le prenotazioni scadute dell'utente
    await updateExpiredBookings(req.user!.id);

    const result = await pool.query(
      `SELECT 
        id, 
        service_name as "serviceName", 
        service_price as "servicePrice", 
        booking_date as "bookingDate", 
        duration_minutes as "durationMinutes", 
        status, 
        notes, 
        created_at as "createdAt"
       FROM bookings 
       WHERE user_id = $1 
       ORDER BY booking_date DESC`,
      [req.user!.id]
    );

    res.json({ bookings: result.rows });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      error: 'Errore nel recupero delle prenotazioni',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Crea una nuova prenotazione
router.post(
  '/',
  [
    body('serviceName').trim().notEmpty(),
    body('bookingDate').isISO8601(),
    body('servicePrice').optional().isFloat({ min: 0 }),
    body('durationMinutes').optional().isInt({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { serviceName, servicePrice, bookingDate, durationMinutes, notes } = req.body;

      // Check if date is in the past
      const bookingDateTime = new Date(bookingDate);
      if (bookingDateTime < new Date()) {
        return res.status(400).json({ error: 'Non puoi prenotare una data nel passato' });
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

      const result = await pool.query(
        `INSERT INTO bookings 
         (user_id, service_id, service_name, service_price, booking_date, duration_minutes, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
         RETURNING 
           id, 
           service_id as "serviceId", 
           service_name as "serviceName", 
           service_price as "servicePrice", 
           booking_date as "bookingDate", 
           duration_minutes as "durationMinutes", 
           status, 
           notes, 
           created_at as "createdAt"`,
        [
          req.user!.id,
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

// Ottieni disponibilità (slot occupati) per il calendario
router.get('/availability', async (req: AuthRequest, res: Response) => {
  try {
    const { from, to } = req.query;

    // Aggiorna scadenze
    await updateExpiredBookings();

    let query = `
      SELECT booking_date, duration_minutes 
      FROM bookings 
      WHERE status IN ('pending', 'confirmed')
    `;

    const params: any[] = [];

    if (from) {
      query += ` AND booking_date >= $${params.length + 1}`;
      params.push(from);
    }

    if (to) {
      query += ` AND booking_date <= $${params.length + 1}`;
      params.push(to);
    }

    const result = await pool.query(query, params);

    res.json({ slots: result.rows });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      error: 'Errore nel recupero della disponibilità',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Ottieni una singola prenotazione
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, 
        service_name as "serviceName", 
        service_price as "servicePrice", 
        booking_date as "bookingDate", 
        duration_minutes as "durationMinutes", 
        status, 
        notes, 
        created_at as "createdAt"
       FROM bookings 
       WHERE id = $1 AND user_id = $2`,
      [req.params.id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    res.json({ booking: result.rows[0] });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Errore nel recupero della prenotazione' });
  }
});

// Cancella una prenotazione
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `DELETE FROM bookings 
       WHERE id = $1 AND user_id = $2 
       RETURNING id`,
      [req.params.id, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    res.json({ message: 'Prenotazione cancellata con successo' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ error: 'Errore nella cancellazione della prenotazione' });
  }
});



// Modifica una prenotazione
router.patch('/:id',
  [
    body('bookingDate').optional().isISO8601(),
    body('servicePrice').optional().isFloat({ min: 0 }),
    body('durationMinutes').optional().isInt({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { serviceName, servicePrice, bookingDate, durationMinutes, notes } = req.body;
      const bookingId = req.params.id;
      const userId = req.user!.id;

      // Verify ownership and existence
      const existing = await pool.query(
        'SELECT * FROM bookings WHERE id = $1 AND user_id = $2',
        [bookingId, userId]
      );

      if (existing.rows.length === 0) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      // If changing date, validate
      if (bookingDate) {
        const newDate = new Date(bookingDate);
        if (newDate < new Date()) {
          return res.status(400).json({ error: 'Non puoi spostare la prenotazione nel passato' });
        }

        // Check overlap (excluding this booking)
        const overlap = await pool.query(
          `SELECT id FROM bookings 
         WHERE booking_date = $1 
         AND status IN ('pending', 'confirmed')
         AND id != $2
         LIMIT 1`,
          [bookingDate, bookingId]
        );

        if (overlap.rows.length > 0) {
          return res.status(400).json({ error: 'Data e ora già occupate' });
        }
      }

      // Build update query dynamically
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (serviceName) { updates.push(`service_name = $${paramIndex++}`); values.push(serviceName); }
      if (servicePrice !== undefined) { updates.push(`service_price = $${paramIndex++}`); values.push(servicePrice); }
      if (bookingDate) { updates.push(`booking_date = $${paramIndex++}`); values.push(bookingDate); }
      if (durationMinutes) { updates.push(`duration_minutes = $${paramIndex++}`); values.push(durationMinutes); }
      if (notes !== undefined) { updates.push(`notes = $${paramIndex++}`); values.push(notes); }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);

      values.push(bookingId);
      values.push(userId);

      const result = await pool.query(
        `UPDATE bookings 
       SET ${updates.join(', ')}
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
       RETURNING 
         id, 
         service_id as "serviceId", 
         service_name as "serviceName", 
         service_price as "servicePrice", 
         booking_date as "bookingDate", 
         duration_minutes as "durationMinutes", 
         status, 
         notes, 
         created_at as "createdAt",
         updated_at as "updatedAt"`,
        values
      );

      res.json({ message: 'Prenotazione aggiornata', booking: result.rows[0] });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Errore nella modifica della prenotazione' });
    }
  });

export default router;


