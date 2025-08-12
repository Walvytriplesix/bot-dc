require('dotenv').config();

const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

const prefix = '?';
const kataKasar = [
  'anjing', 'bangsat', 'kontol', 'memek', 'goblok', 'yatim', 'piatu', 'bajingan', 'tolol', 'kampret', 'setan',
  'fuck', 'fck', 'f@ck', 'f.u.c.k', 'fuk', 'fucking', 'fuq', 'fu*k', 'fu**',
  'shit', 'sh1t', 'sh!t', 'sh*t',
  'bitch', 'b1tch', 'b!tch', 'biatch', 'b*tch',
  'dick', 'd1ck', 'd!ck', 'suckmydick', 'suck_my_dick',
  'asshole', 'ashole', 'a55hole',
  'nigga', 'nigger', 'ni**a', 'n1gga', 'ni99a',
  'cunt', 'pussy', 'p@ssy', 'p*ssy', 'cum', 'jizz',
  'retard', 'idiot', 'moron', 'stupid', 'dumbass', 'dumb', 'kill yourself', 'kys',
  'die bitch', 'die in hell', 'go to hell', 'kill urself'
];

const userWarnings = new Map();

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
  client.user.setActivity('Walvy Comunity : https://discord.gg/wbuGfwpm7B', { type: 3 });
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;

  const isAdmin = message.member.permissions.has(PermissionsBitField.Flags.ManageMessages);

  for (const kata of kataKasar) {
    if (message.content.toLowerCase().includes(kata)) {
      if (!isAdmin) {
        await message.delete();
        const userId = message.author.id;
        const warnCount = (userWarnings.get(userId) || 0) + 1;
        userWarnings.set(userId, warnCount);

        if (warnCount >= 5) {
          const mutedRole = message.guild.roles.cache.find(role => role.name === 'Muted');
          if (mutedRole) {
            await message.member.roles.add(mutedRole);
            message.channel.send(`${message.author} telah dimute selama 1 jam karena mengulangi kata kasar.`);
            setTimeout(() => {
              message.member.roles.remove(mutedRole);
              message.channel.send(`${message.author} telah di-unmute.`);
              userWarnings.set(userId, 0);
            }, 3600000);
          }
        } else {
          message.channel.send(`${message.author}, jangan berkata kasar! Peringatan ke-${warnCount}/5`);
        }
      }
      return;
    }
  }

  if (!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift().toLowerCase();

  if (cmd === 'say') {
    const content = message.content.slice(prefix.length + cmd.length).trim();
    const [mentionPart, ...messagePart] = content.split('-');
    const channel = message.mentions.channels.first();
    const msg = messagePart.join('-').trim();

    if (!channel || !msg) return message.reply('Format salah!\nContoh: `?say #general - Halo semua`');

    const embed = new EmbedBuilder()
      .setDescription(msg)
      .setColor(0xff0000)
      .setTimestamp();

    channel.send({ embeds: [embed] });
    return message.reply(`Pengumuman telah dikirim ke ${channel}`);
  }

  if (cmd === 'cc1') {
    if (!isAdmin) return message.reply('Hanya admin yang bisa menggunakan perintah ini.');
    await message.channel.bulkDelete(1, true);
    return message.channel.send('✅ 1 pesan terakhir telah dihapus.').then(msg => setTimeout(() => msg.delete(), 3000));
  }

  if (cmd === 'ccall') {
    if (!isAdmin) return message.reply('Hanya admin yang bisa menggunakan perintah ini.');
    const fetched = await message.channel.messages.fetch({ limit: 100 });
    await message.channel.bulkDelete(fetched, true);
    return message.channel.send('✅ Semua pesan telah dihapus.').then(msg => setTimeout(() => msg.delete(), 3000));
  }
});

const app = express();

app.get('/', (req, res) => res.send('Bot is running!'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Web server aktif di port ${port}`));

client.login(process.env.DISCORD_TOKEN);
