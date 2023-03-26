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
const mysql = require('mysql');
require('dotenv').config();

// SQL Stuff
const connection = mysql.createConnection({ //connect to mySQl Database
    host: 'localhost',
    user: process.env.MYSQL_USER,  
    password: process.env.MYSQL_PASSWORD,
    database: 'grocery',
    port: 3306
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    let serverName = msg.guild.name;                                    //get name of server
    let channelName = msg.channel.name;
    const foodChannel = 'food-stuff';

    if (msg.author.bot) return;                                         //no more infinite loops
    
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

    if (msg.content.toLowerCase().includes('show stores')) {
        if ( channelName === foodChannel ) {
            try {
                connection.query('SELECT StoreName FROM Stores;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    } else if (result.length == 0) {
                        msg.channel.send('No stores to show.');
                        return;
                    }
                    for(let name of result) {
                        console.log(result[name].StoreName);
                    }
                    
                    //msg.channel.send(result[0]);
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        } else {
            msg.channel.send('You need to be in the Food-Stuff channel for this!');
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

