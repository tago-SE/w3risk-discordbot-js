const MessageUtils = require("../utils/messageutils");
const Discord = require('discord.js');
const Users = require('../db/users');
const Replays = require('../db/replays');

module.exports = class ScoreCommand {

    constructor() {
        this.name = 'score'
        this.alias = ['sc']
        this.usage = '!score [player 1] [player 2]'
        this.desc = 'Compares score between two players.'
    }

    run(client, msg, args) {

        if (args.length < 2) {
            msg.channel.send(MessageUtils.error("Need to specify two players."));
            return;
        }
        const name0 = args[0].toLowerCase();
        const name1 = args[1].toLowerCase();

        (async () => {
            try {

                const [replays, user0, user1] = await Promise.all([Replays.getPlayerReplays(name0), Users.getUserByName(name0), Users.getUserByName(name1)]);
                if (user0 == null) {
                    msg.channel.send(MessageUtils.error("No players found matching {" + name0 + "}."));
                    return; 
                }
                if (user1 == null) {
                    msg.channel.send(MessageUtils.error("No players found matching {" + name1 + "}."));
                    return; 
                }
                // Clear wins for presentation 
                user0.soloWins = 0;
                user0.ffaWins = 0;
                user0.teamWins = 0;
                user1.soloWins = 0;
                user1.ffaWins = 0;
                user1.teamWins = 0;
                if (replays.length > 0) {
                    for (var i = 0; i < replays.length; i++) {
                        const players = replays[i].players;
                        var result0 = null;
                        var result1 = null;
                        var gameType = replays[i].gameType;
                        for (var j = 0; j < players.length; j++) {
                            if (players[j].name.toLowerCase() == name0) {
                                result0 = players[j].result;
                                if (result0 == null)
                                    break;
                            }
                            else if (players[j].name.toLowerCase() == name1) {
                                result1 = players[j].result;
                                if (result1 == null)
                                    break;
                            }
                            if (result0 != null && result1 != null) {
                                // if user 0 has a victory over user 1
                                if (result0 == "win" && result1 == "lose") {
                                    switch (gameType) {
                                        case "solo": user0.soloWins += 1; break;
                                        case "team": user0.teamWins += 1; break;
                                        case "ffa": user0.ffaWins += 1; break;
                                    }
                                }
                                // if user 1 has a victory over user
                                else if (result1 == "win" && result0 == "lose") {
                                    switch (gameType) {
                                        case "solo": user1.soloWins += 1; break;
                                        case "team": user1.teamWins += 1; break;
                                        case "ffa": user1.ffaWins += 1; break;
                                    }
                                }
                                break;
                            }
                        }
                    }

                    const ConfigUtils = require('../utils/configutils');
                    let localConfig = ConfigUtils.findConfigMatchingMessage(msg);
                    msg.channel.send(new Discord.RichEmbed()
                    .setColor(localConfig.color)
                    .setTitle(user0.name + " x " + user1.name)
                    .addField('League', "FFA\nTeam\nSolo", true)
                    .addField(user0.name, user0.ffaWins + "\n" + user0.teamWins + "\n" + user0.soloWins, true)
                    .addField(user1.name, user1.ffaWins + "\n" + user1.teamWins + "\n" + user1.soloWins, true)
                    );
                }
                else {
                    // Could not find any replays...
                } 
            } catch(error) {
                console.log(error)
            }
        })();

    }
}