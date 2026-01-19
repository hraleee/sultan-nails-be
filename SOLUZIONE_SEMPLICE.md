# 🎯 Soluzione Semplice - Password PostgreSQL

## Prova Prima: Password Comuni

Se hai appena installato PostgreSQL, prova queste password quando psql la richiede:

1. `postgres` (nome utente)
2. `admin` 
3. `123456`
4. `password`
5. `root`

Prova a ricollegarti con SQL Shell (psql) e usa una di queste.

## Se Non Funziona: Usa pgAdmin

pgAdmin è più semplice da usare!

### Step 1: Apri pgAdmin

1. **Menu Start** di Windows
2. Cerca **"pgAdmin 4"**
3. Apri pgAdmin

### Step 2: Connettiti al Server

1. Vedrai **"Servers"** a sinistra
2. Espandi → Clicca su **"PostgreSQL 16"** (o la tua versione)
3. Ti chiederà la password
4. **Prova le password sopra** una per una

### Step 3: Crea Database (senza password!)

1. Se riesci ad entrare in pgAdmin:
   - Clicca destro su **"Databases"** (sotto PostgreSQL)
   - **"Create"** → **"Database..."**
   - Nome: `sultan_nails`
   - Clicca **"Save"**

2. **FATTO!** Il database è creato.

### Step 4: Se Non Sai la Password - Crea Utente Nuovo

Se pgAdmin funziona ma vuoi un utente con password che ricordi:

1. In pgAdmin, clicca destro su **"Login/Group Roles"**
2. **"Create"** → **"Login/Group Role..."**
3. Tab **"General"**:
   - Name: `sultan_user`
4. Tab **"Definition"**:
   - Password: `sultan123` (o quello che vuoi)
5. Tab **"Privileges"**:
   - ✅ Superuser
   - ✅ Can login
6. Clicca **"Save"**

Ora puoi usare:
- Username: `sultan_user`
- Password: `sultan123`

## Se Nemmeno pgAdmin Funziona

### Installazione Pulita

Se proprio non funziona, reinstalla PostgreSQL:

1. **Disinstalla PostgreSQL**:
   - Pannello di Controllo → Programmi → Disinstalla

2. **Reinstalla PostgreSQL**:
   - https://www.postgresql.org/download/windows/
   - Durante installazione, **SCEGLI UNA PASSWORD FACILE** (es: `admin123`)
   - **SCRIVILA DA QUALCHE PARTE!**

3. **Dopo installazione**:
   - Apri SQL Shell (psql)
   - Usa la password che hai scelto

## Configurazione Backend

Una volta creato il database, configura il backend:

Nel file `backend/.env`:

```env
# Se usi l'utente postgres con password "admin123":
DATABASE_URL=postgresql://postgres:admin123@localhost:5433/sultan_nails

# OPPURE se hai creato sultan_user:
DATABASE_URL=postgresql://sultan_user:sultan123@localhost:5433/sultan_nails
```

⚠️ **NOTA**: Ho messo porta `5433` perché la stavi usando. Se è `5432`, cambiala.

