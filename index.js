const {Client, GatewayIntentBits} = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const cron = require('node-cron');
require('dotenv').config();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    let serverName = msg.guild.name;                                    //get name of server
    let channelName = msg.channel.name;
    const foodChannel = '1010567973175566387';

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

    if (msg.content.toLowerCase().includes('rude')) {
        if(msg.author.username == "Scrub"){
            msg.channel.send("If you're refering to Erika, she is most certainly never rude!")
        }
        if(msg.author.username == "mysticemerald"){
            msg.channel.send("If you're refering to Jack, he is most certainly never rude!")
        }
    }

    if (msg.content.toLowerCase().includes('love')) {
        if(msg.author.username == "Scrub"){
            msg.channel.send('I ran the numbers! Jack loves Erika more than Erika loves Jack!')
        }
        if(msg.author.username == "mysticemerald"){
            msg.channel.send('I ran the numbers! Erika loves Jack more than Jack loves Erika!')
        }
    }


    if (msg.content.toLowerCase().includes('intro')) {                  //Sends youtube link to our anime intro
        msg.channel.send('https://www.youtube.com/watch?v=n3DfLpdhXkg');
    }


    if (msg.content.toLowerCase().includes('meme')) {                   //send random goose meme - need to update the file link to work when run from different machine
        var rand = Math.floor(Math.random() * 13) +1;
        msg.channel.send({files: ["./Memes/Meme" + rand + ".png"]});
    }

    if (msg.content.toLowerCase().includes('give me bread')) {          //send random bread pics
        var rand = Math.floor(Math.random() * 43) +1;
        msg.channel.send({files: ["./Bread/" + rand + ".jpg"]});
    }

    if (msg.content.toLowerCase().includes('rain bread')) {             //send random bread pics alot
        for(var i =0; i < 10; i++)
        {
            var rand = Math.floor(Math.random() * 43) +1;
            msg.channel.send({files: ["./Bread/" + rand + ".jpg"]});
        }             
    }  

    if (msg.content.toLowerCase().includes('test')) {
        //msg.channel.send(`${channelName}`);
        if ( channelName === foodChannel ) {
            msg.channel.send('This is food channel');
        }
    }

});

cron.schedule('00 12 24 11 *', () => {
    client.on('messageCreate', msg => {
        for( var i =0; i < 10; i++)
            msg.channel.send('HAPPY ANNIVERSARY!!!');
    });
});

client.login(process.env.TOKEN);