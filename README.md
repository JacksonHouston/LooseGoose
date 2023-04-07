# LooseGoose

## Overview
This is project was created cause chaos and increase the usefulness of a Discord server I mainly use.

Using node and Discord.js I created a chat bot that responds to message and sends querys to a local mySql database.

By using the .includes string function within javascript any message that contain one of the key word is triggered and the bot send a message to the same channel as the orginal message.

### Dependencies
- Discord.js
    - Used to interface with the Discord API to send and receive messages
    - Gathers server data such as server name/ID and channel name/ID
    - Also used to detect the author of messages
- dotenv
    - Stored private enviroment variable such as Discord Bot Token and login information for the mySql database
- mysql
    - Used to connect to and send queries to the database
- node-cron
    - Used to setup scheduled jobs that don't require a specific trigger other than date/time.