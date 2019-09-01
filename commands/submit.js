const fetch = require('node-fetch');
const Discord = require('discord.js');
const Replay = require('../models/replay');
const Player = require('../models/player');
const BnetUser = require('../models/user');
const config = require("../config.json");  
const secret = require("../.secret.json");   
const MessageUtils = require("../utils/messageutils");
const Scoreboard = require("../models/scoreboard");
const Users = require("../db/users");

module.exports = class SubmitCommand {
    constructor() 
    {
        this.name = 'submit',
        this.alias = ['s'],
        this.usage = 'Submits a replay id from wc3stats.com'
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
            if (replay.gameType === "team") playerStr += "(" + replay.players[i].team + ") " + replay.players[i].name + "\n";  
            else playerStr += replay.players[i].name + "\n";  
            resultStr += replay.players[i].result + "\n";
            kdStr += replay.players[i].kills + "/" + replay.players[i].deaths + "\n";
        }
        // Update Display
        const embdedResult = new Discord.RichEmbed()
        .setColor(config.discord.color_1)
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

    run(client, msg, args) 
    {
        const id = parseInt(args[0]);
        if (isNaN(id)) 
        {
            msg.channel.send(MessageUtils.error("Invalid replay id {" + args[0] + "}"));
            return;
        }
        fetch(`https://api.wc3stats.com/replays/` + id + `&toDisplay=true`)
        .then(res => res.json())
        .then(json => {
            console.log(json)
            try 
            {
                var body = json.body;
                if (!body) 
                {
                    msg.channel.send(MessageUtils.error("Could not find any replay witht he id {" + id + "}"));
                    return;
                }
                const replay = new Replay();
                replay.id = json.body.id;
                replay.map = json.body.map;
                replay.length = json.body.length;
                replay.uploader = json.body.uploads[0].saver;
                replay.timestamp = json.body.playedOn*1000;
                
                const playersObj = json.body.data.game.players;
                for (var i = 0; i < playersObj.length; i++) 
                {
                    const playerObj = playersObj[i];
                    var player = new Player();

                    // Default player data
                    player.name = playerObj.name;
                    player.apm = playerObj.apm;
                    player.stayPercent = playerObj.stayPercent;

                    // Custom player data
                    const varObj = playerObj.variables;

                    // Settings stored inside the first player
                    if (i == 0) 
                    {
                        var args = varObj.other.split(' ');
                        replay.rankedMatch = (args[0] === "1");
                        replay.fog = args[1];
                        replay.turns = args[2];
                        replay.version = args[3];
                    }
                    player.result = varObj.result;
                    player.kills = varObj.kills;
                    player.deaths = varObj.deaths;
                    player.gold = varObj.gold;
                    player.team = varObj.team;
                    // Add none observing players to the list
                    if (player.result !== "obs")  
                        replay.players.push(player);
                }
                // Detects game type depending on team arrangement and sorts players accordingly 
                replay.update();   

                // Debug
                // msg.channel.send(replay.toString());
                //   
                var MongoClient = require('mongodb').MongoClient;
                var url = "mongodb://" + secret.db.host + ":" + secret.db.port + "/" + secret.db.name;
                MongoClient.connect(url, {useNewUrlParser: true }, function(err, db) 
                {
                    if (err) 
                    {
                        msg.channel.send(MessageUtils.error("Failed to establish connetion with database."));
                        return;
                    }
                    const dbo = db.db(secret.db.name);
                    dbo.collection('replays').findOne({id: replay.id}, function (err, result) 
                    {    
                        if (err) 
                            throw err;
                        if (result) 
                        {
                            msg.channel.send(MessageUtils.error("Replay {" + replay.id + "} has already been submitted.")); 
                        } else 
                        {
                            dbo.collection('replays').insertOne(replay, function(err, result) 
                            {
                                if (err) throw err;
                                if (result) {
                                    SubmitCommand.displayResult(msg, replay);
                                    if (replay.rankedMatch) 
                                    {
                                        (async () => {
                                            await Users.increaseStats(replay, 1);
                                            Scoreboard.updateScoreboard(client, replay);
                                            msg.channel.send("Stats have been updated.");
                                        })();
                                    }
                                }
                            }); 
                        } 
                    });
                });
            } catch (err) 
            {
                console.log(err);
                msg.channel.send(MessageUtils.error("Failed to parse replay {" + args[0] + "}"));
            }
        }).catch(err => 
        {
            console.log(err);
            msg.channel.send(MessageUtils.error("Failed to parse replay {" + args[0] + "}"));
        });
    }
}