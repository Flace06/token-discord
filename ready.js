const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ Eingeloggt als ${client.user.tag}`);
    client.user.setActivity({ name: `${client.guilds.cache.size} Server`, type: ActivityType.Watching });
  }
};
