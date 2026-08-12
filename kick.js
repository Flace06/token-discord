const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kickt einen User vom Server')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(o => o.setName('user').setDescription('Der User').setRequired(true))
    .addStringOption(o => o.setName('grund').setDescription('Grund')),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (!target) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
    if (!target.kickable) return interaction.reply({ content: '❌ Ich kann diesen User nicht kicken.', ephemeral: true });
    if (target.roles.highest.position >= interaction.member.roles.highest.position) {
      return interaction.reply({ content: '❌ Du kannst diesen User nicht kicken.', ephemeral: true });
    }

    await target.kick(reason);

    const embed = new EmbedBuilder()
      .setColor('#FFA500')
      .setTitle('👢 User gekickt')
      .addFields(
        { name: 'User', value: `${target.user.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Grund', value: reason }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
