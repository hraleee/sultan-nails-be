# 🛠️ Guida Setup Locale - Sultan Nails

Questa guida ti aiuta a configurare e testare tutto in locale prima di pubblicare su Render.

## 📋 Prerequisiti

1. **Node.js 18+** installato ([download](https://nodejs.org/))
2. **PostgreSQL** installato e funzionante:
   - **Windows**: [PostgreSQL per Windows](https://www.postgresql.org/download/windows/)
   - **Mac**: `brew install postgresql` o [Postgres.app](https://postgresapp.com/)
   - **Linux**: `sudo apt install postgresql` (Ubuntu/Debian)

## 🗄️ Step 1: Setup Database PostgreSQL Locale

### Crea il database

Apri il terminale e connettiti a PostgreSQL:

```bash
# Windows: apri "SQL Shell (psql)" dal menu Start
# Mac/Linux: 
psql postgres
```

Poi esegui questi comandi SQL:

```sql
-- Crea database
CREATE DATABASE sultan_nails;

-- Crea utente (opzionale, puoi usare il tuo utente esistente)
CREATE USER sultan_user WITH PASSWORD 'sultan_password';

-- Assegna permessi
GRANT ALL PRIVILEGES ON DATABASE sultan_nails TO sultan_user;

-- Esci
\q
```

**Nota**: Se non crei un nuovo utente, usa le tue credenziali PostgreSQL esistenti.

## 🔧 Step 2: Configura Backend Locale

### 2.1 Installa dipendenze backend

```bash
cd backend
npm install
```

### 2.2 Crea file `.env` nel backend

Crea un file `.env` nella cartella `backend/` con questo contenuto:

```env
# Database locale
DATABASE_URL=postgresql://sultan_user:sultan_password@localhost:5432/sultan_nails
# Se usi le credenziali di default:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/sultan_nails

# JWT Secret (genera una chiave casuale sicura)
JWT_SECRET=super-secret-jwt-key-change-in-production-12345
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS (URL del frontend locale Next.js)
FRONTEND_URL=http://localhost:3000
```

**⚠️ IMPORTANTE**: 
- Sostituisci `sultan_user` e `sultan_password` con le tue credenziali PostgreSQL
- Sostituisci `your_password` con la tua password PostgreSQL se usi l'utente `postgres`

### 2.3 Esegui le migrazioni del database

```bash
cd backend
npm run migrate
```

Questo creerà:
- Tabella `users` (utenti)
- Tabella `bookings` (prenotazioni)
- Utente admin di default:
  - **Email**: `admin@sultan-nails.it`
  - **Password**: `admin123`

### 2.4 Avvia il backend

```bash
cd backend
npm run dev
```

Dovresti vedere:
```
✅ Connected to PostgreSQL database
🚀 Server running on port 5000
🌍 Environment: development
```

**Il backend è ora attivo su `http://localhost:5000`**

## 🎨 Step 3: Configura Frontend Locale

### 3.1 Installa dipendenze frontend (se non ancora fatto)

Dalla root del progetto:

```bash
npm install
```

### 3.2 Crea file `.env.local` nella root

Crea un file `.env.local` nella root del progetto (accanto a `package.json`) con:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3.3 Avvia il frontend

```bash
npm run dev
```

Il frontend sarà disponibile su `http://localhost:3000`

## ✅ Step 4: Testa l'Applicazione

### Test Login/Registrazione

1. Apri `http://localhost:3000`
2. Clicca su **"Accedi"** nell'header
3. Registra un nuovo account o usa:
   - **Admin**: `admin@sultan-nails.it` / `admin123`
   - Crea un nuovo utente dalla pagina registrazione

### Test Area Utente

1. Dopo il login, dovresti essere reindirizzato a `/area-utente`
2. Clicca su **"Nuova Prenotazione"**
3. Compila il form e crea una prenotazione
4. Verifica che la prenotazione appaia nella lista

### Test Area Admin

1. Accedi con `admin@sultan-nails.it` / `admin123`
2. Dovresti essere reindirizzato a `/admin`
3. Verifica:
   - Tab "Prenotazioni": tutte le prenotazioni
   - Tab "Utenti": lista utenti
   - Tab "Statistiche": statistiche sistema

## 🔍 Troubleshooting

### Errore: "Cannot connect to database"

**Soluzione**:
1. Verifica che PostgreSQL sia in esecuzione
2. Controlla che `DATABASE_URL` in `.env` sia corretto
3. Verifica credenziali utente/password

### Errore: "Port 5000 already in use"

**Soluzione**: Cambia `PORT=5001` in `backend/.env` e aggiorna `NEXT_PUBLIC_API_URL=http://localhost:5001/api`

### Errore: CORS nel browser

**Soluzione**: Verifica che `FRONTEND_URL=http://localhost:3000` sia corretto in `backend/.env`

### Il frontend non si connette al backend

**Soluzione**:
1. Verifica che il backend sia in esecuzione (`npm run dev` in `backend/`)
2. Verifica che `.env.local` contenga `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
3. Riavvia il frontend dopo aver modificato `.env.local`

## 📦 Pronto per Render?

Una volta testato tutto in locale e funzionante:

1. ✅ Backend funziona su `localhost:5000`
2. ✅ Database PostgreSQL con tabelle create
3. ✅ Frontend si connette al backend
4. ✅ Login/Registrazione funziona
5. ✅ Prenotazioni funzionano
6. ✅ Area admin funziona

Ora puoi procedere al deploy su Render! Vedi `DEPLOY_RENDER.md` per le istruzioni.

