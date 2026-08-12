const { EmbedBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');
const Ticket = require('../../database/models/Ticket');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    // Slash Commands
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      // Custom Commands aus DB prüfen
      const config = await Guild.findOne({ guildId: interaction.guildId });
      if (config) {
        const custom = config.customCommands.find(
          c => c.name === interaction.commandName && c.enabled
        );
        if (custom) {
          return interaction.reply({ content: custom.response, ephemeral: custom.ephemeral });
        }
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Fehler bei /${interaction.commandName}:`, error);
        const errorMsg = { content: '❌ Ein Fehler ist aufgetreten.', ephemeral: true };
        if (interaction.replied || interaction.deferred) {
          interaction.followUp(errorMsg).catch(() => {});
        } else {
          interaction.reply(errorMsg).catch(() => {});
        }
      }
    }

    // Ticket-Buttons
    if (interaction.isButton()) {
      if (interaction.customId === 'ticket_create') {
        await handleTicketCreate(interaction);
      } else if (interaction.customId === 'ticket_close') {
        await handleTicketClose(interaction);
      }
    }
  }
};

async function handleTicketCreate(interaction) {
  const config = await Guild.findOne({ guildId: interaction.guildId });
  if (!config?.tickets?.enabled) {
    return interaction.reply({ content: '❌ Tickets sind deaktiviert.', ephemeral: true });
  }

  const existing = await Ticket.findOne({ guildId: interaction.guildId, userId: interaction.user.id, status: 'open' });
  if (existing) {
    return interaction.reply({ content: `❌ Du hast bereits ein offenes Ticket: <#${existing.channelId}>`, ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  config.tickets.ticketCounter += 1;
  await config.save();

  const ticketNumber = config.tickets.ticketCounter;
  const category = config.tickets.categoryId
    ? interaction.guild.channels.cache.get(config.tickets.categoryId)
    : null;

  const channel = await interaction.guild.channels.create({
    name: `ticket-${ticketNumber.toString().padStart(4, '0')}`,
    parent: category,
    permissionOverwrites: [
      { id: interaction.guild.id, deny: ['ViewChannel'] },
      { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages', 'AttachFiles'] },
      ...(config.tickets.supportRoleIds || []).map(roleId => ({
        id: roleId,
        allow: ['ViewChannel', 'SendMessages', 'AttachFiles', 'ManageMessages']
      }))
    ]
  });

  await Ticket.create({
    guildId: interaction.guildId,
    channelId: channel.id,
    userId: interaction.user.id,
    ticketNumber
  });

  const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
    .setColor('#1E90FF')
    .setTitle(`🎫 Ticket #${ticketNumber.toString().padStart(4, '0')}`)
    .setDescription(config.tickets.openMessage || 'Beschreibe dein Anliegen.')
    .addFields({ name: 'Erstellt von', value: interaction.user.toString(), inline: true })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('ticket_close').setLabel('🔒 Ticket schließen').setStyle(ButtonStyle.Danger)
  );

  await channel.send({ embeds: [embed], components: [row] });
  await interaction.editReply({ content: `✅ Dein Ticket wurde erstellt: ${channel}` });
}

async function handleTicketClose(interaction) {
  const ticket = await Ticket.findOne({ channelId: interaction.channelId, status: 'open' });
  if (!ticket) return interaction.reply({ content: '❌ Kein offenes Ticket in diesem Channel.', ephemeral: true });

  await interaction.reply({ content: '🔒 Ticket wird geschlossen...' });

  ticket.status = 'closed';
  ticket.closedBy = interaction.user.id;
  ticket.closedAt = new Date();
  await ticket.save();

  setTimeout(() => {
    interaction.channel.delete().catch(() => {});
  }, 5000);
}
