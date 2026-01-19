# Sultan Nails - Sistema di Prenotazioni

Applicazione Next.js per Sultan Nails con sistema di autenticazione, prenotazioni e area admin.

## 🏗️ Architettura

Il progetto è diviso in due parti:

1. **Frontend** (Next.js) - Interfaccia utente in `/app`
2. **Backend** (Express.js) - API REST standalone in `/backend` (deployabile su Render)

## 🚀 Setup Locale

### Prerequisiti

- Node.js 18+ 
- PostgreSQL (locale o remoto)
- npm o yarn

### 1. Setup Backend

```bash
cd backend
npm install
```

Crea un file `.env` nella cartella `backend` con:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/sultan_nails
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Esegui le migrazioni del database:

```bash
npm run migrate
```

Questo creerà le tabelle e un utente admin di default:
- Email: `admin@sultan-nails.it`
- Password: `admin123`

Avvia il server backend:

```bash
npm run dev
```

Il backend sarà disponibile su `http://localhost:5000`

### 2. Setup Frontend

Dalla root del progetto:

```bash
npm install
```

Crea un file `.env.local` nella root con:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Avvia il server frontend:

```bash
npm run dev
```

Il frontend sarà disponibile su `http://localhost:3000`

## 📦 Deploy su Render

### Backend (API)

1. **Crea un nuovo Web Service su Render:**
   - Connetti il repository GitHub
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment: `Node`

2. **Crea un database PostgreSQL su Render:**
   - Crea un nuovo PostgreSQL database
   - Copia la `DATABASE_URL` fornita

3. **Configura le variabili d'ambiente su Render:**
   ```
   DATABASE_URL=<url-fornita-da-render>
   JWT_SECRET=<genera-una-chiave-segreta-forte>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=<url-del-tuo-frontend-nextjs>
   PORT=10000
   ```

4. **Esegui le migrazioni:**
   - Connettiti al database Render
   - Esegui lo script `backend/src/db/migrate.ts`

### Frontend (Next.js)

Deploya il frontend su Vercel, Netlify o Render:

1. Imposta la variabile d'ambiente:
   ```
   NEXT_PUBLIC_API_URL=<url-del-tuo-backend-render>/api
   ```

## 🎯 Funzionalità

### Utenti
- ✅ Registrazione
- ✅ Login/Logout
- ✅ Area utente privata
- ✅ Creazione prenotazioni
- ✅ Visualizzazione prenotazioni
- ✅ Cancellazione prenotazioni

### Admin
- ✅ Dashboard admin
- ✅ Visualizzazione tutte le prenotazioni
- ✅ Gestione stato prenotazioni
- ✅ Visualizzazione utenti
- ✅ Statistiche

## 📁 Struttura Progetto

```
sultan-nails/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Route autenticazione
│   │   ├── login/
│   │   └── register/
│   ├── admin/             # Area admin
│   ├── area-utente/       # Area utente
│   └── components/        # Componenti React
├── backend/               # API Express.js
│   ├── src/
│   │   ├── routes/        # Route API
│   │   ├── middleware/    # Middleware auth
│   │   └── db/           # Database setup
│   └── package.json
├── lib/                   # Utility frontend
│   └── api.ts            # Client API
└── package.json          # Frontend dependencies
```

## 🔐 Tecnologie

**Frontend:**
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

**Backend:**
- Express.js
- PostgreSQL
- JWT (autenticazione)
- bcryptjs (hash password)
- TypeScript

## 📝 API Endpoints

### Autenticazione
- `POST /api/auth/register` - Registrazione
- `POST /api/auth/login` - Login

### Utente
- `GET /api/user/profile` - Profilo utente (auth required)

### Prenotazioni
- `GET /api/bookings` - Lista prenotazioni (auth required)
- `POST /api/bookings` - Crea prenotazione (auth required)
- `GET /api/bookings/:id` - Dettagli prenotazione (auth required)
- `DELETE /api/bookings/:id` - Cancella prenotazione (auth required)

### Admin
- `GET /api/admin/bookings` - Tutte le prenotazioni (admin required)
- `PATCH /api/admin/bookings/:id/status` - Aggiorna stato (admin required)
- `GET /api/admin/users` - Lista utenti (admin required)
- `GET /api/admin/stats` - Statistiche (admin required)

## 🔒 Autenticazione

Le API protette richiedono il token JWT nell'header:
```
Authorization: Bearer <token>
```

Il token viene salvato in `localStorage` dopo login/registrazione.

## 📄 Licenza

Questo progetto è privato.
