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
    console.log("Connected to mySQL!");
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    let serverName = msg.guild.name;                                    //get name of server
    let channelName = msg.channel.name;
    const foodChannel = 'food-stuff';

    let message = msg.content.toLowerCase();

    if (msg.author.bot) return;                                         //no more infinite loops
    
    if (message.includes('chaos')) {                   //chaos 
        msg.channel.send('I AM CHAOS!');
    }

    if (message.includes('honk')) {                   //honk 
        msg.channel.send('BONK!');
    }

    if (message.includes('bonk')) {                   //bonk 
        msg.channel.send('HONK!');
    }

    if (message.includes('goose')) {                  //server based and user based messages
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

    if (message.includes('rude')) {
        if(msg.author.username == "Scrub"){
            msg.channel.send("If you're refering to Erika, she is most certainly never rude!")
        }
        if(msg.author.username == "mysticemerald"){
            msg.channel.send("If you're refering to Jack, he is most certainly never rude!")
        }
    }

    if (message.includes('love')) {
        if(msg.author.username == "Scrub"){
            msg.channel.send('I ran the numbers! Jack loves Erika more than Erika loves Jack!')
        }
        if(msg.author.username == "mysticemerald"){
            msg.channel.send('I ran the numbers! Erika loves Jack more than Jack loves Erika!')
        }
    }


    if (message.includes('intro')) {                  //Sends youtube link to our anime intro
        msg.channel.send('https://www.youtube.com/watch?v=n3DfLpdhXkg');
    }


    if (message.includes('meme')) {                   //send random goose meme - need to update the file link to work when run from different machine
        var rand = Math.floor(Math.random() * 13) +1;
        msg.channel.send({files: ["./Memes/Meme" + rand + ".png"]});
    }

    if (message.includes('give me bread')) {          //send random bread pics
        var rand = Math.floor(Math.random() * 43) +1;
        msg.channel.send({files: ["./Bread/" + rand + ".jpg"]});
    }

    if (message.includes('rain bread')) {             //send random bread pics alot
        for(var i =0; i < 10; i++)
        {
            var rand = Math.floor(Math.random() * 43) +1;
            msg.channel.send({files: ["./Bread/" + rand + ".jpg"]});
        }             
    }  

    if ( channelName === foodChannel ) {
        //GET Store Table
        if ( message.includes('show stores') ) {
            try {
                connection.query('SELECT StoreName FROM Stores ORDER BY StoreName ASC;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    } else if (result.length == 0) {
                        msg.channel.send('No stores to show.');
                        return;
                    }
                    let listOfStores = '';
                    for(let i =0; i < result.length; i++) {
                        listOfStores += `> ${result[i].StoreName} \n`;
                    }
                    msg.channel.send(listOfStores);
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //ADD Store
        if ( message.includes('add', 0) && message.includes('stores', 4) ) {
            listItem = msg.content.split(" ");
            // for(let i =0; i < listItem.length; i++)
            //     console.log(listItem[i]);

            try {
                connection.query(`INSERT INTO Stores (StoreName) VALUES (${connection.escape(listItem[2])})`, function (err) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send('store added');
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //CLEAR Store Table
        if ( message.includes('clear stores') ) {
            try {
                connection.query('TRUNCATE TABLE Stores;', function (err) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send('All stores removed.');
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //GET list table
        if ( message.includes('show list') ) {
            try {
                connection.query('SELECT FoodName, Quantity FROM List WHERE Active=True ORDER BY FoodName ASC;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    } else if (result.length == 0) {
                        msg.channel.send('Nothing on the list to show.');
                        return;
                    }
                    let listOfFoods = '';
                    for(let i =0; i < result.length; i++) {
                        listOfFoods += `> ${result[i].FoodName} \t ${result[i].Quantity} \n`;
                    }
                    msg.channel.send(listOfFoods);
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //ADD to List Table
        if ( message.includes('add', 0) && message.includes('list', 5) ) {
            listItem = msg.content.split(" ");
            // for(let i =0; i < listItem.length; i++)
            //     console.log(listItem[i]);
            let Quantity = Number(listItem[1]);

            try {
                connection.query(`INSERT INTO List (FoodName, Quantity) VALUES (${connection.escape(listItem[2])}, ${connection.escape(Quantity)}) ON DUPLICATE FoodName UPDATE Active=True`, function (err) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send('item added');
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //Clear list
        if ( message.includes('clear list') ) {
            try {
                connection.query('UPDATE List SET Active=False;', function (err) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send('List cleared.');
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //Recover list
        if ( message.includes('recover list') ) {
            try {
                connection.query('UPDATE List SET Active=True;', function (err) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send('List Recovered.');
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
        }
        //Remove item from list
        if ( message.includes('remove', 0) && message.includes('list', 4) ) {
            listItem = msg.content.split(" ");
            // for(let i =0; i < listItem.length; i++)
            //     console.log(listItem[i]);

            try {
                connection.query(`UPDATE List SET Active=False WHERE FoodName=(${connection.escape(listItem[1])})`, function (err) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send('Item removed.');
                });
            } catch (e) {
            console.log(e);
            msg.channel.send(err.code);
            }
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

