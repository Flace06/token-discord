const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },

  welcome: {
    enabled: { type: Boolean, default: false },
    channelId: String,
    message: { type: String, default: 'Willkommen {user} auf **{server}**! 👋' },
    embedColor: { type: String, default: '#1E90FF' }
  },

  logging: {
    enabled: { type: Boolean, default: false },
    channelId: String,
    modLogChannelId: String
  },

  moderation: {
    mutedRoleId: String,
    autoMod: {
      enabled: { type: Boolean, default: false },
      antiInvites: { type: Boolean, default: false },
      antiLinks: { type: Boolean, default: false },
      antiSpam: { type: Boolean, default: false }
    }
  },

  tickets: {
    enabled: { type: Boolean, default: false },
    categoryId: String,
    logChannelId: String,
    supportRoleIds: [String],
    panelChannelId: String,
    panelMessageId: String,
    ticketCounter: { type: Number, default: 0 },
    openMessage: { type: String, default: 'Beschreibe dein Anliegen und ein Teammitglied wird sich melden.' }
  },

  customCommands: [{
    name: String,
    description: { type: String, default: 'Ein benutzerdefinierter Befehl' },
    response: String,
    ephemeral: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true }
  }],

  rolePermissions: [{
    roleId: String,
    canBan: { type: Boolean, default: false },
    canKick: { type: Boolean, default: false },
    canMute: { type: Boolean, default: false },
    canWarn: { type: Boolean, default: false },
    canPurge: { type: Boolean, default: false },
    canManageTickets: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Guild', guildSchema);
