const config = require("../config.json");  
const secret = require("../.secret.json");  
const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const dateFormat = require('dateformat');

module.exports = class GamesCommand {

    constructor() {
        this.name = 'games',
        this.alias = ['g'],
        this.usage = '!games [user name]'
    }

    run(client, msg, args) {
        var url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(url, function(err, db) {
            if (err) {
                msg.channel.send(MessageUtils.error("Failed to establish connetion with database."));
                return;
            }
            const search = args[0].toLowerCase();
            const dbo = db.db(secret.db.name);
            dbo.collection('replays').find({ players: {
                    $elemMatch: {name : {$regex: new RegExp('^'+ search + '$', "i") }} 
                }
            }).limit(config.games.limit).toArray(function (err, res) {
                if (err) {
                    msg.channel.send(MessageUtils.error("Failed to query the database."));
                    return;
                }
                if (res.length > 0) {
                    res.sort(function (r1, r2) {
                        return r2.timestamp - r1.timestamp;
                    });
                    var ids = "";
                    var results = "";
                    var dates = "";
                    var title = search;
                    for (var i = 0; i < res.length; i++) {
                        var replay = res[i];
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
                    msg.channel.send(new Discord.RichEmbed()
                    .setColor(config.discord.color_1)
                    .setTitle(title)
                    .addField('Replay', ids, true)
                    .addField('Result', results, true)
                    .addField('Date', dates, true));
                } else {
                    msg.channel.send(MessageUtils.error("No players found matching {" + search + "}."));
                }
            });
        });
    }
}