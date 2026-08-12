const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../../database/models/Guild');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Ticket-System verwalten')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(s => s.setName('panel').setDescription('Sendet das Ticket-Panel in den aktuellen Channel'))
    .addSubcommand(s => s.setName('setup').setDescription('Richtet das Ticket-System ein')),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    if (sub === 'panel') {
      const config = await Guild.findOne({ guildId: interaction.guildId });
      if (!config?.tickets?.enabled) {
        return interaction.reply({ content: '❌ Ticket-System nicht aktiviert. Aktiviere es im Dashboard.', ephemeral: true });
      }

      const embed = new EmbedBuilder()
        .setColor('#1E90FF')
        .setTitle('🎫 Support Tickets')
        .setDescription(config.tickets.openMessage || 'Klicke den Button um ein Ticket zu erstellen.')
        .setFooter({ text: interaction.guild.name });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('ticket_create')
          .setLabel('🎫 Ticket erstellen')
          .setStyle(ButtonStyle.Primary)
      );

      const msg = await interaction.channel.send({ embeds: [embed], components: [row] });

      await Guild.findOneAndUpdate(
        { guildId: interaction.guildId },
        { 'tickets.panelChannelId': interaction.channelId, 'tickets.panelMessageId': msg.id }
      );

      interaction.reply({ content: '✅ Panel gesendet!', ephemeral: true });
    }

    if (sub === 'setup') {
      interaction.reply({ content: '⚙️ Konfiguriere das Ticket-System im **Web-Dashboard**.', ephemeral: true });
    }
  }
};
