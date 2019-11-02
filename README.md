To run the project you need to setup a mongodb server and create a file called ".secret.json" with the following in it:

    {
        "discord": {
            "token": "your-discord-token",
            "superusers": ["discord-name#discord-discriminator"]
        },
        "db": {
            "name": "db-name",
            "host": "db-host-address",
            "port": "db-port"
        }
    }

Also don't forget to change the content inside config.json to match the channel that the bot will be running on.

After this you should run

    npm install
    npm start 
    
# Screenshots 

https://github.com/tago-SE/w3risk-discordbot-js/blob/master/screenshots/scoreboard.png
