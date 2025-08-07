
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Timeout/mute member')
    .addUserOption(option => option.setName('target').setRequired(true))
    .addIntegerOption(option => option.setName('duration').setDescription('Durasi mute dalam detik').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('target');
    const duration = interaction.options.getInteger('duration') * 1000;
    const member = await interaction.guild.members.fetch(target.id);
    await member.timeout(duration, 'Muted oleh admin');
    await interaction.reply(`🔇 ${target.tag} telah dimute selama ${duration / 1000} detik.`);
  }
};
