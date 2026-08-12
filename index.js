require('dotenv').config();

// Zeigt JEDEN Fehler im Log an
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ UNHANDLED REJECTION:', reason);
  process.exit(1);
});

// Env-Variablen prüfen
const required = ['BOT_TOKEN', 'CLIENT_ID', 'CLIENT_SECRET', 'MONGODB_URI'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Fehlende Umgebungsvariable: ${key}`);
    process.exit(1);
  }
}

console.log('✅ Alle Umgebungsvariablen vorhanden');

const { startBot } = require('./src/bot/client');
const { startDashboard } = require('./src/dashboard/index');
const { connectDatabase } = require('./src/database/index');

async function main() {
  try {
    console.log('🔄 Verbinde mit Datenbank...');
    await connectDatabase();
    console.log('✅ Datenbank verbunden');

    console.log('🔄 Starte Discord Bot...');
    await startBot();
    console.log('✅ Discord Bot gestartet');

    console.log('🔄 Starte Dashboard...');
    startDashboard();
  } catch (error) {
    console.error('❌ Startfehler:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
