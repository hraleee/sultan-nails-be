import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { pool } from '../db/connection';
import nodemailer from 'nodemailer';

const router = express.Router();

// Registrazione
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, firstName, lastName, phone } = req.body;

      // Check if user already exists
      const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email già registrata' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Insert user
      // Insert user
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const result = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, is_verified, verification_code, verification_expires_at)
         VALUES ($1, $2, $3, $4, $5, 'user', FALSE, $6, $7)
         RETURNING id, email, first_name, last_name, role`,
        [email, passwordHash, firstName, lastName, phone || null, otp, expiresAt]
      );

      const user = result.rows[0];

      // Send Verification Email
      try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const verificationLink = `${process.env.FRONTEND_URL}/verify?email=${encodeURIComponent(email)}&code=${otp}`;

          const mailOptions = {
            from: 'Sultan Nails <noreply@sultannails.com>',
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
          };
          await transporter.sendMail(mailOptions);
        } else {
          console.log(`[DEV] Verification Link for ${email}: ${process.env.FRONTEND_URL}/verify?email=${email}&code=${otp}`);
        }
      } catch (error) {
        console.error("Error sending verification email:", error);
        // Continue anyway, user can resend later (if we implement resend) or contact support
      }

      res.status(201).json({
        message: 'Registrazione iniziata. Controlla la tua email per il codice di verifica.',
        // No token returned yet
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Errore durante la registrazione' });
    }
  }
);

// Verify Email
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND verification_code = $2`,
      [email, otp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Codice non valido' });
    }

    const user = result.rows[0];

    // Mark as verified
    await pool.query(
      `UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE id = $1`,
      [user.id]
    );

    // Login user (Generate JWT)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error('JWT_SECRET non configurato');

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    );

    res.json({
      message: 'Email verificata con successo',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Errore durante la verifica' });
  }
});

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const result = await pool.query(
        'SELECT id, email, password_hash, first_name, last_name, role, is_verified FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      const user = result.rows[0];

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

      // Check Verification
      if (user.is_verified === false) {
        return res.status(403).json({ error: 'Email non verificata. Controlla la tua casella di posta.' });
      }

      // Generate JWT
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET non configurato');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
      );

      res.json({
        message: 'Login effettuato con successo',
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Errore durante il login' });
    }
  }
);

// Forgot Password
router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email richiesta' });
    }

    const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      // Security: Don't reveal if user exists. Fake success.
      // But for this use case, we might want to be helpful or silent.
      // Let's return success to prevent enumeration, but log internally.
      // Or for a small business app, being explicit is often better for UX.
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const userId = rows[0].id;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await pool.query(
      'INSERT INTO password_resets (user_id, otp_code, expires_at) VALUES ($1, $2, $3)',
      [userId, otp, expiresAt]
    );

    // Send Email
    // NOTE: This requires environment variables or hardcoded creds (not recommended for prod).
    // For free Gmail: use App Password.
    console.log(`[DEBUG] Generated OTP for ${email}: ${otp}`);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[WARN] No email credentials found (EMAIL_USER/EMAIL_PASS). Skipping email send.');
      // Return success for testing purposes so the UI moves to the next step
      // Return success for testing purposes so the UI moves to the next step
      // return res.json({ message: 'Simulazione: OTP generato (vedi console server)', devOtp: otp });
      return res.status(500).json({ error: 'Servizio email non configurato' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: 'Sultan Nails <noreply@sultannails.com>',
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
    };

    try {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Codice OTP inviato per email' });
    } catch (emailError) {
      console.error('Email send failed:', emailError);
      // Fallback for dev: if it fails, still let them proceed if they have access to logs
      // returning 500 would block the UI. Let's return 200 but warn.
      // res.json({ message: 'Errore invio email (vedi logs), ma OTP generato.', devOtp: otp });
      res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
  }
});

// Reset Password
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Tutti i campi sono obbligatori' });
    }

    // Verify User and OTP
    // Join users to ensure email matches user_id
    const query = `
      SELECT pr.* 
      FROM password_resets pr
      JOIN users u ON pr.user_id = u.id
      WHERE u.email = $1 
        AND pr.otp_code = $2 
        AND pr.used = FALSE 
        AND pr.expires_at > NOW()
      ORDER BY pr.created_at DESC 
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [email, otp]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Codice OTP non valido o scaduto' });
    }

    const resetRequest = rows[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hashedPassword, resetRequest.user_id]);

    // Mark OTP as used
    await pool.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetRequest.id]);

    res.json({ message: 'Password aggiornata con successo' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Errore nel ripristino della password' });
  }
});

export default router;

