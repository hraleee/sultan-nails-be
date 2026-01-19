import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

const router = express.Router();

// Route pubblica: ottieni servizi visibili (per clienti)
router.get('/public', async (req: express.Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, duration_minutes
       FROM services 
       WHERE is_visible = true
       ORDER BY name ASC`
    );

    res.json({ services: result.rows });
  } catch (error) {
    console.error('Get public services error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei servizi' });
  }
});

// Tutte le route seguenti richiedono autenticazione admin
router.use(authenticate);
router.use(requireAdmin);

// Ottieni tutti i servizi (admin)
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, duration_minutes, is_visible, created_at, updated_at
       FROM services 
       ORDER BY name ASC`
    );

    res.json({ services: result.rows });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({ error: 'Errore nel recupero dei servizi' });
  }
});

// Crea nuovo servizio
router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('durationMinutes').optional().isInt({ min: 1 }),
    body('description').optional().trim(),
    body('isVisible').optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description, price, durationMinutes, isVisible } = req.body;

      const result = await pool.query(
        `INSERT INTO services (name, description, price, duration_minutes, is_visible)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, description, price, duration_minutes, is_visible, created_at`,
        [
          name,
          description || null,
          price,
          durationMinutes || 60,
          isVisible !== undefined ? isVisible : true,
        ]
      );

      res.status(201).json({
        message: 'Servizio creato con successo',
        service: result.rows[0],
      });
    } catch (error) {
      console.error('Create service error:', error);
      res.status(500).json({ error: 'Errore nella creazione del servizio' });
    }
  }
);

// Aggiorna servizio
router.patch(
  '/:id',
  [
    body('name').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('durationMinutes').optional().isInt({ min: 1 }),
    body('description').optional().trim(),
    body('isVisible').optional().isBoolean(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description, price, durationMinutes, isVisible } = req.body;

      // Build dynamic update query
      const updates: string[] = [];
      const params: any[] = [];
      let paramCount = 1;

      if (name !== undefined) {
        updates.push(`name = $${paramCount}`);
        params.push(name);
        paramCount++;
      }
      if (description !== undefined) {
        updates.push(`description = $${paramCount}`);
        params.push(description);
        paramCount++;
      }
      if (price !== undefined) {
        updates.push(`price = $${paramCount}`);
        params.push(price);
        paramCount++;
      }
      if (durationMinutes !== undefined) {
        updates.push(`duration_minutes = $${paramCount}`);
        params.push(durationMinutes);
        paramCount++;
      }
      if (isVisible !== undefined) {
        updates.push(`is_visible = $${paramCount}`);
        params.push(isVisible);
        paramCount++;
      }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nessun campo da aggiornare' });
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      params.push(id);

      const query = `
        UPDATE services 
        SET ${updates.join(', ')}
        WHERE id = $${paramCount}
        RETURNING id, name, description, price, duration_minutes, is_visible, created_at, updated_at
      `;

      const result = await pool.query(query, params);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Servizio non trovato' });
      }

      res.json({
        message: 'Servizio aggiornato con successo',
        service: result.rows[0],
      });
    } catch (error) {
      console.error('Update service error:', error);
      res.status(500).json({ error: 'Errore nell\'aggiornamento del servizio' });
    }
  }
);

// Elimina servizio
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM services 
       WHERE id = $1 
       RETURNING id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Servizio non trovato' });
    }

    res.json({ message: 'Servizio eliminato con successo' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Errore nella cancellazione del servizio' });
  }
});

export default router;

