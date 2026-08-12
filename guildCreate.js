const Guild = require('../../database/models/Guild');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    await Guild.findOneAndUpdate(
      { guildId: guild.id },
      { guildId: guild.id },
      { upsert: true, new: true }
    );
    console.log(`➕ Neuer Server: ${guild.name}`);
  }
};
