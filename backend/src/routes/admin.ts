import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/connection';

const router = express.Router();

// Tutte le route richiedono autenticazione admin
router.use(authenticate);
router.use(requireAdmin);

// Funzione helper per aggiornare automaticamente le prenotazioni scadute
const updateExpiredBookings = async () => {
  try {
    const now = new Date().toISOString();
    const { data } = await supabase
      .from('bookings')
      .update({ status: 'completed', updated_at: now })
      .lt('booking_date', now)
      .in('status', ['pending', 'confirmed'])
      .select('id');

    if (data && data.length > 0) {
      console.log(`✅ Auto-completate ${data.length} prenotazioni scadute`);
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

    let query = supabase
      .from('bookings')
      .select(`
        id, service_id, service_name, service_price, booking_date, 
        duration_minutes, status, notes, created_at,
        users (
          id, email, first_name, last_name, phone
        )
      `)
      .order('booking_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (from) {
      query = query.gte('booking_date', from);
    }

    if (to) {
      query = query.lte('booking_date', to);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Flatten logic to match previous SQL response structure
    const bookings = data.map((b: any) => ({
      id: b.id,
      service_id: b.service_id,
      service_name: b.service_name,
      service_price: b.service_price,
      booking_date: b.booking_date,
      duration_minutes: b.duration_minutes,
      status: b.status,
      notes: b.notes,
      created_at: b.created_at,
      user_id: b.users?.id,
      email: b.users?.email,
      first_name: b.users?.first_name,
      last_name: b.users?.last_name,
      phone: b.users?.phone,
    }));

    res.json({ bookings });
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
      const { data: existingBookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('booking_date', bookingDate)
        .in('status', ['pending', 'confirmed'])
        .limit(1);

      if (existingBookings && existingBookings.length > 0) {
        return res.status(400).json({ error: 'Data e ora già prenotate' });
      }

      // Try to find service by name to get service_id
      let serviceId = null;
      if (serviceName) {
        const { data: service } = await supabase
          .from('services')
          .select('id')
          .eq('name', serviceName)
          .maybeSingle();
        if (service) {
          serviceId = service.id;
        }
      }

      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          service_id: serviceId,
          service_name: serviceName,
          service_price: servicePrice || null,
          booking_date: bookingDate,
          duration_minutes: durationMinutes || 60,
          notes: notes || null,
          status: 'pending'
        })
        .select('id, service_id, service_name, service_price, booking_date, duration_minutes, status, notes, created_at')
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

      const { data: booking, error } = await supabase
        .from('bookings')
        .update({ status: status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, status')
        .single();

      if (error) throw error; // Will throw if not found (because single() implies 1 row) ? No, single() throws if 0 rows. Correct.
      // Wait, supabase update response on empty match is empty array, single() throws 'JSON object requested, multiple (or no) rows returned'.
      // So we catch that.

      res.json({
        message: 'Stato prenotazione aggiornato',
        booking,
      });
    } catch (error: any) {
      console.error('Update booking status error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }
      res.status(500).json({ error: 'Errore nell\'aggiornamento della prenotazione' });
    }
  }
);

// Ottieni tutti gli utenti (admin)
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Errore nel recupero degli utenti' });
  }
});

// Statistiche (admin)
router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    const [bookingsStatusResult, usersCountResult, upcomingBookingsCountResult] = await Promise.all([
      // 1. Get all bookings statuses to manual aggregate
      supabase.from('bookings').select('status'),
      // 2. Count users
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      // 3. Count upcoming bookings
      supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('booking_date', today)
    ]);

    // Aggregation for bookings by status
    const statusCounts: Record<string, number> = {};
    if (bookingsStatusResult.data) {
      bookingsStatusResult.data.forEach((b: any) => {
        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
      });
    }

    // Convert map to array format: [{ status: '...', count: '...' }, ...]
    const byStatus = Object.entries(statusCounts).map(([status, count]) => ({ status, count: String(count) }));

    res.json({
      bookings: {
        byStatus,
        upcoming: upcomingBookingsCountResult.count || 0,
      },
      users: {
        total: usersCountResult.count || 0,
      },
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Errore nel recupero delle statistiche' });
  }
});

export default router;


