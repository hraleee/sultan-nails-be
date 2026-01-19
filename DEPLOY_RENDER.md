# 🚀 Guida Deploy Backend su Render

Guida passo-passo per pubblicare il backend su Render.

## 📋 Prerequisiti

- ✅ Backend testato e funzionante in locale
- ✅ Account su [Render.com](https://render.com) (gratis)
- ✅ Repository GitHub/GitLab con il codice

## 🗄️ Step 1: Crea Database PostgreSQL su Render

1. Accedi a [Render Dashboard](https://dashboard.render.com/)
2. Clicca su **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `sultan-nails-db` (o nome a scelta)
   - **Database**: `sultan_nails`
   - **User**: lascia default
   - **Region**: scegli la più vicina (es: `Frankfurt` per Italia)
   - **PostgreSQL Version**: `16` (o la più recente)
   - **Plan**: `Free` (per test) o `Starter` ($7/mese) per produzione
4. Clicca **"Create Database"**
5. ⚠️ **IMPORTANTE**: Copia la **"Internal Database URL"** - ti servirà dopo

## 🔧 Step 2: Crea Web Service per il Backend

1. Nel dashboard Render, clicca **"New +"** → **"Web Service"**
2. Connetti il tuo repository GitHub/GitLab
3. Seleziona il repository `sultan-nails`
4. Configura il servizio:

   **Configurazioni Base:**
   - **Name**: `sultan-nails-api` (o nome a scelta)
   - **Region**: stessa del database
   - **Branch**: `main` (o il tuo branch principale)
   - **Root Directory**: `backend` ⚠️ **IMPORTANTE!**
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (per test) o `Starter` ($7/mese) per produzione

   **Environment Variables** (clicca su "Advanced"):
   
   Aggiungi queste variabili:

   ```
   DATABASE_URL=<Internal Database URL copiato prima>
   JWT_SECRET=<genera-una-chiave-sicura-casuale-minimo-32-caratteri>
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=<url-del-tuo-frontend-su-vercel>
   PORT=10000
   ```

   **Esempio valori:**
   ```
   DATABASE_URL=postgresql://user:pass@dpg-xxxxx-a/sultan_nails
   JWT_SECRET=my-super-secret-jwt-key-min-32-chars-123456789012345
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   FRONTEND_URL=https://sultan-nails.vercel.app
   PORT=10000
   ```

5. Clicca **"Create Web Service"**

## 🔄 Step 3: Esegui Migrazioni sul Database Render

Il database su Render deve avere le tabelle create. Hai due opzioni:

### Opzione A: Migrazioni via psql (Raccomandato)

1. Vai al tuo database PostgreSQL su Render
2. Clicca su **"Connect"** → **"External Connection"**
3. Copia la connection string esterna
4. Installa `psql` se non ce l'hai:
   - **Windows**: incluso in PostgreSQL installer
   - **Mac**: `brew install postgresql`
   - **Linux**: `sudo apt install postgresql-client`

5. Esegui le migrazioni:

```bash
# Dalla cartella backend del tuo progetto locale
cd backend

# Modifica temporaneamente DATABASE_URL nel .env con l'URL esterno Render
# Poi esegui:
npm run migrate
```

### Opzione B: Migrazioni manuali via Render Dashboard

1. Vai al database PostgreSQL su Render
2. Clicca su **"Connect"** → **"psql"** (apre un terminale)
3. Copia e incolla questo SQL:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_name VARCHAR(255) NOT NULL,
  service_price DECIMAL(10, 2),
  booking_date TIMESTAMP NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create admin user (password: admin123)
-- Usa questo comando solo se vuoi creare l'admin manualmente
-- INSERT INTO users (email, password_hash, first_name, last_name, role) 
-- VALUES ('admin@sultan-nails.it', '$2a$10$YourHashedPassword', 'Admin', 'Sultan', 'admin');
```

## ✅ Step 4: Verifica il Deploy

1. Vai al Web Service su Render
2. Controlla i **"Logs"** - dovresti vedere:
   ```
   ✅ Connected to PostgreSQL database
   🚀 Server running on port 10000
   ```

3. Clicca sull'URL del servizio (es: `https://sultan-nails-api.onrender.com`)
4. Dovresti vedere: `{"status":"ok","message":"Sultan Nails API is running"}`

5. Testa l'endpoint health:
   ```
   https://tuo-servizio.onrender.com/health
   ```

## 🔗 Step 5: Aggiorna Frontend su Vercel

Ora devi aggiornare il frontend su Vercel per connettersi al backend Render.

### 5.1 Aggiorna Environment Variables su Vercel

1. Vai al tuo progetto su [Vercel Dashboard](https://vercel.com/dashboard)
2. Clicca su **Settings** → **Environment Variables**
3. Aggiungi/modifica:

   ```
   NEXT_PUBLIC_API_URL=https://tuo-servizio.onrender.com/api
   ```

   Sostituisci `tuo-servizio` con il nome del tuo servizio Render.

4. Clicca **"Save"**
5. **Redeploy** il frontend:
   - Vai su **Deployments**
   - Clicca sui **3 punti** → **"Redeploy"**

### 5.2 Aggiorna CORS nel Backend Render

Assicurati che `FRONTEND_URL` in Render punti all'URL corretto del tuo frontend Vercel.

## 🧪 Step 6: Test Finale

1. Vai al tuo frontend su Vercel
2. Testa login/registrazione
3. Crea una prenotazione
4. Accedi come admin e verifica il pannello

## 🔒 Note Importanti

### Free Plan Limiti

- **Web Service Render Free**:
  - Va in "sleep" dopo 15 minuti di inattività
  - Primo avvio dopo sleep: ~30-60 secondi
  - Considera `Starter` plan ($7/mese) per produzione

- **PostgreSQL Render Free**:
  - 90 giorni di retention dati
  - Per produzione usa `Starter` ($7/mese)

### Sicurezza

- ✅ Usa una `JWT_SECRET` forte (minimo 32 caratteri casuali)
- ✅ Usa `Internal Database URL` per sicurezza (non `External`)
- ✅ Abilita HTTPS (automatico su Render)

### Monitoraggio

- Controlla i logs su Render per errori
- Monitora l'uso del database
- Imposta alert per downtime

## 🎉 Fatto!

Il tuo backend è ora live su Render e il frontend su Vercel può comunicarci!

**URL Backend**: `https://tuo-servizio.onrender.com`  
**URL Frontend**: `https://tuo-frontend.vercel.app`

