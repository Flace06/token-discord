const { EmbedBuilder } = require('discord.js');
const Guild = require('../../database/models/Guild');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    const config = await Guild.findOne({ guildId: member.guild.id });
    if (!config?.welcome?.enabled || !config.welcome.channelId) return;

    const channel = member.guild.channels.cache.get(config.welcome.channelId);
    if (!channel) return;

    const message = config.welcome.message
      .replace('{user}', member.toString())
      .replace('{server}', member.guild.name)
      .replace('{count}', member.guild.memberCount);

    const embed = new EmbedBuilder()
      .setColor(config.welcome.embedColor || '#1E90FF')
      .setTitle('Willkommen!')
      .setDescription(message)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Mitglied #${member.guild.memberCount}` })
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => {});
  }
};
