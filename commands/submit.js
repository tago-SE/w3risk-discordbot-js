const fetch = require('node-fetch');
const Discord = require('discord.js');
const Replay = require('../models/replay');
const Player = require('../models/player');
const secret = require("../.secret.json");   
const MessageUtils = require("../utils/messageutils");
const Scoreboard = require("../models/scoreboard");
const Users = require("../db/users");

module.exports = class SubmitCommand {
    constructor() 
    {
        this.name = 'submit',
        this.alias = ['s'],
        this.usage = '!submit [replay id]'
        this.desc = 'Submits a replay id from wc3stats.com'
    }

    static formatResultTitle(replay) 
    {
        var rankedStr = "(Unranked)";
        if (replay.rankedMatch)
            rankedStr = "(Ranked)";
        switch (replay.gameType) 
        {
            case "team": return "#" + replay.id + " Team Game " + rankedStr;
            case "solo": return "#" + replay.id + " Solo Game " + rankedStr;  
            case "ffa": return "#" + replay.id + " FFA Game " + rankedStr;  
            case "single": return "#" + replay.id + " Singe Player";  
        }
        return "#" + replay.id + " Invalid Game Type"; 
    }
    
    static formatResultSettings(replay) 
    {
        if (replay.fog == 0)
            return "Fog off";
        if (replay.fog == 1)
            return "Fog on";
        if (replay.fog == 2)
            return "Night fog";
        if (replay.fog == 3)
            return "Partial fog";
        return "Invalid Settings";
    }

    static displayResult(msg, replay) 
    {
        var playerStr = "";
        var resultStr = "";
        var kdStr = "";
        for (var i = 0; i < replay.players.length; i++) 
        {
            if (replay.gameType === "team" && replay.players[i].team != -1) {
                 playerStr += "(" + replay.players[i].team + ") " + replay.players[i].name + "\n";  
            } 
            else 
                playerStr += replay.players[i].name + "\n";  
            resultStr += replay.players[i].result + "\n";
            kdStr += replay.players[i].kills + "/" + replay.players[i].deaths + "\n";
        }

        const ConfigUtils = require('../utils/configutils');
        let localConfig = ConfigUtils.findConfigMatchingMessage(msg);

        // Update Display
        const embdedResult = new Discord.RichEmbed()
        .setColor(localConfig.color)
        .setTitle(SubmitCommand.formatResultTitle(replay))
        .setURL('https://wc3stats.com/games/' + replay.id)
        .setDescription(SubmitCommand.formatResultSettings(replay))
        .addField('Players', playerStr, true)
        .addField('Result', resultStr, true)
        .addField('K/D', kdStr, true)
        .setTimestamp(new Date(replay.timestamp))
        .setFooter(replay.turns + ' turns', 'https://cdn.discordapp.com/attachments/413107471222308864/614788523526193193/risk_avatar_trees_big.png');
        msg.channel.send(embdedResult);
    }

    run(client, msg, args) {
        const id = parseInt(args[0]);
        if (isNaN(id)) 
        {
            msg.channel.send(MessageUtils.error("Invalid replay id {" + args[0] + "}"));
            return;
        }
        (async () => {            

            const Wc3stats = require("../controllers/Wc3Stats");
            var jsonBody = await Wc3stats.fetchReplayById(id);           
            if (jsonBody == null || jsonBody == "No results found.") {
                msg.channel.send(MessageUtils.error("Failed to fetch replay {" + id + "} from end point."));
                return;
            }
            console.log(jsonBody);

            const Replays = require("../db/replays");
            const ParseReplay = require("../controllers/ParseReplay");

            // Attempt to parse replay
            //
            var replay = ParseReplay.parseRisk(jsonBody);

            if (replay.error != 0) {
                const Maps = require('../db/maps');
                const foundMap = await Maps.getMap(replay.map);
                if (foundMap != null) {
                    var ver = replay.richMap.substring(14, 19);
                    if (foundMap.versions != undefined && foundMap.versions.includes(ver)) {
                        msg.channel.send(MessageUtils.error("Failed to parse replay {" + id + "}"));
                        Replays.setReplayFailureFlag(id, replay.error);
                    } 
                    else {
                        msg.channel.send(MessageUtils.error("Does not support version {" + ver + "}"));
                    }
                } 
                else {
                    msg.channel.send(MessageUtils.error("Does not support map {" + replay.map + "}"));
                }
                return;
            }
            try {
                var result = await Replays.getReplayByGameId(replay.id);
                if (result == null) {
                    Replays.insert(replay);
                    SubmitCommand.displayResult(msg, replay);
                    if (replay.rankedMatch) {
                        await Users.increaseStats(replay, 1);
                        Scoreboard.updateScoreboard(client, replay.gameType);
                    }
                } else {
                    msg.channel.send(MessageUtils.error("Replay already submitted {" + replay.id + "}"));
                }
            } catch (err) {
                console.log(err);
            }
        })();
        
        /*
        }).catch(err => 
        {
            console.log(err);
            msg.channel.send(MessageUtils.error("Failed to parse replay {" + args[0] + "}"));
        });
        */
    }
}