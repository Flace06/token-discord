const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bannt einen User vom Server')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(o => o.setName('user').setDescription('Der User').setRequired(true))
    .addStringOption(o => o.setName('grund').setDescription('Grund').setRequired(false))
    .addIntegerOption(o => o.setName('tage').setDescription('Nachrichten löschen (Tage)').setMinValue(0).setMaxValue(7)),

  async execute(interaction) {
    const target = interaction.options.getUser('user');
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';
    const days = interaction.options.getInteger('tage') || 0;

    const member = interaction.guild.members.cache.get(target.id);
    if (member) {
      if (!member.bannable) return interaction.reply({ content: '❌ Ich kann diesen User nicht bannen.', ephemeral: true });
      if (member.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply({ content: '❌ Du kannst diesen User nicht bannen.', ephemeral: true });
      }
    }

    await interaction.guild.bans.create(target.id, { reason, deleteMessageSeconds: days * 86400 });

    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle('🔨 User gebannt')
      .addFields(
        { name: 'User', value: `${target.tag} (${target.id})`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Grund', value: reason }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
