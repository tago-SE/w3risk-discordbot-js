const config = require("../config.json");  
const secret = require("../.secret.json");  
const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const dateFormat = require('dateformat');

module.exports = class CommandsCommand {

    constructor() {
        this.name = 'commands',
        this.alias = ['c'],
        this.usage = 'Reveal bot commands.'
    }

    run(client, msg, args) {
        const folder = __dirname + "/";
        const fs = require("fs");
        const files = fs.readdirSync(folder);
        files.filter(f => fs.statSync(folder + f).isDirectory())
            .forEach(nested => fs.readdirSync(folder + nested).forEach(f => files.push(nested + '/' + f)));
        const jsFiles = files.filter(f => f.endsWith('.js'));
        if (files.length <= 0) 
            throw new Error('No commands to load!');

        let embed = new Discord.RichEmbed().setColor(config.scoreboard.color).setTitle("Commands");
        const prefix = config.discord.prefix;
        for (const f of jsFiles) {
            const file = require(folder + f);
            const cmd = new file();
            if (typeof cmd.adminCommand === 'undefined')
                embed.addField(prefix + cmd.name, cmd.usage);
        }
        msg.channel.send(embed);

    }
}