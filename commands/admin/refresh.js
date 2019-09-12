const MessageUtils = require("../../utils/messageutils");
const Admins = require('../../db/admins');
const Scoreboard = require('../../models/scoreboard');


module.exports = class RefreshCommand {

    constructor() {
        this.name = 'refresh',
        this.alias = ['ref'],
        this.usage = '!refresh'
        this.disc = "Refreshes the scoreboard."
        this.adminCommand = true;
    }

    run(client, msg, args) {
        
        var name = (msg.author.username + "#" + msg.author.discriminator).toLowerCase();
        const ConfigUtils = require('../../utils/configutils');
        const localConfig = ConfigUtils.findConfigMatchingMessage(msg);

        (async () => {
            try {
                /*
                var admin = await Admins.getAdmin(name)
                if (admin == null && !localConfig.superusers.includes(name)) {
                    msg.channel.send(MessageUtils.error("Unauthorized access."));
                    return;  
                }
                */
                //msg.delete();
                
                if (args[0] === "ffa") {
                    Scoreboard.updateFFA(client);
                }
                else if (args[0] === "team") {
                    Scoreboard.updateTeam(client);
                }
                else if (args[0] === "solo") {
                    Scoreboard.updateSolo(client);
                } 

                // Checks the site for replays that have not yet been uploaded
                //
                else if (args[0] == "replays") {
                    
                    const Wc3Stats = require("../../controllers/Wc3Stats");
                    const replays = await Wc3Stats.fetchLatestReplays();
                    for (var i = 0; i < replays.length; i++) {
                        if (replays[i].map == "Risk Reforged") {
                            var id = replays[i].id;
                            var replay = await Wc3Stats.fetchReplayById(id);
                            var map = replay.data.game.map.substring(0, 19);
                            var mapName = replay.map;
                            var ver = map.substring(14, 19);

                            // Check if the map is being administrated by the bot
                            //
                            const Maps = require('../../db/maps');
                            const foundMap = await Maps.getMap(mapName);
                            if (foundMap != null) {

                                // Check for valid version
                                // 
                                if (foundMap.versions != undefined && foundMap.versions.includes(ver)) {

                                    // Check if this replay has already been submitted
                                    //
                                    const Replays = require("../../db/replays");
                                    var result = await Replays.getReplayByGameId(id);
                                    if (result == null) {
                                        const SubmitCommand = require("../submit");
                                        new SubmitCommand().run(client, msg, [id]); 
                                    }
                                }
                            }
                        }
                    }    
                } 
                else {
                    Scoreboard.updateFFA(client);
                    Scoreboard.updateTeam(client);
                    Scoreboard.updateSolo(client);
                }
            } catch(err) {
                console.log(err);
            }
        })();
    }
}