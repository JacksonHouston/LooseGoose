const { Client, Intents, Message } = require('discord.js');
require('dotenv').config();

const cheerio = require('cheerio');
const request = require('request');
const {get} = require("snekfetch");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', () => {
    console.log('bot is online');
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
    if (msg.content.toLowerCase().includes('meme')) {
        var rand = Math.floor(Math.random() * 13) +1;
        msg.channel.send({files: ["C:/Users/Houst/Documents/GitHub/LooseGoose/Memes/Meme" + rand + ".png"] });
    }
    if (msg.content.toLowerCase().includes('cat')) {
        try {
            get('https://aws.random.cat/meow').then(response => {
                  msg.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
                  console.log('random cat picture');
                   })
                   } catch (e) {
                        console.log('error!');
                        }
        };
        if (msg.content.toLowerCase().includes('super cat')) {
            for(var i =0; i<10; i++){
                try {
                get('https://aws.random.cat/meow').then(response => {
                      msg.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
                      console.log('random cat picture');
                       })
                       } catch (e) {
                            console.log('error!');
                            }
            };
        }
            
    }
);

(async() => {
    client.login(process.env.token);
})();

function image(msg){
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + "cat",
        method: "GET",
        header: {
            "Accept" : "text/html",
            "User-Agent" : "Chrome"
        }
    };

    request(options, function(error, response, responseBody) {
        if(error){
            return;
        }
        $ = cheerio.load(responseBody);

        var links = $(".image a.link");
        var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));

        console.log(urls);
        if(!urls.length){
            return;
        }

        Message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    });
}