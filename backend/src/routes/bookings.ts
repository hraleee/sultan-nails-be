import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/connection';

const router = express.Router();

// Tutte le route richiedono autenticazione
router.use(authenticate);

// Funzione helper per aggiornare automaticamente le prenotazioni scadute
const updateExpiredBookings = async (userId?: number) => {
  try {
    const now = new Date().toISOString();

    let query = supabase
      .from('bookings')
      .update({ status: 'completed', updated_at: now })
      .lt('booking_date', now)
      .in('status', ['pending', 'confirmed']);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    // Note: Supabase update doesn't return rows by default unless .select() is used
    const { data, error } = await query.select('id');

    if (!error && data && data.length > 0) {
      console.log(`✅ Auto-completate ${data.length} prenotazioni scadute`);
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

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id, 
        serviceName:service_name, 
        servicePrice:service_price, 
        bookingDate:booking_date, 
        durationMinutes:duration_minutes, 
        status, 
        notes, 
        createdAt:created_at
      `)
      .eq('user_id', req.user!.id)
      .order('booking_date', { ascending: false });

    if (error) throw error;

    res.json({ bookings });
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
        const { data: service } = await supabase
          .from('services')
          .select('id')
          .eq('name', serviceName)
          .maybeSingle(); // Use maybeSingle to avoid 406 on multiple matches

        if (service) {
          serviceId = service.id;
        }
      }

      // Check for overlapping bookings
      // We look for any booking at the same exact time
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', bookingDate)
        .in('status', ['pending', 'confirmed'])
        .limit(1);

      if (existingBookings && existingBookings.length > 0) {
        return res.status(400).json({ error: 'Data e ora già prenotate' });
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: req.user!.id,
          service_id: serviceId,
          service_name: serviceName,
          service_price: servicePrice || null,
          booking_date: bookingDate,
          duration_minutes: durationMinutes || 60,
          notes: notes || null,
          status: 'pending'
        })
        .select(`
          id, 
          serviceId:service_id, 
          serviceName:service_name, 
          servicePrice:service_price, 
          bookingDate:booking_date, 
          durationMinutes:duration_minutes, 
          status, 
          notes, 
          createdAt:created_at
        `)
        .single();

      if (error) throw error;

      res.status(201).json({
        message: 'Prenotazione creata con successo',
        booking,
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

    let query = supabase
      .from('bookings')
      .select('booking_date, duration_minutes')
      .in('status', ['pending', 'confirmed']);

    if (from) {
      query = query.gte('booking_date', from);
    }

    if (to) {
      query = query.lte('booking_date', to);
    }

    const { data: slots, error } = await query;

    if (error) throw error;

    res.json({ slots });
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
    const { data: booking, error } = await supabase
      .from('bookings')
      .select(`
        id, 
        serviceName:service_name, 
        servicePrice:service_price, 
        bookingDate:booking_date, 
        durationMinutes:duration_minutes, 
        status, 
        notes, 
        createdAt:created_at
      `)
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .maybeSingle();

    if (error) throw error;

    if (!booking) {
      return res.status(404).json({ error: 'Prenotazione non trovata' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Errore nel recupero della prenotazione' });
  }
});

// Cancella una prenotazione
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.user!.id)
      .select('id'); // Returning id to confirm deletion

    if (error) throw error;

    if (!data || data.length === 0) {
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
      const { data: existing, error: fetchError } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!existing) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      // If changing date, validate
      if (bookingDate) {
        const newDate = new Date(bookingDate);
        if (newDate < new Date()) {
          return res.status(400).json({ error: 'Non puoi spostare la prenotazione nel passato' });
        }

        // Check overlap (excluding this booking)
        const { data: overlap } = await supabase
          .from('bookings')
          .select('id')
          .eq('booking_date', bookingDate)
          .in('status', ['pending', 'confirmed'])
          .neq('id', bookingId)
          .limit(1);

        if (overlap && overlap.length > 0) {
          return res.status(400).json({ error: 'Data e ora già occupate' });
        }
      }

      // Build update object
      const updates: any = { updated_at: new Date().toISOString() };

      if (serviceName) updates.service_name = serviceName;
      if (servicePrice !== undefined) updates.service_price = servicePrice;
      if (bookingDate) updates.booking_date = bookingDate;
      if (durationMinutes) updates.duration_minutes = durationMinutes;
      if (notes !== undefined) updates.notes = notes;

      const { data: booking, error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', bookingId)
        .eq('user_id', userId)
        .select(`
          id, 
          serviceId:service_id, 
          serviceName:service_name, 
          servicePrice:service_price, 
          bookingDate:booking_date, 
          durationMinutes:duration_minutes, 
          status, 
          notes, 
          createdAt:created_at,
          updatedAt:updated_at
        `)
        .single();

      if (updateError) throw updateError;

      res.json({ message: 'Prenotazione aggiornata', booking });
    } catch (error) {
      console.error('Update booking error:', error);
      res.status(500).json({ error: 'Errore nella modifica della prenotazione' });
    }
  });

export default router;



