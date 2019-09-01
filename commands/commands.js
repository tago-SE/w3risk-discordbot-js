const config = require("../config.json");  
const secret = require("../.secret.json");  
const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const dateFormat = require('dateformat');

module.exports = class CommandsCommand {

    constructor() {
        this.name = 'commands',
        this.alias = ['c'],
        this.usage = '!commands'
    }

    run(client, msg, args) {
        // Not yet implemented
        /*
        msg.channel.send(new Discord.RichEmbed()
        .setColor(config.discord.color_1)
        .setTitle("Commands")
        .addField('!players', "some description")
        .addField('!stats', "somedescription"));
        */
    }
}