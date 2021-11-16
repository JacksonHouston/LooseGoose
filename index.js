const { Client, Intents, Message, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
require('dotenv').config();

const cheerio = require('cheerio');
const request = require('request');
const {get} = require("snekfetch");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });

client.on('ready', () => {
    console.log('bot is online');
});

client.on('messageCreate', msg => {
    let serverName = msg.guild.name;                                     //get name of server
    if (msg.content.toLowerCase().includes('jayson')) {                  //send message to remind everyone that his not welcome here
        msg.channel.send('BONK! We dont talk about that loser here!');
    }
    if (msg.content.toLowerCase().includes('honk')) {                   //chaos 
        msg.channel.send('I AM CHAOS!');
    }
    if (msg.content.toLowerCase().includes('goose')) {                  //server based and user based messages
        if(serverName == 'Goose on the Loose'){                         //only sent if server is "Goose on the Loose"
            if(msg.author.username == "Scrub"){                         //only sent if user is scrub
                msg.channel.send('Erika is probably wrong...');
            }
            if(msg.author.username == "mysticemerald"){                 //only sent if user is mysticemerald
                msg.channel.send('Jack is probably wrong...');
            }
        }
        else{
            msg.channel.send('HONK!');                                  //sent if server is not "Goose on the Loose"
        }
    }
    if (msg.content.toLowerCase().includes('intro')) {                  //Sends youtube link to our anime intro
        msg.channel.send('https://www.youtube.com/watch?v=n3DfLpdhXkg');
    }
    if (msg.content.toLowerCase().includes('meme')) {                   //send random goose meme - need to update the file link to work when run from different machine
        var rand = Math.floor(Math.random() * 13) +1;
        msg.channel.send({files: ["C:/Users/Houst/Documents/GitHub/LooseGoose/Memes/Meme" + rand + ".png"]});
    }
    if (msg.content.toLowerCase().includes('cat')) {                    //sends random cat pic
        try {
            get('https://aws.random.cat/meow').then(response => {
                msg.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
                console.log('random cat picture');
            })
        } catch (e) {
            console.log('error!');
        }
    }
    if (msg.content.toLowerCase().includes('super cat')) {              //sends ten random cat pics
        for(var i =0; i<10; i++){
            try {
                get('https://aws.random.cat/meow').then(response => {
                    msg.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
                    console.log('random cat picture');
                })
            } catch (e) {
                console.log('error!');
            }
        }
    }

    const dayOfWeekName = new Date().toLocaleString(                     //On thursday, at 9, send message "ITS CHAOS DAY!"
        'default', {weekday: 'long'}
    );
    const timeOfDay = new Date();
    var hours = timeOfDay.getHours().toString();
    
    if(dayOfWeekName == "Thursday" && hours == "9"){
        msg.channel.send("@Chaos Masterminds ITS CHAOS DAY!");
    }
});

client.on('messageCreate', async (msg) => {
    if (msg.content.toLowerCase().includes('dance')) {                  //send goose dance gif
        const url = 'https://api.tenor.com/v1/search?q=goose-dance-gifs&key=${process.env.gifKey}&limit=10';
        const reponse = await fetch(url);
        const result = await reponse.json;
        const index = Math.floor(Math.random() * result.results.length());
        msg.channel.send(result.results[index].url);
    }
});

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