const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const ConfigUtils = require('../utils/configutils');

module.exports = class HelpCommand {

    constructor() {
        this.name = 'help',
        this.alias = ['h'],
        this.usage = '!help'
        this.desc = "General information.";
    }

    run(client, msg, args) {
        let localConfig = ConfigUtils.findConfigMatchingMessage(msg);
        msg.channel.send(new Discord.RichEmbed()
        .setColor(localConfig.color)
        .setTitle("Help")
        .addField("Participation", "To participate in the league you must attach your replays in this channel or upload them " +
        "directly to https://wc3stats.com/upload and use the command: ***!submit [id]***.")
        .addField("Commands", "Type '!commands' to see a list of available commands.")
        .addField("Valid Games", "For a replay to be accepted it must be from version 1.54+ and have standard host options to count as a league game. " +
        "For FFA a minimum of 10 players are required. If you play a team game or 1vs1 then select one of the host items called 'Pro Mode'.")
        );
    }
}