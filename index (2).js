const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const { requireAuth } = require('./middleware/auth');

function startDashboard() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'supergeheimespasswort',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
  }));

  // Routes
  app.use(authRoutes);
  app.use('/api', apiRoutes);

  // HTML Pages
  const pub = path.join(__dirname, 'public');
  app.get('/', (req, res) => res.sendFile(path.join(pub, 'index.html')));
  app.get('/servers', requireAuth, (req, res) => res.sendFile(path.join(pub, 'servers.html')));
  app.get('/dashboard/:guildId', requireAuth, (req, res) => res.sendFile(path.join(pub, 'server.html')));

  app.listen(PORT, () => {
    console.log(`✅ Dashboard läuft auf Port ${PORT}`);
  });
}

module.exports = { startDashboard };
