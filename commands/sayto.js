
const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sayto')
    .setDescription('Kirim pesan ke channel tertentu')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel tujuan')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true))
    .addStringOption(option =>
      option.setName('message')
        .setDescription('Pesan yang ingin dikirim')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const msg = interaction.options.getString('message');
    await channel.send(msg);
    await interaction.reply({ content: `Pesan dikirim ke ${channel}`, ephemeral: true });
  }
};
