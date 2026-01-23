import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/connection';
import { emailService } from '../services/email';

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

      // Check Business Hours & Days
      const dayOfWeek = bookingDateTime.getDay();
      const hour = bookingDateTime.getHours();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return res.status(400).json({ error: 'Siamo chiusi nel weekend. Gli orari sono Lun-Ven 09:00 - 19:00.' });
      }

      if (hour < 9) {
        return res.status(400).json({ error: 'Orario non valido. Apriamo alle 09:00.' });
      }

      const duration = durationMinutes || 60;
      const endDateTime = new Date(bookingDateTime.getTime() + duration * 60000);
      const endHour = endDateTime.getHours();
      const endMinutes = endDateTime.getMinutes();

      if (endHour > 19 || (endHour === 19 && endMinutes > 0)) {
        return res.status(400).json({ error: 'Orario non valido. Chiudiamo alle 19:00.' });
      }

      // 1. Lunch Break Validation
      // 13:00 - 14:00 (1PM - 2PM) implies: START cannot be >= 13:00 AND < 14:00.
      // Actually strictly: The INTERVAL [Start, End] cannot overlap with [13:00, 14:00].
      // Simple rule: Appointment cannot START between 13:00 and 13:59.
      // AND Appointment cannot END after 13:00 (overlapping lunch).

      const newStart = new Date(bookingDate);
      const newEnd = new Date(newStart.getTime() + (durationMinutes || 60) * 60000);

      const lunchStart = new Date(bookingDate);
      lunchStart.setHours(13, 0, 0, 0);
      const lunchEnd = new Date(bookingDate);
      lunchEnd.setHours(14, 0, 0, 0);

      // Check overlap with lunch: (StartA < EndB) && (EndA > StartB)
      if (newStart < lunchEnd && newEnd > lunchStart) {
        return res.status(400).json({ error: 'Pausa pranzo (13:00 - 14:00). Seleziona un altro orario.' });
      }

      // 2. Advanced Range Overlap Validation
      // Fetch bookings for the day to check range overlap in memory
      const dayStart = new Date(bookingDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(bookingDate);
      dayEnd.setHours(23, 59, 59, 999);

      const { data: dayBookings } = await supabase
        .from('bookings')
        .select('booking_date, duration_minutes')
        .in('status', ['pending', 'confirmed'])
        .gte('booking_date', dayStart.toISOString())
        .lte('booking_date', dayEnd.toISOString());

      if (dayBookings) {
        const hasOverlap = dayBookings.some(b => {
          const existingStart = new Date(b.booking_date);
          const existingEnd = new Date(existingStart.getTime() + (b.duration_minutes || 60) * 60000);

          // Overlap logic: (StartA < EndB) && (EndA > StartB)
          return newStart < existingEnd && newEnd > existingStart;
        });

        if (hasOverlap) {
          return res.status(400).json({ error: 'Orario non disponibile (sovrapposizione con altro appuntamento)' });
        }
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

      // Fetch booking details with user email to send notification
      const { data: bookingDetails } = await supabase
        .from('bookings')
        .select(`
          service_name, 
          booking_date, 
          users (email)
        `)
        .eq('id', id)
        .single();

      if (bookingDetails && bookingDetails.users) {
        const userEmail = Array.isArray(bookingDetails.users)
          ? bookingDetails.users[0]?.email
          : (bookingDetails.users as any).email;

        if (userEmail) {
          // Send notification email
          await emailService.sendBookingStatusUpdateEmail(
            userEmail,
            bookingDetails,
            status
          );
        }
      }

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

// Aggiorna prenotazione completa (admin)
router.patch(
  '/bookings/:id',
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

      const { id } = req.params;
      const { serviceName, servicePrice, bookingDate, durationMinutes, notes, status } = req.body;

      // 1. Fetch existing booking AND user details first
      const { data: existingBooking, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          users (email)
        `)
        .eq('id', id)
        .single();

      if (fetchError || !existingBooking) {
        return res.status(404).json({ error: 'Prenotazione non trovata' });
      }

      // 2. Validate Date/Duration Changes
      if (bookingDate || durationMinutes) {
        const targetDate = bookingDate ? new Date(bookingDate) : new Date(existingBooking.booking_date);
        const targetDuration = durationMinutes || existingBooking.duration_minutes || 60;

        const newStart = new Date(targetDate);
        const newEnd = new Date(newStart.getTime() + targetDuration * 60000);

        // Check Business Hours & Days
        const dayOfWeek = newStart.getDay();
        const hour = newStart.getHours();

        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return res.status(400).json({ error: 'Siamo chiusi nel weekend. Gli orari sono Lun-Ven 09:00 - 19:00.' });
        }

        if (hour < 9) {
          return res.status(400).json({ error: 'Orario non valido. Apriamo alle 09:00.' });
        }

        const endHour = newEnd.getHours();
        const endMinutes = newEnd.getMinutes();

        if (endHour > 19 || (endHour === 19 && endMinutes > 0)) {
          return res.status(400).json({ error: 'Orario non valido. Chiudiamo alle 19:00.' });
        }

        // A. Lunch Break (13:00 - 14:00)
        const lunchStart = new Date(targetDate);
        lunchStart.setHours(13, 0, 0, 0);
        const lunchEnd = new Date(targetDate);
        lunchEnd.setHours(14, 0, 0, 0);

        if (newStart < lunchEnd && newEnd > lunchStart) {
          return res.status(400).json({ error: 'Pausa pranzo (13:00 - 14:00). Seleziona un altro orario.' });
        }

        // B. Range Overlap 
        const dayStart = new Date(targetDate);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(targetDate);
        dayEnd.setHours(23, 59, 59, 999);

        const { data: dayBookings } = await supabase
          .from('bookings')
          .select('id, booking_date, duration_minutes')
          .in('status', ['pending', 'confirmed'])
          .gte('booking_date', dayStart.toISOString())
          .lte('booking_date', dayEnd.toISOString())
          .neq('id', id); // Exclude current

        if (dayBookings) {
          const hasOverlap = dayBookings.some(b => {
            const existingStart = new Date(b.booking_date);
            const existingEnd = new Date(existingStart.getTime() + (b.duration_minutes || 60) * 60000);
            return newStart < existingEnd && newEnd > existingStart;
          });

          if (hasOverlap) {
            return res.status(400).json({ error: 'Orario non disponibile (sovrapposizione con altro appuntamento)' });
          }
        }
      }

      // 3. Prepare Updates
      const updates: any = { updated_at: new Date().toISOString() };
      if (serviceName) updates.service_name = serviceName;
      if (servicePrice !== undefined) updates.service_price = servicePrice;
      if (bookingDate) updates.booking_date = bookingDate;
      if (durationMinutes) updates.duration_minutes = durationMinutes;
      if (notes !== undefined) updates.notes = notes;
      if (status) updates.status = status;

      // 4. Determine Service ID if name changed
      if (serviceName && serviceName !== existingBooking.service_name) {
        const { data: service } = await supabase
          .from('services')
          .select('id')
          .eq('name', serviceName)
          .maybeSingle();
        if (service) updates.service_id = service.id;
      }

      // 5. Build Update Object to check for meaningful changes
      const isDateChanged = bookingDate && new Date(bookingDate).getTime() !== new Date(existingBooking.booking_date).getTime();
      const isServiceChanged = serviceName && serviceName !== existingBooking.service_name;

      // 6. Perform Update
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select(`
           id, service_id, service_name, service_price, booking_date, 
           duration_minutes, status, notes, created_at
        `)
        .single();

      if (updateError) throw updateError;

      // 7. Send Notifications if relevant changes occurred
      // We need user email from the FIRST fetch
      const user = existingBooking.users as any; // or array check
      const userEmail = Array.isArray(user) ? user[0]?.email : user?.email;

      if (userEmail && (isDateChanged || isServiceChanged)) {
        console.log(`📧 Sending update email to ${userEmail} for booking ${id}`);
        await emailService.sendBookingUpdateEmail(
          userEmail,
          existingBooking, // Pass old details
          { ...updatedBooking, bookingDate: updatedBooking.booking_date, serviceName: updatedBooking.service_name } // Ensure normalized format
        );
      } else if (userEmail && status && status !== existingBooking.status) {
        // Fallback to status update email if only status changed
        await emailService.sendBookingStatusUpdateEmail(userEmail, updatedBooking, status as any);
      }

      res.json({
        message: 'Prenotazione aggiornata con successo',
        booking: updatedBooking,
      });

    } catch (error: any) {
      console.error('Admin update booking error:', error);
      res.status(500).json({ error: 'Errore nell\'aggiornamento della prenotazione' });
    }
  }
);
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const users = data.map((user: any) => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    }));

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

// Update User (admin)
router.put(
  '/users/:id',
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('phone').optional().trim(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { firstName, lastName, phone } = req.body;

      const { data: user, error } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || null
        })
        .eq('id', id)
        .select('id, email, first_name, last_name, phone, role')
        .single();

      if (error) throw error;

      res.json({
        message: 'Utente aggiornato con successo',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ error: 'Errore nell\'aggiornamento dell\'utente' });
    }
  }
);

// Ban User (admin)
router.patch('/users/:id/ban', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { banned } = req.body; // Expect boolean

    const newRole = banned ? 'banned' : 'user';

    const { data: user, error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', id)
      .select('id, role')
      .single();

    if (error) throw error;

    res.json({
      message: `Utente ${banned ? 'bannato' : 'sbannato'} con successo`,
      user
    });
  } catch (error: any) {
    console.error('Ban user error:', error);
    res.status(500).json({
      error: 'Errore nel bannare l\'utente',
      details: error.message || JSON.stringify(error)
    });
  }
});

// Delete User (admin)
router.delete('/users/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Utente eliminato con successo' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Errore nell\'eliminazione dell\'utente' });
  }
});

export default router;


