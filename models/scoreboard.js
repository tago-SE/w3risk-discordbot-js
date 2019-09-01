const Discord = require('discord.js');
const Replay = require('../models/replay');
const Player = require('../models/player');
const BnetUser = require('../models/user');
const Users = require('../db/users');
const config = require("../config.json");  
const MessageUtils = require("../utils/messageutils");
const fs = require('fs')

module.exports = class Scoreboard {

    static updateChannel(client, title, names, wins, losses) {
        try {
            let embed = new Discord.RichEmbed()
            .setColor(config.scoreboard.color)
            .setTitle(title)
            .addField("Player", names, true)
            .addField("Wins", wins, true)
            .addField("Losses", losses, true);
            const scoreboardChannel = client.channels.get(config.scoreboard.channelId);
            scoreboardChannel.fetchMessages({limit: 100}).then(msgMap => {
                const messages = msgMap.array();
                for (var i = 0; i < messages.length; i++) {
                    if (messages[i].embeds !== null) {
                        if (messages[i].embeds[0].title === title) {
                            messages[i].edit(embed);
                            return; // done
                        }
                    }
                }
                // no previous scoreboard found, so we create a new one
                scoreboardChannel.send(embed)
            });
        } catch(err) {
            console.log(err);
        }
    }

    static updateScoreboard(client, replay) {

        if (replay.gameType === "solo") {
            (async () => {
                var users = await Users.getSoloRankedUsersSorted();
                users.sort(function (u1, u2) {
                    if (u1.soloWins == u2.soloWins) 
                       return u1.soloLosses - u2.soloLosses;
                    return u2.soloWins - u1.soloWins;
                });
                var names = "";
                var wins = "";
                var losses = "";
                for (var i = 0; i < users.length; i++) {
                    if (users[i].soloWins === 0) 
                        break;
                    names += (i + 1) + ". " + users[i].name + "\n";
                    wins += users[i].soloWins + "\n";
                    losses += users[i].soloLosses + "\n";
                }
                Scoreboard.updateChannel(client, config.scoreboard.soloTitle, names, wins, losses);
            })();
        }
        else if (replay.gameType === "team") {
            (async () => {
                var users = await Users.getTeamRankedUsersSorted();
                users.sort(function (u1, u2) {
                    if (u1.teamWins == u2.teamWins) 
                       return u1.teamLosses - u2.teamLosses;
                    return u2.teamWins - u1.teamWins;
                });
                var names = "";
                var wins = "";
                var losses = "";
                for (var i = 0; i < users.length; i++) {
                    if (users[i].teamWins === 0) 
                        break;
                    names += (i + 1) + ". " + users[i].name + "\n";
                    wins += users[i].teamWins + "\n";
                    losses += users[i].teamLosses + "\n";
                }
                Scoreboard.updateChannel(client, config.scoreboard.teamTitle, names, wins, losses);
            })();
        }
        else if (replay.gameType === "ffa") {
            (async () => {
                var users = await Users.getFFARankedUsersSorted();
                users.sort(function (u1, u2) {
                    if (u1.ffaWins == u2.ffaWins) 
                       return u1.ffaLosses - u2.ffaLosses;
                    return u2.ffaWins - u1.ffaWins;
                });
                var names = "";
                var wins = "";
                var losses = "";
                for (var i = 0; i < users.length; i++) {
                    if (users[i].ffaWins === 0) 
                        break;
                    names += (i + 1) + ". " + users[i].name + "\n";
                    wins += users[i].ffaWins + "\n";
                    losses += users[i].ffaLosses + "\n";
                }
                Scoreboard.updateChannel(client, config.scoreboard.ffaTitle, names, wins, losses);
            })();
        }
    }
}