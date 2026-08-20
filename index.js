const { Client, GatewayIntentBits } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");

const token = process.env.DISCORD_TOKEN;
if (!token) throw new Error("Missing DISCORD_TOKEN secret.");

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

bot.once("ready", () => console.log(`Logged in as ${bot.user.tag}`));

bot.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  const command = message.content.trim().toLowerCase();

  if (command === ",leave") {
    message.guild.members.me?.voice.disconnect();
    await message.reply("Umalis na ako sa voice channel.");
    return;
  }

  if (command !== ",join" && command !== ",stay") return;
  const channel = message.member?.voice?.channel;
  if (!channel) return message.reply("Sumali ka muna sa voice channel.");

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfDeaf: true,
    selfMute: true,
  });
  await message.reply(`Okay, sumali ako sa **${channel.name}**.`);
});

bot.login(token);
