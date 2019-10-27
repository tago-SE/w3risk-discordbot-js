const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');

module.exports = class CommandsCommand {

    constructor() {
        this.name = 'commands'
        this.alias = ['c']
        this.usage = this.name + " (-a)"
        this.desc = "Reveal public (or optionally) admin bot commands."
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

        var showAdminCommands = args.length > 0 && args[0].toLowerCase() == "-a";
        if (showAdminCommands) {
            
        }

        for (const f of jsFiles) {
            const file = require(folder + f);
            const cmd = new file();
          
            if ((typeof cmd.adminCommand === 'undefined' && !showAdminCommands) || // Only show public commands
                (typeof cmd.adminCommand !== 'undefined' && cmd.adminCommand && showAdminCommands)) { // Only show admin commands
                    embed.addField(prefix + cmd.usage, cmd.desc + "\n***");
                }
        }

        msg.delete();

        
        msg.channel.send(embed);

    }
}