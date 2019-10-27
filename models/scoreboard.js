const Discord = require('discord.js');
const Replay = require('../models/replay');
const Player = require('../models/player');
const BnetUser = require('../models/user');
const Users = require('../db/users');
const config = require("../config.json");  
const MessageUtils = require("../utils/messageutils");
const MathUtils = require ("../utils/mathutils");
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
                .addField("Score", col_2, true)
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

    static updateFFA(client) {
        (async () => {
            var users = await Users.getFFARankedUsersSorted();
            users.sort(function (u1, u2) {
                if (u1.ffaWins == u2.ffaWins) {
                    if (u1.ffaLosses == u2.ffaLosses)
                        return MathUtils.ratio(u2.ffaKills, u2.ffaDeaths) - MathUtils.ratio(u1.ffaKills, u1.ffaDeaths);
                    return u1.ffaLosses - u2.ffaLosses;
                }
                return u2.ffaWins - u1.ffaWins;
            });
            var names = "";
            var wl = "";
            var kd = "";
            for (var i = 0; i < users.length; i++) {
                if (users[i].ffaWins === 0) 
                    break;
                names += (i + 1) + ". " + users[i].name + "\n";
                wl += users[i].ffaWins + " - " + users[i].ffaLosses + "\n";
                kd += MessageUtils.formatRatio(users[i].ffaKills, users[i].ffaDeaths, kd_decimals) + "\n";
            }
            Scoreboard.updateChannel(client, config.scoreboard.ffaTitle, names, wl, kd);
        })();
    }

    static updateTeam(client) {
        (async () => {
            var users = await Users.getTeamRankedUsersSorted();
            users.sort(function (u1, u2) {
                if (u1.teamWins == u2.teamWins) {
                    if (u1.teamLosses == u2.teamLosses)
                        return MathUtils.ratio(u2.teamKills, u2.teamDeaths) - MathUtils.ratio(u1.teamKills, u1.teamDeaths);
                   return u1.teamLosses - u2.teamLosses;
                }
                return u2.teamWins - u1.teamWins;
            });
            var names = "";
            var wl = "";
            var kd = "";
            for (var i = 0; i < users.length; i++) {
                if (users[i].teamWins === 0) 
                    break;
                names += (i + 1) + ". " + users[i].name + "\n";
                wl += users[i].teamWins + " - " + users[i].teamLosses + "\n";
                kd += MessageUtils.formatRatio(users[i].teamKills, users[i].teamDeaths, kd_decimals) + "\n";
            }
            Scoreboard.updateChannel(client, config.scoreboard.teamTitle, names, wl, kd);
        })();
    }

    static updateSolo(client) {
        (async () => {
            var users = await Users.getSoloRankedUsersSorted();
            users.sort(function (u1, u2) {
                if (u1.soloWins == u2.soloWins) {
                    if (u1.soloLosses == u2.soloLosses)
                        return MathUtils.ratio(u2.soloKills, u2.soloDeaths) - MathUtils.ratio(u1.soloKills, u1.soloDeaths);
                   return u1.soloLosses - u2.soloLosses;
                }
                return u2.soloWins - u1.soloWins;
            });
            var names = "";
            var wl = "";
            var kd = "";
            for (var i = 0; i < users.length; i++) {
                if (users[i].soloWins === 0) 
                    break;
                names += (i + 1) + ". " + users[i].name + "\n";
                wl += users[i].soloWins + " - " + users[i].soloLosses + "\n";
                kd += MessageUtils.formatRatio(users[i].soloKills, users[i].soloDeaths, kd_decimals) + "\n";
            }
            Scoreboard.updateChannel(client, config.scoreboard.soloTitle, names, wl, kd);
        })();
    }

    /**
     * Updates the scoreboard after a 4 second delay
     * @param {DiscordBot} client 
     * @param {String} gameType 
     */
    static updateScoreboard(client, gameType) {
        setTimeout(function() {
            if (gameType == "solo") {
                console.log("scoreboard: solo");
                Scoreboard.updateSolo(client);
            }
            else if (gameType == "team") {
                console.log("scoreboard: team");
                Scoreboard.updateTeam(client);
            }
            else if (gameType == "ffa") {
                console.log("scoreboard: ffa");
                Scoreboard.updateFFA(client);
            }
        }, 4000);
    }

    /**
     * Updates all the scoreboard after a 4 second delay
     * @param {*} client 
     */
    static update(client) {
        setTimeout(function() {
            Scoreboard.updateSolo(client);
            Scoreboard.updateFFA(client);
            Scoreboard.updateFFA(client);
        }, 4000);
    }
}