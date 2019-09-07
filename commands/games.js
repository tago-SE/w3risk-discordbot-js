const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const dateFormat = require('dateformat');
const Replays = require("../db/replays");

module.exports = class GamesCommand {

    constructor() {
        this.name = 'games',
        this.alias = ['g'],
        this.usage = '!games [user]'
        this.desc = 'Lists a users played games.'
    }

    run(client, msg, args) {

        if (args.length < 1) {
            msg.channel.send(MessageUtils.error("No player specified."));
            return;
        }
        const search = args[0].toLowerCase();
        (async () => {
            try {
                const replays = await Replays.searchPlayerHistory(search);
                if (replays.length > 0) {
                    replays.sort(function (r1, r2) {
                        return r2.timestamp - r1.timestamp;
                    });
                    var ids = "";
                    var results = "";
                    var dates = "";
                    var title = search;
                    for (var i = 0; i < replays.length; i++) {
                        var replay = replays[i];
                        var titleStr = "(Unranked)";
                        if (replay.rankedMatch) 
                        titleStr = "(Ranked)";
                        if (replay.gameType === "ffa") 
                            titleStr = "FFA " + titleStr;
                        else if (replay.gameType === "solo")
                            titleStr = "Solo " + titleStr;
                        else if (replay.gameType === "team")
                            titleStr = "Team " + titleStr;
                        else if (replay.gameType === "single")
                            titleStr = " Single " + titleStr;
                        dates += dateFormat(new Date(replay.timestamp), "d/m/yyyy") + "\n";
                        ids += "[#" + replay.id + " " + titleStr + "](" + "https://wc3stats.com/games/" + replay.id + ")\n";
                        for (var j = 0; j < replay.players.length; j++) {
                            if (replay.players[j].name.toLowerCase() === search) {
                                title = replay.players[j].name;
                                results += replay.players[j].result + "\n";
                                break;
                            }
                        }
                    }

                    const ConfigUtils = require('../utils/configutils');
                    let localConfig = ConfigUtils.findConfigMatchingMessage(msg);

                    msg.channel.send(new Discord.RichEmbed()
                        .setColor(localConfig.color)
                        .setTitle(title)
                        .addField('Replay', ids, true)
                        .addField('Result', results, true)
                        .addField('Date', dates, true));
                } 
                else {
                    msg.channel.send(MessageUtils.error("No players found matching {" + search + "}."));
                }
            } catch(err) {
                msg.channel.send(MessageUtils.error("Failed to query the database."));
            }
        })();
    }
}