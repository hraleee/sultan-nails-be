# 🔐 Reset Password PostgreSQL - Soluzione Rapida

## Metodo 1: Reimposta Password (Raccomandato)

### Step 1: Modifica pg_hba.conf per permettere connessioni senza password (SOLO LOCALHOST!)

1. **Trova il file `pg_hba.conf`**:
   - Di solito è in: `C:\Program Files\PostgreSQL\16\data\pg_hba.conf`
   - Oppure: `C:\Program Files\PostgreSQL\15\data\pg_hba.conf`
   - (Sostituisci `16` o `15` con la tua versione)

2. **Apri il file come Amministratore**:
   - Clicca destro sul file → **"Apri con"** → **"Notepad"** (o qualsiasi editor)
   - Se necessario, clicca destro → **"Esegui come amministratore"**

3. **Trova questa riga** (circa riga 80-90):
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            md5
   ```

4. **Cambia `md5` in `trust`** per localhost:
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            trust
   ```
   
   ⚠️ **IMPORTANTE**: Cambia SOLO la riga per `127.0.0.1/32` (localhost). NON cambiare altre righe!

5. **Salva il file**

6. **Riavvia il servizio PostgreSQL**:
   - Premi **Win + R**
   - Digita: `services.msc`
   - Cerca **"postgresql-x64-16"** (o la tua versione)
   - Clicca destro → **"Riavvia"**

### Step 2: Connettiti senza password e reimposta

1. **Apri di nuovo SQL Shell (psql)**
2. **Per tutti i prompt, premi Invio** (password non richiesta)
3. Dovresti vedere: `postgres=#`

4. **Reimposta la password**:
   ```sql
   ALTER USER postgres PASSWORD 'nuova_password_facile';
   ```

   Esempio:
   ```sql
   ALTER USER postgres PASSWORD 'admin123';
   ```

5. **Verifica**:
   ```sql
   \du
   ```
   Dovresti vedere l'utente `postgres`

### Step 3: Ripristina la sicurezza

⚠️ **IMPORTANTE**: Ora devi ripristinare la sicurezza!

1. **Apri di nuovo `pg_hba.conf`**
2. **Cambia `trust` in `md5`**:
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            md5
   ```
3. **Salva**
4. **Riavvia il servizio PostgreSQL** (come prima)

Ora dovresti poter accedere con la nuova password!

## Metodo 2: Usa la porta corretta

Vedo che stai usando la porta **5433** invece di **5432**. Prova così:

1. Quando psql chiede:
   - **Port [5432]:** → Digita `5433` e premi Invio

Oppure modifica il `.env` del backend per usare la porta 5433:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5433/sultan_nails
```

## Metodo 3: Prova password comuni

Se hai appena installato PostgreSQL, prova queste password comuni:

- `postgres`
- `admin`
- `root`
- `123456`
- La password che hai scelto durante l'installazione

## Verifica quale porta usa PostgreSQL

Per verificare quale porta sta usando PostgreSQL:

1. Apri **pgAdmin 4**
2. Connettiti al server (potrebbe chiedere password)
3. Vedi le proprietà del server per la porta

Oppure:

1. Apri **Services** (Win+R → `services.msc`)
2. Cerca il servizio PostgreSQL
3. Clicca destro → **Proprietà** → **Log On**
4. Controlla la configurazione

## Dopo aver risolto

Una volta che riesci a connetterti:

```sql
-- Crea il database
CREATE DATABASE sultan_nails;

-- Verifica
\l

-- Esci
\q
```

