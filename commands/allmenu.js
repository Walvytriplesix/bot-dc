
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('allmenu')
    .setDescription('Menampilkan semua perintah bot'),
  async execute(interaction) {
    await interaction.reply({
      content:
        '**📜 List Menu:**\n' +
        '`/sayto` – Kirim pesan ke channel\n' +
        '`/ban` – Ban member\n' +
        '`/kick` – Kick member\n' +
        '`/mute` – Mute member\n' +
        '`/allmenu` – Tampilkan semua command\n',
      ephemeral: true
    });
  }
};
