const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const Users = require('../db/users');
const unranked = "none";

module.exports = class StatsCommand {

    constructor() {
        this.name = 'stats',
        this.alias = ['st'],
        this.usage = '!stats [player]'
        this.desc = 'Shows player risk stats.'
    }

    static ratio(n, m) {
        if (m == 0) {
            if (n != 0)
                return 1;
            return 0;
        }
        return n/m;
    }

    run(client, msg, args) {

        if (args.length < 1) {
            msg.channel.send(MessageUtils.error("No username specified."));
            return;
        }
        
        const name = args[0].toLowerCase();
        const ConfigUtils = require('../utils/configutils');
        const localConfig = ConfigUtils.findConfigMatchingMessage(msg);
        const kd_decimal = localConfig.scoreboard.kd_decimals;
        const wl_decimal = 1;
        
        (async () => {
            try {
                const user = await Users.getUserByName(name)
                if (user == null) {
                    msg.channel.send(MessageUtils.error("No player by the name {" + name + "} was found."));
                    return;
                }

                // Useful explaination on Promises, async or how to do parallell work: https://stackoverflow.com/questions/57740009/joining-chained-promises
                //
                
                const [teamRank, soloRank, ffaRank] = await Promise.all([ Users.getUserTeamRank(name), Users.getUserSoloRank(name), Users.getUserFFARank(name) ]) 
                
                msg.channel.send(new Discord.RichEmbed()
                    .setColor(localConfig.color)
                    .setTitle(user.name)
                    .addField('FFA', 
                        "Wins: " + user.ffaWins + 
                        "\nLosses: " + user.ffaLosses +
                        "\nRank: " + ((ffaRank > 0)? ffaRank : unranked) + 
                        "\nW/L " + (StatsCommand.ratio(user.ffaWins, user.ffaWins + user.ffaLosses)*100).toFixed(wl_decimal)  +
                        "%\nK/D: " + StatsCommand.ratio(user.ffaKills, user.ffaDeaths).toFixed(kd_decimal), true)
                    .addField('Team', 
                        "Wins: " + user.teamWins + 
                        "\nLosses: " + user.teamLosses +
                        "\nRank: " + ((teamRank > 0)? teamRank : unranked) + 
                        "\nW/L " + (StatsCommand.ratio(user.teamWins, user.teamWins + user.teamLosses)*100).toFixed(wl_decimal) +
                        "%\nK/D: " + StatsCommand.ratio(user.teamKills, user.teamDeaths).toFixed(kd_decimal), true)

                    .addField('Solo', 
                        "Wins: " + user.soloWins + 
                        "\nLosses: " + user.soloLosses +
                        "\nRank: " + ((soloRank > 0)? soloRank : unranked) + 
                        "\nW/L " + (StatsCommand.ratio(user.soloWins, user.soloWins + user.soloLosses)*100).toFixed(wl_decimal) +
                        "%\nK/D: " + StatsCommand.ratio(user.soloKills, user.soloDeaths).toFixed(kd_decimal), true)
                );
            } catch(error) {
                console.log(error)
            }
        })();

    }
}