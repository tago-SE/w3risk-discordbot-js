const MessageUtils = require("../../utils/messageutils");
const Admins = require('../../db/admins');
const Scoreboard = require('../../models/scoreboard');
const Users = require('../../db/users');
const BnetUser = require('../../models/user');

module.exports = class UpdateStatsCommand {

    constructor() {
        this.name = 'update',
        this.alias = ['up'],
        this.usage = '!update'
        this.disc = "Updates user stats."
        this.adminCommand = true;
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
                const targetUser = await Users.getUserByName(user.dbName)
                user.name = targetUser.name;
                if (targetUser == null) {
                    msg.channel.send(MessageUtils.error("No player by the name {" + user.dbName + "} was found."));
                    return;
                }
                if (args.length < 2) {
                    msg.channel.send(MessageUtils.error("Must specify a attribute {solowins, sololosses, teamwins, teamlosses}"));
                    return;
                }
                if (args.length < 3) {
                    msg.channel.send(MessageUtils.error("Must specify value to change."));
                    return;
                }
                const change = parseInt(args[2]);
                if (isNaN(change)) {
                    msg.channel.send(MessageUtils.error("Failed to parse integer {" + change + "}."));
                    return;
                }
                var gameType = "";
                if (args[1] == "solowins") {
                    user.soloWins = parseInt(args[2]);
                    gameType = "solo";
                }
                else if (args[1] == "sololosses") {
                    user.soloLosses = parseInt(args[2]);
                    gameType = "solo";
                }
                else if (args[1] == "solokills") {
                    user.soloKills = parseInt(args[2]);
                    gameType = "solo";
                }
                else if (args[1] == "solodeaths") {
                    user.soloDeaths = parseInt(args[2]);
                    gameType = "solo";
                }
                else if (args[1] == "teamwins") {
                    user.teamWins = parseInt(args[2]);
                    gameType = "team";
                }
                else if (args[1] == "teamlosses") {
                    user.teamLosses = parseInt(args[2]);
                    gameType = "team";
                }
                else if (args[1] == "teamkills") {
                    user.teamKills = parseInt(args[2]);
                    gameType = "team";
                }
                else if (args[1] == "teamdeaths") {
                    user.teamDeaths = parseInt(args[2]);
                    gameType = "team";
                }
                else if (args[1] == "ffawins") {
                    user.ffaWins = parseInt(args[2]);
                    gameType = "ffa";
                }
                else if (args[1] == "ffalosses") {
                    user.ffaLosses = parseInt(args[2]);
                    gameType = "ffa";
                }
                else if (args[1] == "ffakills") {
                    user.ffaKills = parseInt(args[2]);
                    gameType = "ffa";
                }
                else if (args[1] == "ffadeaths") {
                    user.ffaDeaths = parseInt(args[2]);
                    gameType = "ffa";
                }
                else {
                    msg.channel.send(MessageUtils.error("Invalid field {" + args[1] + "}."));
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