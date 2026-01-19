# Sultan Nails - Backend API

Backend API Express.js per il sistema di prenotazioni Sultan Nails.

## Tecnologie

- **Express.js** - Framework web Node.js
- **PostgreSQL** - Database relazionale
- **JWT** - Autenticazione
- **TypeScript** - Tipizzazione statica
- **bcryptjs** - Hash password

## Setup Locale

1. **Installa le dipendenze:**
```bash
cd backend
npm install
```

2. **Configura il database:**
   - Crea un database PostgreSQL
   - Copia `.env.example` in `.env`
   - Modifica `DATABASE_URL` con le tue credenziali

3. **Esegui le migrazioni:**
```bash
npm run migrate
```
Questo creerà le tabelle necessarie e un utente admin di default:
- Email: `admin@sultan-nails.it`
- Password: `admin123`

4. **Avvia il server in sviluppo:**
```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:5000`

## Deploy su Render

1. **Crea un nuovo Web Service su Render:**
   - Connetti il repository GitHub
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

2. **Crea un database PostgreSQL su Render:**
   - Crea un nuovo PostgreSQL database
   - Copia la `DATABASE_URL` fornita da Render

3. **Configura le variabili d'ambiente su Render:**
   ```
   DATABASE_URL=<url-fornita-da-render>
   JWT_SECRET=<genera-una-chiave-segreta-forte>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=<url-del-tuo-frontend-nextjs>
   PORT=10000
   ```

4. **Esegui le migrazioni sul database di produzione:**
   - Connettiti al database Render
   - Esegui lo script `src/db/migrate.ts` manualmente o tramite SSH

## API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione nuovo utente
- `POST /api/auth/login` - Login

### Utente
- `GET /api/user/profile` - Profilo utente (richiede auth)

### Prenotazioni
- `GET /api/bookings` - Lista prenotazioni utente (richiede auth)
- `POST /api/bookings` - Crea prenotazione (richiede auth)
- `GET /api/bookings/:id` - Dettagli prenotazione (richiede auth)
- `DELETE /api/bookings/:id` - Cancella prenotazione (richiede auth)

### Admin
- `GET /api/admin/bookings` - Tutte le prenotazioni (richiede admin)
- `PATCH /api/admin/bookings/:id/status` - Aggiorna stato prenotazione (richiede admin)
- `GET /api/admin/users` - Lista utenti (richiede admin)
- `GET /api/admin/stats` - Statistiche (richiede admin)

## Formato Token JWT

Includi il token nell'header `Authorization`:
```
Authorization: Bearer <token>
```

