const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');

module.exports = class CommandsCommand {

    constructor() {
        this.name = 'commands',
        this.alias = ['c'],
        this.usage = '!commands'    
        this.desc = 'Reveal bot commands.'
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

        const ConfigUtils = require('../utils/configutils');
        const localConfig = ConfigUtils.findConfigMatchingMessage(msg);
        const embed = new Discord.RichEmbed().setColor(localConfig.color).setTitle("Commands");
        const prefix = localConfig.prefix;

        for (const f of jsFiles) {
            const file = require(folder + f);
            const cmd = new file();
            if (typeof cmd.adminCommand === 'undefined')
                embed.addField(prefix + cmd.name, cmd.desc + " ***" + cmd.usage + "***");
        }
        msg.channel.send(embed);

    }
}