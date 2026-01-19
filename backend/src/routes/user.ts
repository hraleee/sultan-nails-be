import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { pool } from '../db/connection';

const router = express.Router();

// Tutte le route richiedono autenticazione
router.use(authenticate);

// Ottieni profilo utente
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT 
        id, email, first_name, last_name, phone, role, created_at
       FROM users 
       WHERE id = $1`,
      [req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Errore nel recupero del profilo' });
  }
});

// Aggiorna profilo utente
router.patch(
  '/profile',
  [
    body('email').optional().isEmail().normalizeEmail(),
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('currentPassword').if(body('newPassword').exists()).notEmpty(),
    body('newPassword').optional().isLength({ min: 6 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, firstName, lastName, phone, currentPassword, newPassword } = req.body;
      const userId = req.user!.id;

      // Recupera utente attuale per controlli password e email
      const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
      if (userResult.rows.length === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      const currentUser = userResult.rows[0];

      // Se cambia email, controlla unicità
      if (email && email !== currentUser.email) {
        const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1 AND id != $2', [email, userId]);
        if (emailCheck.rows.length > 0) {
          return res.status(400).json({ error: 'Email già in uso' });
        }
      }

      // Se cambia password, verifica quella attuale
      let passwordHash = currentUser.password_hash;
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Password attuale richiesta per impostare una nuova password' });
        }
        console.log('Password check debug:', { provided: currentPassword, storedHash: currentUser.password_hash });
        const isValid = await bcrypt.compare(currentPassword, currentUser.password_hash);
        if (!isValid) {
          return res.status(400).json({ error: 'Password attuale non corretta' });
        }
        passwordHash = await bcrypt.hash(newPassword, 10);
      }

      // Costruisci query update
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      if (email) { updates.push(`email = $${paramIndex++}`); values.push(email); }
      if (firstName) { updates.push(`first_name = $${paramIndex++}`); values.push(firstName); }
      if (lastName) { updates.push(`last_name = $${paramIndex++}`); values.push(lastName); }
      if (phone !== undefined) { updates.push(`phone = $${paramIndex++}`); values.push(phone); }
      // Aggiorna password hash se cambiata
      if (newPassword) { updates.push(`password_hash = $${paramIndex++}`); values.push(passwordHash); }

      if (updates.length === 0) {
        return res.status(400).json({ error: 'Nessun dato da aggiornare' });
      }

      values.push(userId);
      const updateResult = await pool.query(
        `UPDATE users 
         SET ${updates.join(', ')} 
         WHERE id = $${paramIndex} 
         RETURNING id, email, first_name, last_name, phone, role, created_at`,
        values
      );

      const updatedUser = updateResult.rows[0];

      res.json({
        message: 'Profilo aggiornato con successo',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.first_name,
          lastName: updatedUser.last_name,
          phone: updatedUser.phone,
          role: updatedUser.role,
          createdAt: updatedUser.created_at,
        },
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Errore nell\'aggiornamento del profilo' });
    }
  }
);

export default router;

