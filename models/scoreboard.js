const Discord = require('discord.js');
const Replay = require('../models/replay');
const Player = require('../models/player');
const BnetUser = require('../models/user');
const Users = require('../db/users');
const config = require("../config.json");  
const MessageUtils = require("../utils/messageutils");
const fs = require('fs')

const kd_decimals = config.scoreboard.kd_decimals;

module.exports = class Scoreboard {

    static updateChannel(client, title, names, col_2, col_3) {
        try {
            console.log("Updating scoreboard... names.size = " + names.length);
            console.log("names: " + names);
            let embed = new Discord.RichEmbed()
            if (names.length > 0) {
                embed
                .setColor(config.scoreboard.color)
                .setTitle(title)
                .addField("Player", names, true)
                .addField("W/L", col_2, true)
                .addField("K/D", col_3, true);
            }
            const scoreboardChannel = client.channels.get(config.scoreboard.channelId);
            scoreboardChannel.fetchMessages({limit: 100}).then(msgMap => {
                const messages = msgMap.array();
                try {
                    for (var i = 0; i < messages.length; i++) {
                        if (messages[i].embeds !== null && messages[i].embeds.length > 0) {
                            if (messages[i].embeds[0].title === title) {
                                if (names.length > 0)
                                    messages[i].edit(embed);
                                else 
                                    messages[i].delete();
                                return;
                            }
                        }
                    }
                    if (names.length > 0)
                        scoreboardChannel.send(embed)
                } catch(err) {
                    console.log(err);
                }
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
                var wl = "";
                var kd = "";
                for (var i = 0; i < users.length; i++) {
                    console.log("u: " + users[i].name);
                    if (users[i].soloWins === 0) 
                        break;
                    names += (i + 1) + ". " + users[i].name + "\n";
                    wl += users[i].soloWins + " - " + users[i].soloLosses + "\n";
                    kd += MessageUtils.formatRatio(users[i].soloKills, users[i].soloDeaths, kd_decimals) + "\n";
                }
                Scoreboard.updateChannel(client, config.scoreboard.soloTitle, names, wl, kd);
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
                var wl = "";
                var kd = "";
                for (var i = 0; i < users.length; i++) {
                    console.log("u: " + users[i].name);
                    if (users[i].teamWins === 0) 
                        break;
                    names += (i + 1) + ". " + users[i].name + "\n";
                    wl += users[i].teamWins + " - " + users[i].teamLosses + "\n";
                    kd += MessageUtils.formatRatio(users[i].teamKills, users[i].teamDeaths, kd_decimals) + "\n";
                }
                Scoreboard.updateChannel(client, config.scoreboard.teamTitle, names, wl, kd);
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
                var wl = "";
                var kd = "";
                for (var i = 0; i < users.length; i++) {
                    console.log("u: " + users[i].name);
                    if (users[i].ffaWins === 0) 
                        break;
                    names += (i + 1) + ". " + users[i].name + "\n";
                    wl += users[i].ffaWins + " - " + users[i].ffaLosses + "\n";
                    kd += MessageUtils.formatRatio(users[i].ffaKills, users[i].ffaDeaths, kd_decimals) + "\n";
                }
                Scoreboard.updateChannel(client, config.scoreboard.ffaTitle, names, wl, kd);
            })();
        }
    }
}