const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  ticketNumber: { type: Number, required: true },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  closedBy: String,
  closedAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
