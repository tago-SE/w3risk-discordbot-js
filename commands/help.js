const MessageUtils = require("../utils/messageutils");
const config = require("../config.json");  
const Admins = require('../db/admins');
const Discord = require('discord.js');

module.exports = class HelpCommand {

    constructor() {
        this.name = 'help',
        this.alias = ['h'],
        this.usage = 'Noobie information.'
        this.disc = " ";
    }

    run(client, msg, args) {
        msg.channel.send(new Discord.RichEmbed()
        .setColor(config.discord.color_1)
        .setTitle("Help")
        .addField("Participation", "To participate in the league you must submit your replays in this channel or upload them " +
        "directly to https://wc3stats.com/upload and use the command: '!submit [id]'.")
        .addField("Commands", "Type '!commands' to see a list of available commands.")
        );
    }
}