const { Client, Intents, VoiceChannel, Message, DiscordAPIError } = require('discord.js');
const Discord = require('discord.js');
const { createAudioResource, createAudioPlayer, joinVoiceChannel, StreamType, volume, generateDependencyReport } = require('@discordjs/voice');
const path = require('path');
require('dotenv').config();

const {get} = require("snekfetch");


const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_VOICE_STATES] });

client.on('ready', () => {
    console.log('bot is online');
});

client.on('messageCreate', msg => {
    let serverName = msg.guild.name;                                    //get name of server
    
    if (msg.author.bot) return;                                         //no more infinite loops
    
    if (msg.content.toLowerCase().includes('jayson')) {                 //send message to remind everyone that his not welcome here
        msg.channel.send('BONK! We dont talk about that loser here!');
    }


    if (msg.content.toLowerCase().includes('chaos')) {                   //chaos 
        msg.channel.send('I AM CHAOS!');
    }

    if (msg.content.toLowerCase().includes('honk')) {                   //honk 
        msg.channel.send('BONK!');
    }

    if (msg.content.toLowerCase().includes('bonk')) {                   //bonk 
        msg.channel.send('HONK!');
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

    if (msg.content.toLowerCase().includes('rude')) {                   //bonk 
        msg.channel.send('If youre refering to Jack, he is most certainly never rude!');
    }

    if (msg.content.toLowerCase().includes('love')) {
        if(msg.author.username == "Scrub"){
            msg.channel.send('I ran the numbers! Jack loves Erika more than Erika loves Jack!')
        }
        if(msg.author.username == "mysticemerald"){
            msg.channel.send('Erika is sad because I wont let her love Jack more!')
        }
    }


    if (msg.content.toLowerCase().includes('intro')) {                  //Sends youtube link to our anime intro
        msg.channel.send('https://www.youtube.com/watch?v=n3DfLpdhXkg');
    }


    if (msg.content.toLowerCase().includes('meme')) {                   //send random goose meme - need to update the file link to work when run from different machine
        var rand = Math.floor(Math.random() * 13) +1;
        msg.channel.send({files: ["C:/Users/Houst/Documents/GitHub/LooseGoose/Memes/Meme" + rand + ".png"]});
    }

    if (msg.content.toLowerCase().includes('give me bread')) {          //send random bread pics
        var rand = Math.floor(Math.random() * 43) +1;
        msg.channel.send({files: ["C:/Users/Houst/Documents/GitHub/LooseGoose/Bread/" + rand + ".jpg"]});
    }

    if (msg.content.toLowerCase().includes('rain bread')) {             //send random bread pics alot
        for(var i =0; i < 10; i++)
        {
            var rand = Math.floor(Math.random() * 43) +1;
            msg.channel.send({files: ["C:/Users/Houst/Documents/GitHub/LooseGoose/Bread/" + rand + ".jpg"]});
        }             
      
    }
/*
    if (msg.content.toLowerCase().includes('cat')) {                    //sends random cat pic
        try {
            get('https://aws.random.cat/').then(response => {
                msg.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
            })
        } catch (e) {
            console.log('error!');
        }
    }


    if (msg.content.toLowerCase().includes('super cat')) {              //sends ten random cat pics
        for(var i =0; i<10; i++){
            try {
                get('https://aws.random.cat/').then(response => {
                    msg.channel.send({files: [{attachment: response.body.file, name: `cat.${response.body.file.split('.')[4]}`}]});
                })
            } catch (e) {
                console.log('error!');
            }
        }
    }
/*
    if(serverName == 'Goose on the Loose'){
        var chaosChannel = client.channels.cache.get('908544792395403294');

        const dayOfWeekName = new Date().toLocaleString(                //On thursday, at 9, send message "ITS CHAOS DAY!"
            'default', {weekday: 'long'}
        );
        const timeOfDay = new Date();
        var hours = timeOfDay.getHours().toString();
        
        if(dayOfWeekName == "Thursday" && hours == "9"){
            chaosChannel.send("@Chaos Masterminds ITS CHAOS DAY!");
        }
    } 
*/    
    
       
});

client.on('messageCreate', async (msg) => {                             //TODO: make bot leave after 15 secs of inactivity 
    /*
    if (msg.content.toLowerCase().includes('dance')) {                  //send goose dance gif
        const request = await axios.get(`https://api.tenor.com/v1/search?q=goose-dance-gifs&key=${process.env.gifKey}`);
        msg.channel.send("HONK", {files: [request]});
    }
    */
    if(msg.content.toLowerCase().includes('play intro'))                //play the song "Goose Goose Revolution" in voice chat
    {
        //console.log(generateDependencyReport()); used to check the dependency of the audio player
        const voice = msg.member.voice.channel;
        

        if (!voice) {                                                   //makes sure the person is the voice channel before the bot joins
            msg.reply('You must be in a voice channel');
            return;
        }
        
        const player = createAudioPlayer();

        const connection = joinVoiceChannel({                            //has the bot join the voice channel
            channelId: msg.member.voice.channel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        }).subscribe(player)
        
        let resource = createAudioResource(path.join(__dirname, '\\Sound\\intro.mp3'), //loads the audio resource
            { inputType: StreamType.Arbitrary }, 
            {inlineVolume : true}
        );

        //console.log(path.join(__dirname, '\\Sound\\intro.mp3'));  used to check the path
        player.play(resource);                                           //plays the audio file
        client.user.setActivity("Goose Goose Revolution",{type: "LISTENING"});

    } 
   

    if(msg.content.toLowerCase().includes('start chaos'))                //play the random goose noises in voice chat
    {
        const voice = msg.member.voice.channel;
        const player = createAudioPlayer();

        if (!voice) {
            msg.reply('You must be in a voice channel');
            return;
        }

        const connection = joinVoiceChannel({
                channelId: msg.member.voice.channel.id,
                guildId: msg.guild.id,
                adapterCreator: msg.guild.voiceAdapterCreator
            }).subscribe(player)
            
        let counter = 0;
        while(counter !== 50)
        {
            let rand = Math.floor((Math.random() * 6) + 1);
            let resource;
            
            if(rand == 5)
            {
                resource = createAudioResource(path.join(__dirname, `\\Sound\\BITE.mp3`), 
                    {inputType: StreamType.Arbitrary }, 
                    {inlineVolume : true});
            }
            else if(rand == 6)
            {
                resource = createAudioResource(path.join(__dirname, `\\Sound\\MudSquith.mp3`), 
                    {inputType: StreamType.Arbitrary }, 
                    {inlineVolume : true});
            }
            else
            {
                resource = createAudioResource(path.join(__dirname, `\\Sound\\honk${rand}.mp3`), 
                    {inputType: StreamType.Arbitrary }, 
                    {inlineVolume : true});
                
            }
            
            player.play(resource);
            client.user.setActivity("Chaos",{type: "COMPETING"});
            counter++;
            await delay(1000);
        }

    } 
});

(async() => {
    client.login(process.env.token);
})();

function delay(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}