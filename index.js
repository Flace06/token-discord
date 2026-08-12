const mongoose = require('mongoose');

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI fehlt in .env');

  await mongoose.connect(uri);
}

module.exports = { connectDatabase };
