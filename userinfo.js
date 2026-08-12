const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Informationen über einen User')
    .addUserOption(o => o.setName('user').setDescription('Der User')),

  async execute(interaction) {
    const target = interaction.options.getMember('user') || interaction.member;
    const embed = new EmbedBuilder()
      .setColor('#1E90FF')
      .setTitle(`👤 ${target.user.tag}`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: 'ID', value: target.id, inline: true },
        { name: 'Beigetreten Discord', value: `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Beigetreten Server', value: `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Rollen', value: target.roles.cache.filter(r => r.id !== interaction.guildId).map(r => r.toString()).join(', ') || 'Keine', inline: false }
      )
      .setTimestamp();
    interaction.reply({ embeds: [embed] });
  }
};
