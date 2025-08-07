
const { Client, GatewayIntentBits, Collection, Events, ActivityType, PermissionsBitField } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Set status bot saat ready
client.once(Events.ClientReady, () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
  client.user.setActivity('/allmenu', { type: ActivityType.Watching });
});

// Anti link + auto mute
const bannedWords = ['discord.gg/', 'lootabs', 'linkvertise', 'github.com'];
const bypassList = ['lootabs.com/bypass-link', 'linkvertise.com/unlock'];

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
  const lower = message.content.toLowerCase();
  const isBypassed = bypassList.some(link => lower.includes(link));
  if (!isBypassed && bannedWords.some(w => lower.includes(w))) {
    await message.delete();
    await message.member.timeout(60_000, 'Mengirim link tidak diizinkan');
    message.channel.send(`⛔ ${message.member} kamu dimute 1 menit karena mengirim link terlarang!`);
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (command) {
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'Terjadi error saat mengeksekusi perintah.', ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
