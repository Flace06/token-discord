const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../../../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Zeigt die Verwarnungen eines Users')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('Der User').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const warnings = await Warning.find({ guildId: interaction.guildId, userId: target.id, active: true }).sort({ createdAt: -1 }).limit(10);

    const embed = new EmbedBuilder()
      .setColor('#1E90FF')
      .setTitle(`⚠️ Verwarnungen von ${target.tag}`)
      .setDescription(
        warnings.length === 0
          ? 'Keine aktiven Verwarnungen.'
          : warnings.map((w, i) => `**#${i + 1}** • ${w.reason} • <t:${Math.floor(w.createdAt.getTime() / 1000)}:R>`).join('\n')
      )
      .setFooter({ text: `${warnings.length} aktive Verwarnungen` })
      .setTimestamp();

    interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
