import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { supabase } from '../db/connection';
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
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        return res.status(400).json({ error: 'Email già registrata' });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

      const { data: user, error: insertError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: passwordHash,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          role: 'user',
          is_verified: false,
          verification_code: otp,
          verification_expires_at: expiresAt
        })
        .select('id, email, first_name, last_name, role')
        .single();

      if (insertError) {
        throw insertError;
      }

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
      }

      res.status(201).json({
        message: 'Registrazione iniziata. Controlla la tua email per il codice di verifica.',
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

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('verification_code', otp)
      .maybeSingle();

    if (error || !user) {
      return res.status(400).json({ error: 'Codice non valido' });
    }

    // Mark as verified
    await supabase
      .from('users')
      .update({
        is_verified: true,
        verification_code: null,
        verification_expires_at: null
      })
      .eq('id', user.id);

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
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, password_hash, first_name, last_name, role, is_verified')
        .eq('email', email)
        .maybeSingle();

      if (error || !user) {
        return res.status(401).json({ error: 'Credenziali non valide' });
      }

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

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const userId = user.id;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const { error: insertError } = await supabase
      .from('password_resets')
      .insert({
        user_id: userId,
        otp_code: otp,
        expires_at: expiresAt
      });

    if (insertError) throw insertError;

    // Send Email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('[WARN] No email credentials found (EMAIL_USER/EMAIL_PASS).');
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
      res.status(500).json({ error: 'Errore nell\'invio dell\'email' });
    }

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Errore nel recupero della password' });
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
    // We need to join manually or do two queries since Supabase join syntax is specific
    // Let's first find the user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (!user) {
      return res.status(400).json({ error: 'Utente non trovato' });
    }

    // Now find the valid reset token
    const { data: resetRequest } = await supabase
      .from('password_resets')
      .select('*')
      .eq('user_id', user.id)
      .eq('otp_code', otp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!resetRequest) {
      return res.status(400).json({ error: 'Codice OTP non valido o scaduto' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', user.id);

    if (updateError) throw updateError;

    // Mark OTP as used
    await supabase
      .from('password_resets')
      .update({ used: true })
      .eq('id', resetRequest.id);

    res.json({ message: 'Password aggiornata con successo' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Errore nel ripristino della password' });
  }
});

export default router;


