const { Client, Intents, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
/*
var randomMessage;
var randOn = false;
var responseArray = [ //add more messages here
  'HONK',
  'BONK',
  'CHAOS'
];
var prefix = '!';
var timer = [5,10];
*/
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
/*
client.on('messageCreate', msg => {
    if (msg.content.toLowerCase().includes('honk')) {
        msg.channel.send('goose');
    }
    if (msg.content.toLowerCase().includes('chaos')) {
        msg.channel.send('I AM CHAOS!');
    }
    if (msg.content.toLowerCase().includes('goose')) {
        msg.channel.send('honk');
    }
});

client.on('messageCreate', msg => {
    if (msg.content === '!on') {
          if (randOn) {
              msg.channel.send('Already running.');
          }
          else {
                msg.channel.send('Random message started.')
                randomMessage = setTimeout(function() {
                randMsg(msg.channel);
              }, 1000*timer[0]);
          }
    }
    else if (msg.content === '!off') {
          if (randOn) {
              clearTimeout(randomMessage);
              msg.channel.send('Random message disabled.');
          }
          else {
              msg.channel.send('Not running.');
          }
    }
  });
*/
client.login('OTA4ODQzMDgzMTg0MDg3MDkw.YY7oFA.TN-OLn_XOcG3G7laF4Oh63IKrrQ');
/*
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function randMsg(msgChan) {
    console.log('callback');
    var interval = 1000*randomIntFromInterval(timer[0],timer[1]);
  var rand = randomIntFromInterval(0,responseArray.length-1);
  if(responseArray[rand]) {
    msgChan.sendMessage(responseArray[rand]);
  }
    randomMessage = setTimeout(function() {
        randMsg(msgChan);
    }, interval);
}
*/