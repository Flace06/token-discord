require('dotenv').config();
const { startBot } = require('./src/bot/client');
const { startDashboard } = require('./src/dashboard/index');
const { connectDatabase } = require('./src/database/index');

async function main() {
  try {
    await connectDatabase();
    console.log('✅ Datenbank verbunden');

    await startBot();
    console.log('✅ Discord Bot gestartet');

    startDashboard();
  } catch (error) {
    console.error('❌ Startfehler:', error);
    process.exit(1);
  }
}

main();
