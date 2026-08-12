const mongoose = require('mongoose');

const warningSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  userId: { type: String, required: true },
  moderatorId: { type: String, required: true },
  reason: { type: String, default: 'Kein Grund angegeben' },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Warning', warningSchema);
