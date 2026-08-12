# Discord Bot mit Web-Dashboard

Feature-reicher Discord Bot mit vollständigem Web-Dashboard, deploy-ready für GitHub + Render.

## Features

- **Moderation:** Ban, Kick, Timeout, Warn, Purge, Unban
- **Ticket-System:** Button-basiert, eigene Kanäle, Support-Rollen
- **Willkommensnachrichten:** Anpassbar, mit Embed
- **Custom Commands:** Eigene Slash-Commands via Dashboard
- **Rollen-Rechte:** Bot-Berechtigungen pro Rolle konfigurieren
- **Logging:** Mod-Log und Server-Log
- **Web-Dashboard:** Discord OAuth2, dark design

---

## Setup (Lokal)

### 1. Bot erstellen
1. Gehe zu https://discord.com/developers/applications
2. Klicke **New Application**
3. Gehe zu **Bot** → **Add Bot**
4. Kopiere den **Token**
5. Gehe zu **OAuth2** → kopiere **Client ID** und **Client Secret**

### 2. Redirect URL hinzufügen
In **OAuth2 → Redirects** diese URL hinzufügen:
```
http://localhost:3000/auth/callback
```

### 3. Installation
```bash
npm install
cp .env.example .env
# .env ausfüllen (Token, Client ID, etc.)
```

### 4. Commands deployen
```bash
npm run deploy
```

### 5. Bot starten
```bash
npm run dev   # Entwicklung (mit nodemon)
npm start     # Produktion
```

Dashboard öffnen: http://localhost:3000

---

## Deployment auf Render

### Schritt 1: GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dein-user/dein-repo.git
git push -u origin main
```

### Schritt 2: Render
1. Gehe zu https://render.com → **New Web Service**
2. Verbinde dein GitHub-Repository
3. Render erkennt `render.yaml` automatisch
4. Trage alle **Environment Variables** ein:
   - `BOT_TOKEN`
   - `CLIENT_ID`
   - `CLIENT_SECRET`
   - `MONGODB_URI` → MongoDB Atlas kostenloser Cluster
   - `DASHBOARD_URL` → deine Render-URL (z.B. `https://dein-bot.onrender.com`)
5. Klicke **Deploy**

### Schritt 3: Redirect URL updaten
In Discord Developer Portal → OAuth2 → Redirects:
```
https://dein-bot.onrender.com/auth/callback
```

### Schritt 4: Commands deployen
Lokal ausführen (einmalig):
```bash
npm run deploy
```

---

## Bot einladen

Einladungslink generieren:
**Discord Developer Portal → OAuth2 → URL Generator**
- Scopes: `bot`, `applications.commands`
- Permissions: `Administrator` (oder spezifische Berechtigungen)

---

## Umgebungsvariablen

| Variable | Beschreibung |
|---|---|
| `BOT_TOKEN` | Discord Bot Token |
| `CLIENT_ID` | Discord Application Client ID |
| `CLIENT_SECRET` | Discord Application Client Secret |
| `MONGODB_URI` | MongoDB Atlas Connection String |
| `DASHBOARD_URL` | Öffentliche URL des Dashboards |
| `SESSION_SECRET` | Geheimer Schlüssel für Sessions |
| `PORT` | Server-Port (Render setzt automatisch) |
