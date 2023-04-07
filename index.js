const { Client, GatewayIntentBits } = require('discord.js');
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
const connection = mysql.createPool({ //connect to mySQl Database
    connectionLimit: 100,
    host: 'localhost',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'grocery',
    port: 3306
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);

    channel = client.channels.cache.get('908544792395403294');

    cron.schedule('00 12 24 11 *', () => {
        for (var i = 0; i < 10; i++)
            channel.send('HAPPY ANNIVERSARY!!!');
    });
    // TODO Erika Birthday
});

client.on('messageCreate', msg => {
    let serverName = msg.guild.name;                                    //get name of server
    let channelName = msg.channel.name;
    const foodChannel = 'food-stuff';

    let message = msg.content.toLowerCase();

    if (msg.author.bot) return;                                         //no more infinite loops

    if (channelName != foodChannel) {
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
            if (serverName == 'Goose on the Loose') {                         //only sent if server is "Goose on the Loose"
                if (msg.author.username == "Scrub") {                         //only sent if user is scrub
                    msg.channel.send('Erika is probably wrong...');
                }
                if (msg.author.username == "mysticemerald") {                 //only sent if user is mysticemerald
                    msg.channel.send('Jack is probably wrong...');
                }
            }
            else {
                msg.channel.send('HONK!');                                  //sent if server is not "Goose on the Loose"
            }
        }

        if (message.includes('rude')) {
            if (msg.author.username == "Scrub") {
                msg.channel.send("If you're refering to Erika, she is most certainly never rude!")
            }
            if (msg.author.username == "mysticemerald") {
                msg.channel.send("If you're refering to Jack, he is most certainly never rude!")
            }
        }

        if (message.includes('love')) {
            if (msg.author.username == "Scrub") {
                msg.channel.send('I ran the numbers! Jack loves Erika more than Erika loves Jack!')
            }
            if (msg.author.username == "mysticemerald") {
                msg.channel.send('I ran the numbers! Erika loves Jack more than Jack loves Erika!')
            }
        }


        if (message.includes('intro')) {                  //Sends youtube link to our anime intro
            msg.channel.send('https://www.youtube.com/watch?v=n3DfLpdhXkg');
        }


        if (message.includes('meme')) {                   //send random goose meme - need to update the file link to work when run from different machine
            var rand = Math.floor(Math.random() * 13) + 1;
            msg.channel.send({ files: ["./Memes/Meme" + rand + ".png"] });
        }

        if (message.includes('give me bread')) {          //send random bread pics
            var rand = Math.floor(Math.random() * 43) + 1;
            msg.channel.send({ files: ["./Bread/" + rand + ".jpg"] });
        }

        if (message.includes('rain bread')) {             //send random bread pics alot
            for (var i = 0; i < 10; i++) {
                var rand = Math.floor(Math.random() * 43) + 1;
                msg.channel.send({ files: ["./Bread/" + rand + ".jpg"] });
            }
        }
    }

    if (channelName === foodChannel) {
        //STORE COMMANDS------------------------------------------- 
        //GET Store Table
        if (message.includes('show stores')) {
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
                    for (let i = 0; i < result.length; i++) {
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
        if (message.includes('add') && message.includes('stores')) {
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
        if (message.includes('clear stores')) {
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
        //HELP------------------------------------------- 
        if (message.includes('help stores')) {
            msg.channel.send("Store Commands:\n > 'show stores' to list all stores\n > 'add ... to stores' where '...' is the name of the store you want to add\n > 'clear stores' to clear all the stores(this cannot be undone)\n");
        }
        //LIST COMMANDS-------------------------------------------    
        //GET list table
        if (message.includes('show list')) {
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
                    let listOfFoods = '__Food\tQuantity__\n';
                    for (let i = 0; i < result.length; i++) {
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
        if (message.includes('add') && message.includes('list')) {
            listItem = msg.content.split(" ");
            let Quantity = Number(listItem[1]); //get number of items
            let Food = '';
            //if number of items is not a number then set Quantity to 1 and concat Food starting at Quantity's index
            if (Number.isNaN(Quantity)) { 
                //loop through array starting at second position until second to last
                for (let i = 1; i < (listItem.length); i++) {
                    //if item is 'to' break out and do not add it to string
                    if (listItem[i] === 'to') 
                        break;
                    else
                        Food += listItem[i] + ' ';
                }
                Quantity = 1;
            } else {
                //concat Food starting after Quantity's index
                for (let i = 2; i < (listItem.length); i++) {
                    if (listItem === 'to') 
                        break;
                    else
                        Food += listItem[i] + ' ';
                }
            }

            try { // get table
                connection.query('SELECT * FROM List ORDER BY FoodID ASC;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    let inTable = false;
                    let row = 0;
                    for (let i = 0; i < result.length; i++) { //check to see if the item already exist in table
                        if (result[i].FoodName == Food) {
                            inTable = true;
                            row = Number(result[i].FoodID);
                        }
                    }
                    if (inTable) { //if exist update it to active
                        //console.log("Inside update");
                        connection.query(`UPDATE List SET Active=True WHERE FoodID=${row};`, function (err) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code);
                                return;
                            }
                            msg.channel.send('item added');
                        });
                    } else {    // if doesn't exist add to table
                        //console.log("Inside Insert");
                        connection.query(`INSERT INTO List (FoodName, Quantity) VALUES (${connection.escape(Food)}, ${connection.escape(Quantity)})`, function (err) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code);
                                return;
                            }
                            msg.channel.send('item added');
                        });
                    }
                });

            } catch (e) {
                console.log(e);
                msg.channel.send(err.code);
            }
        }
        //Clear list
        if (message.includes('clear list')) {
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
        if (message.includes('recover list')) {
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
        if (message.includes('remove') && message.includes('list')) {
            listItem = msg.content.split(" ");

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
        //Delete
        if (message.includes('delete') && message.includes('list')) {
            listItem = msg.content.split(" ");

            if (listItem[1] === 'all') {
                try {
                    connection.query(`TRUNCATE TABLE List;`, function (err) {
                        if (err) { //sql error
                            console.log(err.code);
                            msg.channel.send(err.code);
                            return;
                        }
                        msg.channel.send('All Items Deleted.');
                    });
                } catch (e) {
                    console.log(e);
                    msg.channel.send(err.code);
                }
            } else {
                try {
                    connection.query(`DELETE FROM List WHERE FoodName=(${connection.escape(listItem[1])})`, function (err) {
                        if (err) { //sql error
                            console.log(err.code);
                            msg.channel.send(err.code);
                            return;
                        }
                        msg.channel.send('Item Deleted.');
                    });
                } catch (e) {
                    console.log(e);
                    msg.channel.send(err.code);
                }
            }
        }
        //HELP------------------------------------------- 
        if (message.includes('help') && message.includes('list')) {
            msg.channel.send("List Commands:\n > **'show list'**, to display all items active on the list\n > **'add [quantity*] [foodname] to list'**, quantity is optional. if not specified it will default to 1\n > **'clear list'**, sets all items on list to 'inactive' and does not display them\n > **'remove [foodname] from list'**, removes single item from the list\n > **'delete [foodname] from list'**, permanently removes item from list\n > **'delete all from list'**, permanently deletes all items from the list\n");
        }
        //INVENTORY COMMANDS------------------------------------------- 
        //show inventory
        //SELECT * FROM Inventory
        if (message.includes('show inventory')) {
            console.log('hi')
            try {
                connection.query('SELECT Inventory.ItemName, Inventory.Stock, Inventory.Price, DATE_FORMAT(Inventory.PurchaseDate, "%m-%d-%y") as Date, Stores.StoreName FROM Inventory JOIN Stores ON Inventory.StoreID = Stores.StoreID;;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    } else if (result.length == 0) {
                        msg.channel.send('Nothing Inventory to show.');
                        return;
                    }
                    let listOfItems = '__Item\tStock\tPrice\tPurchase Date\tStore__\n';
                    for (let i = 0; i < result.length; i++) {
                        listOfItems += `> ${result[i].ItemName} \t ${result[i].Stock} \t ${result[i].Price} \t ${result[i].Date} \t ${result[i].StoreName} \n`;
                        console.log(result[i]);
                    }
                    msg.channel.send(listOfItems);
                });
            } catch (e) {
                console.log(e);
                msg.channel.send(err.code);
            }
        }
        //add inventory 
        //INSERT INTO Inventory (ItemName, Stock, Price, PurchaseDate, StoreID) VALUES ("Beans",12,1.99,"2023-04-02",1);
        if (message.includes('add') && message.includes('inventory')) {
            messageItems = msg.content.split(" ");
            // for(let i =0; i < messageItem.length; i++)
            //     console.log(messageItem[i]);
            let Quantity = Number(messageItems[1]); //get number of items
            let Item = '';
            let Price;
            let Store;
            //if number of items is not a number then set Quantity to 1 and concat Food starting at Quantity's index
            if (Number.isNaN(Quantity)) { 
                //loop through array starting at second position until second to last
                for (let i = 1; i < (messageItems.length); i++) {
                    //if item is 'to' break out and do not add it to string
                    if (messageItems[i] === 'at') 
                        break;
                    else
                        Item += messageItems[i] + ' ';
                }
                Quantity = 1;
            } else {
                //concat Food starting after Quantity's index
                for (let i = 2; i < (messageItems.length); i++) {
                    if (messageItems === 'at') 
                        break;
                    else
                        Item += messageItems[i] + ' ';
                }
            }

            try { // get table
                connection.query('SELECT * FROM Inventory ORDER BY ItemID ASC;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    let inTable = false;
                    let row = 0;
                    for (let i = 0; i < result.length; i++) { //check to see if the item already exist in table
                        if (result[i].ItemName == Item && result[i].StoreID) {
                            inTable = true;
                            row = Number(result[i].ItemID);
                        }
                    }
                    if (inTable) { //if exist update it to active
                        //console.log("Inside update");
                        result[row]
                        connection.query(`UPDATE Inventory SET Stock=True WHERE FoodID=${row};`, function (err) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code);
                                return;
                            }
                            msg.channel.send('item added');
                        });
                    } else {    // if doesn't exist add to table
                        //console.log("Inside Insert");
                        connection.query(`INSERT INTO List (FoodName, Quantity) VALUES (${connection.escape(Food)}, ${connection.escape(Quantity)})`, function (err) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code);
                                return;
                            }
                            msg.channel.send('item added');
                        });
                    }
                });

            } catch (e) {
                console.log(e);
                msg.channel.send(err.code);
            }
        }
        //delete inventory (single & all)
        //TRUNCATE TABLE Inventory
        //DELETE FROM Inventory WHERE ItemName = ItemName
        //update inventory
        //UPDATE Inventory SET Stock = Quantity WHERE ItemName = ItemName
        //RECIPES COMMANDS???
    }
});

client.login(process.env.TOKEN);