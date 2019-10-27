const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');   

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    
    if (msg.author.bot)  
        return;

    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
    else {
        msg.reply("???");
    }
    
});

client.login(config.token);