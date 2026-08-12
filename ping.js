const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Bot-Latenz anzeigen'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#1E90FF')
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Bot-Latenz', value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
        { name: 'API-Latenz', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
      );
    interaction.reply({ embeds: [embed] });
  }
};
