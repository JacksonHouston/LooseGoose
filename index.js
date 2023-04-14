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
            let StoreName = '';
            for (let i = 1; i < (listItem.length); i++) {
                //if item is 'to' break out and do not add it to string
                if (listItem[i] === 'to' || listItem[i] === 'stores')
                    break;
                else
                    StoreName += listItem[i] + ' ';
            }
            StoreName = StoreName.slice(0, -1);
            try {
                connection.query(`INSERT INTO Stores (StoreName) VALUES (${connection.escape(StoreName)})`, function (err) {
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
        if (message.includes('delete') && message.includes('stores')) {
            listItem = msg.content.split(" ");

            if (listItem[1] === 'all') {
                try {
                    connection.query(`TRUNCATE TABLE Stores;`, function (err) {
                        if (err) { //sql error
                            console.log(err.code);
                            msg.channel.send(err.code);
                            return;
                        }
                        msg.channel.send('All Stores Deleted.');
                    });
                } catch (e) {
                    console.log(e);
                    msg.channel.send(err.code);
                }
            } else {
                try {
                    connection.query(`DELETE FROM Stores WHERE StoreName=(${connection.escape(listItem[1])})`, function (err) {
                        if (err) { //sql error
                            console.log(err.code);
                            msg.channel.send(err.code);
                            return;
                        }
                        msg.channel.send(`${listItem[1]} Deleted.`);
                    });
                } catch (e) {
                    console.log(e);
                    msg.channel.send(err.code);
                }
            }
        }
        //HELP------------------------------------------- 
        if (message.includes('help stores')) {
            msg.channel.send("Store Commands:\n > **'show stores'** to list all stores\n > **'add [storeName] to stores'** to add a store to the database\n > **'clear stores'** to clear all the stores(this cannot be undone)\n");
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
                    if (listItem[i] === 'to'){
                        break;
                    } else {
                        Food += listItem[i] + ' ';
                    }
                }
                Quantity = 1;
            } else {
                //concat Food starting after Quantity's index
                for (let i = 2; i < (listItem.length); i++) {
                    if (listItem[i] === 'to'){
                        break;
                    } else {
                        Food += listItem[i] + ' ';
                    }
                }
            }

            Food = Food.slice(0, -1);

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
                        connection.query(`INSERT INTO List (FoodName, Quantity) VALUES (${connection.escape(Food)}, ${connection.escape(Quantity)});`, function (err) {
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
            try {
                connection.query('SELECT Inventory.ItemName, Inventory.Stock, Inventory.Price, DATE_FORMAT(Inventory.PurchaseDate, "%m-%d-%y") as Date, Stores.StoreName FROM Inventory JOIN PurchaseFrom ON Inventory.ItemID = PurchaseFrom.ItemID JOIN Stores ON PurchaseFrom.StoreID = Stores.StoreID;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    } else if (result.length == 0) {
                        msg.channel.send('Nothing in Inventory to show.');
                        return;
                    }
                    let listOfItems = '__Item\tStock\tPrice\tDate\t\t\tStore__\n';
                    for (let i = 0; i < result.length; i++) {
                        listOfItems += `> ${result[i].ItemName} \t ${result[i].Stock} \t ${result[i].Price} \t ${result[i].Date} \t ${result[i].StoreName} \n`;
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
            let Stock = Number(messageItems[1]); //get number of items
            let Item = '';
            let Price = 0;
            let PurchaseDate = new Date().toISOString().slice(0, 19).replace('T', ' '); //needs to be yyyy-mm-dd
            let StoreName = '';
            let Head = 0; //used to track progress of reading array
            //if number of items is not a number then set Quantity to 1 and concat Food starting at Quantity's index
            if (Number.isNaN(Stock)) {
                //loop through array starting at second position until second to last
                for (let i = 1; i < (messageItems.length); i++) {
                    //if item is 'to' break out and do not add it to string
                    if (messageItems[i] === 'at') {
                        Head = i;
                        break;
                    }
                    else
                        Item += messageItems[i] + ' ';
                }
                Stock = 1;
            } else {
                //concat Food starting after Quantity's index
                for (let i = 2; i < (messageItems.length); i++) {
                    if (messageItems[i] === 'at') {
                        Head = i;
                        break;
                    }
                    else
                        Item += messageItems[i] + ' ';
                }
            }
            //get the price
            Price = Number(messageItems[Head + 1]);
            for (let i = (Head + 3); i < (messageItems.length); i++) {
                if (messageItems[i] === 'to') {
                    break;
                }
                else
                    StoreName += messageItems[i] + ' ';
            }

            //Remove blank space at end of string
            StoreName = StoreName.slice(0, -1);
            Item = Item.slice(0, -1);

            try { // get table
                connection.query('SELECT * FROM Inventory, Stores ORDER BY ItemID ASC;', function (err, result) {
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    let inTable = false;
                    let row = 0;
                    for (let i = 0; i < result.length; i++) { //check to see if the item already exist in table
                        if (result[i].ItemName === Item) {
                            inTable = true;
                            row = Number(result[i].ItemID);
                        }
                    }
                    if (inTable) { //if exist update it to active
                        Stock += Number(result[row].Stock); //add the stock numbers together before updating row
                        connection.query(`UPDATE Inventory SET Stock=${Stock} WHERE ItemID=${row};`, function (err) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code + 'Could not update stock');
                                return;
                            }
                            msg.channel.send('item updated');
                        });
                    } else {    // if doesn't exist add to table
                        connection.query(`INSERT INTO Inventory (ItemName, Stock, Price, PurchaseDate) VALUES (${connection.escape(Item)}, ${connection.escape(Stock)}, ${connection.escape(Price)}, ${connection.escape(PurchaseDate)} )`, function (err) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code + 'Could not add item to inventory');
                                return;
                            }
                        });
                        connection.query(`SELECT * FROM Inventory, Stores WHERE Stores.StoreName=${connection.escape(StoreName)} AND Inventory.ItemName=${connection.escape(Item)};`, function (err, res) {
                            if (err) { //sql error
                                console.log(err.code);
                                msg.channel.send(err.code + 'Could not find storeID');
                                return;
                            }
                            let StoreID = res[0].StoreID;
                            let ItemID = res[0].ItemID;
                            connection.query(`INSERT INTO PurchaseFrom (StoreId, ItemID) VALUES (${connection.escape(StoreID)}, ${connection.escape(ItemID)})`, function (err) {
                                if (err) { //sql error
                                    console.log(err.code);
                                    msg.channel.send(err.code + 'Could not add store to item');
                                    return;
                                }
                                msg.channel.send(`${res[0].ItemName} from ${res[0].StoreName} added to inventory`);
                            });
                        });
                    }
                });

            } catch (e) {
                console.log(e + 'exited try-catch');
                msg.channel.send(err.code);
            }
        }
        //delete inventory (single & all)
        if (message.includes('delete') && message.includes('inventory')) {
            listItem = msg.content.split(" ");
            //TRUNCATE TABLE Inventory
            if (listItem[1] === 'all') {
                try {
                    connection.query(`DELETE FROM Inventory;`, function (err) {
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
                //DELETE FROM Inventory WHERE ItemName = ItemName
                try {
                    connection.query(`DELETE FROM Inventory WHERE ItemName=(${connection.escape(listItem[1])})`, function (err) {
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

        //update inventory
        //UPDATE Inventory SET Stock = Quantity WHERE ItemName = ItemName
        if (message.includes('remove') && message.includes('inventory')) {
            messageList = msg.content.split(" ");
            let Quantity = Number(messageList[1]); //get number of items
            let Item = '';

            if (Number.isNaN(Quantity)) {
                for (let i = 1; i < (messageList.length); i++) {
                    //if item is 'to' break out and do not add it to string
                    if (messageList[i] === 'from' || messageList[i] === 'inventory')
                        break;
                    else
                        Item += messageList[i] + ' ';
                }
                Quantity = 1;
            }
            else {
                //concat Food starting after Quantity's index
                for (let i = 2; i < (messageList.length); i++) {
                    if (messageList[i] === 'from' || messageList[i] === 'inventory')
                        break;
                    else
                        Item += messageList[i] + ' ';
                }
            }
            Item = Item.slice(0, -1);

            connection.query(`SELECT * FROM Inventory WHERE ItemName = ${connection.escape(Item)};`, function(err, result){
                if (err) { //sql error
                    console.log(err.code);
                    msg.channel.send(err.code);
                    return;
                }
                Quantity = result[0].Stock - Quantity;
                connection.query(`UPDATE Inventory SET Stock=${connection.escape(Quantity)} WHERE ItemID=${connection.escape(result[0].ItemID)}`, function(err){
                    if (err) { //sql error
                        console.log(err.code);
                        msg.channel.send(err.code);
                        return;
                    }
                    msg.channel.send(`${Quantity} ${Item}(s) removed from inventory.`);
                });
            })
        }
        //HELP------------------------------------------- 
        if (message.includes('help') && message.includes('inventory')) {
            msg.channel.send("List Commands:\n > **'show inventory'**, to display all items in inventory\n > **'add [quantity*] [foodname] at [price] from [storeName] to inventory'**, quantity is optional. if not specified it will default to 1\n > **'remove [quantity*] [foodname] from inventory'**, removes single or mulitple item(s) from inventory. quantity is optional. if not specified it will default to 1\n > **'delete [itemname] from list'**, permanently removes item from inventory\n > **'delete all from list'**, permanently deletes all items from inventory\n");
        }
        //RECIPES COMMANDS???
    }
});

client.login(process.env.TOKEN);