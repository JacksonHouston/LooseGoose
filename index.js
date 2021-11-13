const { Client, Intents, Message } = require('discord.js');
require('dotenv').config();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', () => {
    console.log('Connected to the bot');
});

client.on('messageCreate', msg => {
    if (msg.content.toLowerCase().includes('honk')) {
        msg.channel.send('BONK!');
    }
    if (msg.content.toLowerCase().includes('bonk')) {
        msg.channel.send('I AM CHAOS!');
    }
    if (msg.content.toLowerCase().includes('goose')) {
        msg.channel.send('Erika is probably wrong...');
    }
    if (msg.content.toLowerCase().includes('intro')) {
        msg.channel.send('https://www.youtube.com/watch?v=n3DfLpdhXkg');
    }
});

(async() => {
    client.login(process.env.token);
})();