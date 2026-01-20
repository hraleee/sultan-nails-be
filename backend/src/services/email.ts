import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configura il transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const normalizeBooking = (booking: any) => ({
    bookingDate: booking.booking_date || booking.bookingDate,
    serviceName: booking.service_name || booking.serviceName,
    servicePrice: booking.service_price || booking.servicePrice,
    notes: booking.notes,
    status: booking.status
});

// Indirizzo admin (hardcoded o da env)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html: string;
}

const sendEmail = async ({ to, subject, text, html }: EmailOptions) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn(`[DEV] Email simulata a ${to}: ${subject}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: 'Sultan Nails <noreply@sultannails.com>',
            to,
            subject,
            text,
            html
        });
        console.log(`📧 Email inviata a ${to}: ${subject}`);
    } catch (error) {
        console.error('Errore invio email:', error);
    }
};

export const emailService = {
    // 1. Verifica Email (OTP)
    sendVerificationEmail: async (email: string, otp: string) => {
        const verificationLink = `${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(email)}&code=${otp}`;
        await sendEmail({
            to: email,
            subject: 'Verifica la tua email - Sultan Nails',
            text: `Clicca qui per verificare la tua email: ${verificationLink}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #d946ef;">Sultan Nails</h2>
                    <p>Grazie per esserti registrato!</p>
                    <p>Per attivare il tuo account, clicca sul pulsante qui sotto:</p>
                    <a href="${verificationLink}" style="background-color: #d946ef; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin: 10px 0;">Verifica Email</a>
                    <p style="font-size: 14px; color: #666;">Oppure copia questo link: <br> ${verificationLink}</p>
                </div>
            `
        });
    },

    // 2. Recupero Password
    sendPasswordResetEmail: async (email: string, otp: string) => {
        await sendEmail({
            to: email,
            subject: 'Codice di Recupero Password - Sultan Nails',
            text: `Il tuo codice di recupero è: ${otp}\n\nIl codice scade tra 15 minuti.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #d946ef;">Sultan Nails</h2>
                    <p>Hai richiesto il ripristino della password.</p>
                    <p>Il tuo codice OTP è:</p>
                    <h1 style="background: #fff; padding: 10px; display: inline-block; border-radius: 8px; border: 1px solid #ddd;">${otp}</h1>
                    <p>Il codice è valido per 15 minuti.</p>
                    <p style="font-size: 12px; color: #666;">Se non hai richiesto questo codice, ignora questa email.</p>
                </div>
            `
        });
    },

    // 3. Notifica Admin: Nuova Registrazione
    sendAdminNewRegistrationEmail: async (email: string, firstName: string, lastName: string) => {
        if (!ADMIN_EMAIL) return;

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: '🔔 Nuova Registrazione Utente - Sultan Nails',
            text: `Un nuovo utente si è registrato: ${firstName} ${lastName} (${email})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #d946ef;">Nuova Registrazione</h2>
                    <p>Un nuovo utente si è appena registrato sulla piattaforma.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                        <p><strong>Nome:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                    </div>
                </div>
            `
        });
    },

    // 4. Notifica Utente: Prenotazione Creata (fix)
    sendUserBookingCreatedEmail: async (email: string, booking: any) => {
        const b = normalizeBooking(booking);  // ← Fix qui

        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'Data non disponibile';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '';

        await sendEmail({
            to: email,
            subject: '📅 Conferma Prenotazione Inviata - Sultan Nails',
            text: `La tua prenotazione per ${b.serviceName || 'Servizio'} il ${date} alle ${time} è stata ricevuta.`,
            html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #d946ef;">Prenotazione Ricevuta</h2>
        <p>Ciao, abbiamo ricevuto la tua richiesta.</p>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
          <p><strong>Servizio:</strong> ${b.serviceName || 'N/A'}</p>
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Ora:</strong> ${time}</p>
          <p><strong>Stato:</strong> <span style="color: #f59e0b;">In attesa</span></p>
        </div>
      </div>
    `
        });
    },

    // 5. Notifica Admin: Nuova Prenotazione (fix)
    sendAdminNewBookingEmail: async (user: any, booking: any) => {
        if (!ADMIN_EMAIL) return;

        const b = normalizeBooking(booking);  // ← Fix qui

        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'N/A';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: '📅 Nuova Prenotazione - Sultan Nails',
            text: `${user.firstName} ${user.lastName} ha prenotato ${b.serviceName} il ${date} alle ${time}.`,
            html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #d946ef;">Nuova Prenotazione</h2>
        <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
          <p><strong>Utente:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
          <p><strong>Servizio:</strong> ${b.serviceName || 'N/A'}</p>
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Ora:</strong> ${time}</p>
        </div>
      </div>
    `
        });
    },

    // 6. Status Update (fix)
    sendBookingStatusUpdateEmail: async (email: string, booking: any, status: 'confirmed' | 'cancelled') => {
        const b = normalizeBooking(booking);  // ← Fix qui

        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'N/A';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        const isConfirmed = status === 'confirmed';
        const subject = isConfirmed ? '✅ Prenotazione Confermata' : '❌ Prenotazione Cancellata';
        const color = isConfirmed ? '#10b981' : '#ef4444';

        await sendEmail({
            to: email,
            subject: `${subject} - Sultan Nails`,
            text: `Prenotazione ${b.serviceName} ${date} ${time}: ${status}.`,
            html: `
      <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: ${color};">${subject}</h2>
        <div style="background: white; padding: 15px; border-radius: 8px;">
          <p><strong>Servizio:</strong> ${b.serviceName}</p>
          <p><strong>Data:</strong> ${date}</p>
          <p><strong>Ora:</strong> ${time}</p>
        </div>
      </div>
    `
        });
    },

    // 7. Notifica Utente: Cancellazione
    sendUserBookingCancelledEmail: async (email: string, booking: any) => {
        const b = normalizeBooking(booking);
        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'N/A';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        await sendEmail({
            to: email,
            subject: '🗑️ Cancellazione Prenotazione - Sultan Nails',
            text: `La tua prenotazione per ${b.serviceName} del ${date} alle ${time} è stata cancellata con successo.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #ef4444;">Prenotazione Cancellata</h2>
                    <p>La tua prenotazione è stata cancellata come richiesto.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                        <p><strong>Servizio:</strong> ${b.serviceName}</p>
                        <p><strong>Data:</strong> ${date}</p>
                        <p><strong>Ora:</strong> ${time}</p>
                    </div>
                </div>
            `
        });
    },

    // 8. Notifica Admin: Cancellazione Utente
    sendAdminBookingCancelledEmail: async (user: any, booking: any) => {
        if (!ADMIN_EMAIL) return;

        const b = normalizeBooking(booking);
        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'N/A';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: '🗑️ Prenotazione Cancellata dall\'Utente - Sultan Nails',
            text: `L'utente ${user.firstName} ${user.lastName} ha cancellato la prenotazione per ${b.serviceName} del ${date} alle ${time}.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #ef4444;">Prenotazione Cancellata</h2>
                    <p>Un utente ha cancellato una prenotazione.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                         <p><strong>Utente:</strong> ${user.firstName} ${user.lastName} (${user.email})</p>
                        <p><strong>Servizio:</strong> ${b.serviceName}</p>
                        <p><strong>Data:</strong> ${date}</p>
                        <p><strong>Ora:</strong> ${time}</p>
                    </div>
                </div>
            `
        });
    },

    // 9. Promemoria: Giorno stesso
    sendSameDayReminderEmail: async (email: string, booking: any) => {
        const b = normalizeBooking(booking);
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        await sendEmail({
            to: email,
            subject: '⏰ Promemoria Appuntamento Oggi - Sultan Nails',
            text: `Ciao, ricordati che oggi hai un appuntamento per ${b.serviceName} alle ore ${time}.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #6b21a8;">Promemoria Appuntamento</h2>
                    <p>Ciao! Ti ricordiamo il tuo appuntamento di oggi.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                        <p><strong>Servizio:</strong> ${b.serviceName}</p>
                        <p><strong>Ora:</strong> ${time}</p>
                        <p><strong>Luogo:</strong> Sultan Nails</p>
                    </div>
                    <p style="font-size: 14px; margin-top: 20px;">Ti aspettiamo!</p>
                </div>
            `
        });
    },

    // 10. Promemoria: Settimanale
    sendWeeklyReminderEmail: async (email: string, booking: any, weeksUntil: number) => {
        const b = normalizeBooking(booking);
        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'N/A';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        await sendEmail({
            to: email,
            subject: `📅 Tra ${weeksUntil} settimane: Appuntamento Sultan Nails`,
            text: `Ciao, ti ricordiamo che tra ${weeksUntil} settimane (il ${date}) hai un appuntamento per ${b.serviceName}.`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <h2 style="color: #6b21a8;">Promemoria Appuntamento</h2>
                    <p>Ciao! Un piccolo promemoria per il tuo futuro appuntamento.</p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #eee;">
                        <p><strong>Mancano:</strong> ${weeksUntil} settimane</p>
                        <p><strong>Data:</strong> ${date}</p>
                        <p><strong>Ora:</strong> ${time}</p>
                        <p><strong>Servizio:</strong> ${b.serviceName}</p>
                    </div>
                </div>
            `
        });
    }
};
