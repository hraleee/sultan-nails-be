import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

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

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sultannails.it';

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
        const link = `${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(email)}&code=${otp}`;

        await sendEmail({
            to: email,
            subject: 'Verifica la tua email - Sultan Nails',
            text: `Il tuo codice di verifica è: ${otp}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
                    <h2 style="color: #d946ef;">Sultan Nails</h2>
                    <p>Grazie per esserti registrato!</p>
                    <p>Il tuo codice di verifica è:</p>
                    <h1 style="background: #fff; padding: 10px; display: inline-block; border-radius: 8px; border: 1px solid #ddd; letter-spacing: 5px; color: #000;">${otp}</h1>
                    <p>Il codice scade tra 15 minuti.</p>
                </div>
            `
        });
    },

    // 2. Recupero Password
    sendPasswordResetEmail: async (email: string, otp: string) => {
        await sendEmail({
            to: email,
            subject: 'Recupero Password - Sultan Nails',
            text: `Codice: ${otp}`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; color: #333;">
                    <h2>Recupero Password</h2>
                    <p>Il tuo codice OTP è: <strong>${otp}</strong></p>
                    <p>Scade tra 15 minuti.</p>
                </div>
            `
        });
    },

    // 3. Notifica Admin: Nuova Registrazione
    sendAdminNewRegistrationEmail: async (email: string, firstName: string, lastName: string) => {
        if (!ADMIN_EMAIL) return;
        await sendEmail({
            to: ADMIN_EMAIL,
            subject: '🔔 Nuova Registrazione',
            text: `${firstName} ${lastName} si è registrato.`,
            html: `<p>Nuovo utente: <strong>${firstName} ${lastName}</strong> (${email})</p>`
        });
    },

    // 4. Notifica Admin: Nuova Prenotazione
    sendAdminNewBookingEmail: async (user: any, booking: any) => {
        if (!ADMIN_EMAIL) return;
        const b = normalizeBooking(booking);
        const date = b.bookingDate ? new Date(b.bookingDate).toLocaleDateString('it-IT') : 'N/A';
        const time = b.bookingDate ? new Date(b.bookingDate).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : 'N/A';

        await sendEmail({
            to: ADMIN_EMAIL,
            subject: '📅 Nuova Prenotazione',
            text: `Prenotazione da ${user.firstName}`,
            html: `
                <p><strong>Utente:</strong> ${user.firstName} ${user.lastName}</p>
                <p><strong>Servizio:</strong> ${b.serviceName}</p>
                <p><strong>Data:</strong> ${date} alle ${time}</p>
            `
        });
    },

    // 5. Notifica Utente: Cancellazione
    sendUserBookingCancelledEmail: async (email: string, booking: any) => {
        const b = normalizeBooking(booking);
        await sendEmail({
            to: email,
            subject: '🗑️ Prenotazione Cancellata',
            text: `La prenotazione per ${b.serviceName} è stata cancellata.`,
            html: `<p>La tua prenotazione per <strong>${b.serviceName}</strong> è stata cancellata.</p>`
        });
    },

    // 6. Notifica Admin: Cancellazione Utente
    sendAdminBookingCancelledEmail: async (user: any, booking: any) => {
        if (!ADMIN_EMAIL) return;
        const b = normalizeBooking(booking);
        await sendEmail({
            to: ADMIN_EMAIL,
            subject: '🗑️ Prenotazione Cancellata da Utente',
            text: `${user.firstName} ha cancellato una prenotazione.`,
            html: `<p>L'utente ${user.firstName} ha cancellato l'appuntamento per ${b.serviceName}.</p>`
        });
    },

    sendBookingStatusUpdateEmail: async (email: string, booking: any, status: string) => {
        const b = normalizeBooking(booking);
        await sendEmail({
            to: email,
            subject: `Prenotazione ${status === 'confirmed' ? 'Confermata' : 'Aggiornata'}`,
            text: `Lo stato della tua prenotazione è: ${status}`,
            html: `<p>Il tuo appuntamento per ${b.serviceName} è ora: <strong>${status}</strong>.</p>`
        });
    },

    sendBookingUpdateEmail: async (email: string, oldBooking: any, newBooking: any) => {
        const newB = normalizeBooking(newBooking);
        await sendEmail({
            to: email,
            subject: '✏️ Appuntamento Modificato',
            text: `Nuova data per ${newB.serviceName}`,
            html: `<p>Il tuo appuntamento è stato spostato.</p>`
        });
    },

    sendSameDayReminderEmail: async (email: string, booking: any) => {
        const b = normalizeBooking(booking);
        await sendEmail({
            to: email,
            subject: '⏰ Promemoria Appuntamento Oggi',
            text: `Ricordati l'appuntamento per ${b.serviceName}`,
            html: `<p>Oggi hai un appuntamento per <strong>${b.serviceName}</strong>.</p>`
        });
    },

    sendWeeklyReminderEmail: async (email: string, booking: any, weeksUntil: number) => {
        await sendEmail({
            to: email,
            subject: '📅 Promemoria Appuntamento',
            text: `Mancano ${weeksUntil} settimane al tuo appuntamento.`,
            html: `<p>Ti aspettiamo tra ${weeksUntil} settimane.</p>`
        });
    }

};
