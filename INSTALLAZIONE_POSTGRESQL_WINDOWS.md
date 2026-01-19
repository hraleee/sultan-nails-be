# 🐘 Installazione PostgreSQL su Windows - Guida Completa

## Step 1: Scarica e Installa PostgreSQL

### Opzione A: Installer Ufficiale (Raccomandato)

1. **Scarica PostgreSQL**:
   - Vai su: https://www.postgresql.org/download/windows/
   - Clicca su **"Download the installer"**
   - Oppure diretto: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
   - Scarica la versione più recente (16.x o 15.x)

2. **Esegui l'installer**:
   - Avvia il file `.exe` scaricato
   - Clicca **"Next"** → **"Next"** → **"Next"**
   - **IMPORTANTE**: Durante l'installazione ti chiederà di impostare una password per l'utente `postgres`
   - ⚠️ **SALVA QUESTA PASSWORD** - ti servirà dopo!
   - Completa l'installazione (lascia default le porte, ecc.)

3. **Verifica installazione**:
   - Dopo l'installazione, dovresti vedere **"PostgreSQL 16"** nel menu Start

### Opzione B: PostgreSQL Portabile (senza installazione)

1. Scarica **pgAdmin Portable** o **PostgreSQL Portable** da:
   - https://github.com/garethflowers/postgresql-portable
   - Estratti in una cartella e avvia da lì

## Step 2: Avvia PostgreSQL

### Metodo 1: SQL Shell (psql) - Raccomandato

1. Apri il **Menu Start** di Windows
2. Cerca **"SQL Shell (psql)"** o **"psql"**
3. Clicca per aprire il terminale

Ti chiederà:
- **Server** [localhost]: premi **Invio** (default)
- **Database** [postgres]: premi **Invio** (default)
- **Port** [5432]: premi **Invio** (default)
- **Username** [postgres]: premi **Invio** (default)
- **Password**: inserisci la password che hai impostato durante l'installazione
  - ⚠️ Non vedrai caratteri mentre digiti (è normale)

Dovresti vedere:
```
postgres=#
```

### Metodo 2: pgAdmin (Interfaccia Grafica)

1. Apri **pgAdmin 4** dal menu Start
2. Ti chiederà la password del server (quella di `postgres`)
3. Ti mostrerà un'interfaccia grafica per gestire il database

## Step 3: Crea il Database

### Usando SQL Shell (psql)

Con il terminale `psql` aperto, esegui questi comandi uno alla volta:

```sql
-- Crea il database
CREATE DATABASE sultan_nails;

-- Verifica che sia stato creato
\l
```

Dovresti vedere `sultan_nails` nella lista dei database.

### Usando pgAdmin (Interfaccia Grafica)

1. Apri **pgAdmin 4**
2. Espandi **"Servers"** → **"PostgreSQL 16"** (o la tua versione)
3. Clicca destro su **"Databases"**
4. Seleziona **"Create"** → **"Database..."**
5. Nome database: `sultan_nails`
6. Clicca **"Save"**

## Step 4: Testa la Connessione

### Opzione 1: Test da terminale

Dal terminale `psql`, prova a connetterti al nuovo database:

```sql
-- Connettiti al database
\c sultan_nails

-- Se funziona, vedrai:
-- You are now connected to database "sultan_nails" as user "postgres".

-- Esci
\q
```

### Opzione 2: Test con script Node.js

Dopo aver configurato il backend (vedi Step 5), potrai testare con:

```bash
cd backend
npm run test-db
```

## Step 5: Configura il Backend

Ora devi configurare il backend per connettersi a questo database.

1. **Vai nella cartella backend**:
   ```bash
   cd backend
   ```

2. **Crea il file `.env`** con questo contenuto:

   ```env
   # Database locale - SOSTITUISCI "password" con la TUA password postgres
   DATABASE_URL=postgresql://postgres:password@localhost:5432/sultan_nails

   # JWT Secret (genera una chiave sicura)
   JWT_SECRET=super-secret-jwt-key-change-in-production-12345
   JWT_EXPIRES_IN=7d

   # Server
   PORT=5000
   NODE_ENV=development

   # CORS
   FRONTEND_URL=http://localhost:3000
   ```

   **⚠️ IMPORTANTE**: 
   - Sostituisci `password` con la password che hai impostato durante l'installazione PostgreSQL
   - Se hai usato un utente diverso da `postgres`, sostituisci anche quello

3. **Installa le dipendenze** (se non già fatto):
   ```bash
   npm install
   ```

4. **Testa la connessione**:
   ```bash
   npm run test-db
   ```

   Dovresti vedere:
   ```
   ✅ Database connected successfully!
   ```

5. **Crea le tabelle** (migrazione):
   ```bash
   npm run migrate
   ```

   Questo creerà:
   - Tabelle `users` e `bookings`
   - Utente admin di default (`admin@sultan-nails.it` / `admin123`)

## 🔍 Troubleshooting

### Errore: "password authentication failed"

**Soluzione**: La password in `.env` non corrisponde a quella di PostgreSQL
- Verifica la password in `.env` sia corretta
- Prova a reimpostare la password di postgres:
  1. Apri `psql`
  2. Connettiti come superuser
  3. `ALTER USER postgres PASSWORD 'nuova_password';`

### Errore: "database does not exist"

**Soluzione**: Il database non è stato creato
- Verifica che il database `sultan_nails` esista: `\l` in psql
- Se non esiste, crealo: `CREATE DATABASE sultan_nails;`

### Errore: "connection refused" o "could not connect"

**Soluzione**: PostgreSQL non è in esecuzione
- Windows: Apri **"Services"** (Win+R → `services.msc`)
- Cerca **"postgresql-x64-16"** (o la tua versione)
- Verifica che sia **"Running"**
- Se non lo è, clicca destro → **"Start"**

### PostgreSQL non trovato nel PATH

**Soluzione**: Aggiungi PostgreSQL al PATH
1. Cerca "Variabili d'ambiente" nel Menu Start
2. Clicca su **"Modifica le variabili d'ambiente"**
3. Clicca su **"Variabili d'ambiente..."**
4. Trova **"Path"** in "Variabili di sistema"
5. Clicca **"Modifica"** → **"Nuovo"**
6. Aggiungi: `C:\Program Files\PostgreSQL\16\bin` (sostituisci `16` con la tua versione)
7. Clicca **"OK"** e riavvia il terminale

### Come trovare la password dimenticata?

**Soluzione**: Reimposta la password
1. Apri File Explorer
2. Vai a: `C:\Program Files\PostgreSQL\16\data\` (o la tua versione)
3. Trova il file `pg_hba.conf`
4. Aprilo come amministratore
5. Trova la riga: `host all all 127.0.0.1/32 md5`
6. Cambia `md5` in `trust` (solo per localhost!)
7. Salva e riavvia il servizio PostgreSQL
8. Apri `psql` e connettiti senza password
9. Esegui: `ALTER USER postgres PASSWORD 'nuova_password';`
10. Ripristina `pg_hba.conf` cambiando `trust` in `md5`

## ✅ Verifica Finale

Se tutto è configurato correttamente:

1. ✅ PostgreSQL è installato e funzionante
2. ✅ Database `sultan_nails` esiste
3. ✅ File `.env` nel backend è configurato correttamente
4. ✅ `npm run test-db` funziona
5. ✅ `npm run migrate` ha creato le tabelle

**Ora puoi procedere con il setup locale!** Vedi `SETUP_LOCALE.md` per i prossimi passi.

