const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../../../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Verwarnt einen User')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('Der User').setRequired(true))
    .addStringOption(o => o.setName('grund').setDescription('Grund').setRequired(true)),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('grund');

    if (!target) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });

    const warning = await Warning.create({
      guildId: interaction.guildId,
      userId: target.id,
      moderatorId: interaction.user.id,
      reason
    });

    const totalWarnings = await Warning.countDocuments({ guildId: interaction.guildId, userId: target.id, active: true });

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('⚠️ Verwarnung')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Verwarnung #', value: totalWarnings.toString(), inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Grund', value: reason }
      )
      .setFooter({ text: `ID: ${warning._id}` })
      .setTimestamp();

    try {
      await target.user.send({ embeds: [new EmbedBuilder().setColor('#FFA500').setTitle(`⚠️ Verwarnung auf ${interaction.guild.name}`).setDescription(`**Grund:** ${reason}`).setTimestamp()] });
    } catch {}

    interaction.reply({ embeds: [embed] });
  }
};
