import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { authenticate, AuthRequest } from '../middleware/auth';
import { supabase } from '../db/connection';

const router = express.Router();

// Tutte le route richiedono autenticazione
router.use(authenticate);

// Ottieni profilo utente
router.get('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, phone, role, created_at')
      .eq('id', req.user!.id)
      .maybeSingle();

    if (error) throw error;

    if (!user) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }

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
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!currentUser) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }

      // Se cambia email, controlla unicità
      if (email && email !== currentUser.email) {
        const { data: emailCheck } = await supabase
          .from('users')
          .select('id')
          .eq('email', email)
          .neq('id', userId)
          .maybeSingle();

        if (emailCheck) {
          return res.status(400).json({ error: 'Email già in uso' });
        }
      }

      // Se cambia password, verifica quella attuale
      let passwordHash = currentUser.password_hash;
      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ error: 'Password attuale richiesta per impostare una nuova password' });
        }

        const isValid = await bcrypt.compare(currentPassword, currentUser.password_hash);
        if (!isValid) {
          return res.status(400).json({ error: 'Password attuale non corretta' });
        }
        passwordHash = await bcrypt.hash(newPassword, 10);
      }

      // Costruisci oggetto update
      const updates: any = {};

      if (email) updates.email = email;
      if (firstName) updates.first_name = firstName;
      if (lastName) updates.last_name = lastName;
      if (phone !== undefined) updates.phone = phone;
      if (newPassword) updates.password_hash = passwordHash;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Nessun dato da aggiornare' });
      }

      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
        .select('id, email, first_name, last_name, phone, role, created_at')
        .single();

      if (updateError) throw updateError;

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


