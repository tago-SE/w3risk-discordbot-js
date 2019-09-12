const MessageUtils = require("../../utils/messageutils");
const Admins = require('../../db/admins');
const Users = require('../../db/users');
const Replays = require('../../db/replays');
const Scoreboard = require('../../models/scoreboard');
/**
 * This command enables superusers to grant or remove admin access to members of the channel. 
 */
module.exports = class AdminCommand {

    constructor() {
        this.name = 'ranked',
        this.alias = ['r'],
        this.usage = '!ranked [game id] [flag]'
        this.disc = "Marks a played game as either ranked or unraked."
        this.adminCommand = true;
    }

    run(client, msg, args) {
        var name = (msg.author.username + "#" + msg.author.discriminator).toLowerCase();
        const ConfigUtils = require('../../utils/configutils');
        let localConfig = ConfigUtils.findConfigMatchingMessage(msg);
        (async () => {
            var admin = await Admins.getAdmin(name)
            if (admin == null && !localConfig.superusers.includes(name)) {
                msg.channel.send(MessageUtils.error("Unauthorized access."));
                return;  
            }
            if (args.length < 1) {
                msg.channel.send(MessageUtils.error("No game id specified."));
                return;
            }
            var flag = args[1].toLowerCase();
            if (args.length < 2 || (flag !== "true" && flag !== "false")) {
                msg.channel.send(MessageUtils.error("Ranked must be set to either 'true' or 'false'."));
                return;
            }
            const gameId = parseInt(args[0]);
            if (isNaN(gameId)) 
            {
                msg.channel.send(MessageUtils.error("Invalid replay id {" + args[0] + "}"));
                return;
            }
            var replay = await Replays.getReplayByGameId(gameId);
            if (replay === null) {
                msg.channel.send(MessageUtils.error("No replay foud matching {" + gameId + "}"));
                return;
            }
            // Invalidate replay
            if (replay.rankedMatch && flag === "false") {
                try {
                    await Replays.updateRankedById(gameId, false);
                    msg.channel.send("Replay {" + gameId + "} invalidated.");
                    await Users.increaseStats(replay, -1);  // Decrease stats 
                    msg.channel.send("Stats have been updated.");
                    Scoreboard.updateScoreboard(client, replay.gameType);
                } catch (err) {
                    console.log(err);
                }
            } else if (!replay.rankedMatch && flag === "true") {
                try {
                    await Replays.updateRankedById(gameId, true);
                    msg.channel.send("Replay {" + gameId + "} validated as ranked.");
                    await Users.increaseStats(replay, 1);   // Increase stats 
                    msg.channel.send("Stats have been updated.");
                    Scoreboard.updateScoreboard(client, replay.gameType);
                } catch(err) {
                    console.log(err);
                }
            }

        })();
    }
}