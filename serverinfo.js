const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder().setName('serverinfo').setDescription('Server-Informationen'),
  async execute(interaction) {
    const g = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor('#1E90FF')
      .setTitle(`🏠 ${g.name}`)
      .setThumbnail(g.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Owner', value: `<@${g.ownerId}>`, inline: true },
        { name: 'Mitglieder', value: g.memberCount.toString(), inline: true },
        { name: 'Erstellt', value: `<t:${Math.floor(g.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Kanäle', value: g.channels.cache.size.toString(), inline: true },
        { name: 'Rollen', value: g.roles.cache.size.toString(), inline: true },
        { name: 'Boost Level', value: g.premiumTier.toString(), inline: true }
      )
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
