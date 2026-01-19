import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/connection';

const router = express.Router();

// Route pubblica: ottieni servizi visibili (per clienti)
router.get('/public', async (req: express.Request, res: Response) => {
  try {
    const { data: services, error } = await supabase
      .from('services')
      .select('id, name, description, price, duration_minutes')
      .eq('is_visible', true)
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({ services });
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
    const { data: services, error } = await supabase
      .from('services')
      .select('id, name, description, price, duration_minutes, is_visible, created_at, updated_at')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json({ services });
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

      const { data: service, error } = await supabase
        .from('services')
        .insert({
          name,
          description: description || null,
          price,
          duration_minutes: durationMinutes || 60,
          is_visible: isVisible !== undefined ? isVisible : true
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Servizio creato con successo',
        service,
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

      // Build dynamic update object
      const updates: any = { updated_at: new Date().toISOString() };

      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (price !== undefined) updates.price = price;
      if (durationMinutes !== undefined) updates.duration_minutes = durationMinutes;
      if (isVisible !== undefined) updates.is_visible = isVisible;

      const { data: service, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Supabase returns PG errors, check for not found implicitly if data is null
        throw error;
      }

      // If no data returned, it means no rows updated (not found)
      // BUT supabase .update().eq() returns empty array if not found, .single() throws error if multiple or none
      // So if error is PGRST116 (JSON object requested, multiple (or no) rows returned), it's likely not found given .eq('id', id)

      res.json({
        message: 'Servizio aggiornato con successo',
        service,
      });
    } catch (error: any) {
      console.error('Update service error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Servizio non trovato' });
      }
      res.status(500).json({ error: 'Errore nell\'aggiornamento del servizio' });
    }
  }
);

// Elimina servizio
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Servizio non trovato' });
    }

    res.json({ message: 'Servizio eliminato con successo' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Errore nella cancellazione del servizio' });
  }
});

export default router;


