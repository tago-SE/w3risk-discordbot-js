const MessageUtils = require("../../utils/messageutils");
const Admins = require('../../db/admins');
const Scoreboard = require('../../models/scoreboard');
const Users = require('../../db/users');
const BnetUser = require('../../models/user');

module.exports = class UpdateStatsCommand {

    constructor() {
        this.name = 'update'
        this.alias = ['up']
        this.usage = this.name + " [player] [solo/team/ffa] [win/lose] (wins/losses) (kills) (deaths)"
        this.desc = "Updates user stats."
        this.adminCommand = true
    }

    static invalidLeagueError(msg, gameType) {
        msg.channel.send(MessageUtils.error("Invalid league specified {" + gameType + "}."));
    }

    static invalidResultError(msg, result) {
        msg.channel.send(MessageUtils.error("Invalid result specified {" + result + "} must be either 'win' or 'lose'."));
    }

    run(client, msg, args) {
        
        var adminName = (msg.author.username + "#" + msg.author.discriminator).toLowerCase();
        const ConfigUtils = require('../../utils/configutils');
        const localConfig = ConfigUtils.findConfigMatchingMessage(msg);

        (async () => {
            try {
                var admin = await Admins.getAdmin(adminName)
                if (admin == null && !localConfig.superusers.includes(adminName)) {
                    msg.channel.send(MessageUtils.error("Unauthorized access."));
                    return;  
                }

                if (args.length < 1) {
                    msg.channel.send(MessageUtils.error("No username specified."));
                    return;
                }

                var user = new BnetUser();
                user.dbName = args[0].toLowerCase();
                var targetUser = await Users.getUserByName(user.dbName);
                
                if (targetUser == null) {
                    msg.channel.send(MessageUtils.error("No player by the name {" + user.dbName + "} was found."));
                    return;
                }
                if (args.length < 2) {
                    msg.channel.send(MessageUtils.error("Must specify league {ffa, solo, team}."));
                    return;
                }
                if (args.length < 3) {
                    msg.channel.send(MessageUtils.error("Missing result flag {win/lose}."));
                    return;
                }

                if (args.length < 4) {
                    msg.channel.send(MessageUtils.error("No stat changes were specified."));
                    return;
                }
                user.name = targetUser.name;
                var n = (isNaN(args[3])? 0 : parseInt(args[3]));
                var k = (isNaN(args[4])? 0 : parseInt(args[4]));
                var d = (isNaN(args[5])? 0 : parseInt(args[5]));
                var gameType = args[1].toLowerCase();
                var result = args[2].toLowerCase();
                if (gameType == "ffa") {
                    user.ffaKills = k;
                    user.ffaDeaths = d;
                    if (result ==  "win") {
                        user.ffaWins =  n;
                    }
                    else if (result == "lose") {
                        user.ffaLosses = n;
                    } 
                    else {
                        UpdateStatsCommand.invalidResultError(msg, result);
                        return;
                    }
                } 
                else  if (gameType == "solo") {
                    user.soloKills = k;
                    user.soloDeaths = d;
                    if (result ==  "win") {
                        user.soloWins =  n;
                    }
                    else if (result == "lose") {
                        user.soloLosses = n;
                    } 
                    else {
                        UpdateStatsCommand.invalidResultError(msg, result);
                        return;
                    }
                } 
                else  if (gameType == "team") {
                    user.teamKills = k;
                    user.teamDeaths = d;
                    if (result ==  "win") {
                        user.teamWins =  n;
                    }
                    else if (result == "lose") {
                        user.teamLosses = n;
                    } 
                    else {
                        UpdateStatsCommand.invalidResultError(msg, result);
                        return;
                    }
                } 
                else {
                    UpdateStatsCommand.invalidLeagueError(msg, gameType);
                    return;
                }
                await Users.increateSingleUserStats(user);
                Scoreboard.updateScoreboard(client, gameType);
                msg.channel.send("Updated {" + user.name + "} stats.");
            } catch(err) {
                console.log(err);
            }
        })();
    }
}