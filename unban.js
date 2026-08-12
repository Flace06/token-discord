const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Entbannt einen User')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(o => o.setName('userid').setDescription('User ID').setRequired(true))
    .addStringOption(o => o.setName('grund').setDescription('Grund')),

  async execute(interaction) {
    const userId = interaction.options.getString('userid');
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    try {
      await interaction.guild.bans.remove(userId, reason);
      const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ User entbannt')
        .addFields(
          { name: 'User ID', value: userId, inline: true },
          { name: 'Moderator', value: interaction.user.tag, inline: true },
          { name: 'Grund', value: reason }
        )
        .setTimestamp();
      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply({ content: '❌ User nicht gefunden oder nicht gebannt.', ephemeral: true });
    }
  }
};
