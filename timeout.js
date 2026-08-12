const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const DURATIONS = {
  '60': 60 * 1000,
  '300': 5 * 60 * 1000,
  '600': 10 * 60 * 1000,
  '3600': 60 * 60 * 1000,
  '86400': 24 * 60 * 60 * 1000,
  '604800': 7 * 24 * 60 * 60 * 1000
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Gibt einem User einen Timeout')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(o => o.setName('user').setDescription('Der User').setRequired(true))
    .addStringOption(o =>
      o.setName('dauer').setDescription('Dauer').setRequired(true)
        .addChoices(
          { name: '1 Minute', value: '60' },
          { name: '5 Minuten', value: '300' },
          { name: '10 Minuten', value: '600' },
          { name: '1 Stunde', value: '3600' },
          { name: '1 Tag', value: '86400' },
          { name: '1 Woche', value: '604800' }
        ))
    .addStringOption(o => o.setName('grund').setDescription('Grund')),

  async execute(interaction) {
    const target = interaction.options.getMember('user');
    const dauer = interaction.options.getString('dauer');
    const reason = interaction.options.getString('grund') || 'Kein Grund angegeben';

    if (!target) return interaction.reply({ content: '❌ User nicht gefunden.', ephemeral: true });
    if (!target.moderatable) return interaction.reply({ content: '❌ Ich kann diesen User nicht timen.', ephemeral: true });

    await target.timeout(DURATIONS[dauer], reason);

    const embed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('⏰ Timeout vergeben')
      .addFields(
        { name: 'User', value: `${target.user.tag}`, inline: true },
        { name: 'Dauer', value: `<t:${Math.floor((Date.now() + DURATIONS[dauer]) / 1000)}:R>`, inline: true },
        { name: 'Moderator', value: interaction.user.tag, inline: true },
        { name: 'Grund', value: reason }
      )
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
