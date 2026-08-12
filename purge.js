const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Löscht Nachrichten im Channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption(o => o.setName('anzahl').setDescription('Anzahl (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
    .addUserOption(o => o.setName('user').setDescription('Nur Nachrichten von diesem User')),

  async execute(interaction) {
    const amount = interaction.options.getInteger('anzahl');
    const targetUser = interaction.options.getUser('user');

    await interaction.deferReply({ ephemeral: true });

    let messages = await interaction.channel.messages.fetch({ limit: 100 });
    if (targetUser) messages = messages.filter(m => m.author.id === targetUser.id);
    messages = [...messages.values()].slice(0, amount);

    const deleted = await interaction.channel.bulkDelete(messages, true).catch(() => null);
    const count = deleted ? deleted.size : messages.length;

    await interaction.editReply({ content: `✅ **${count}** Nachrichten gelöscht.` });
  }
};
