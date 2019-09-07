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
                var admin = await Admins.getAdmin(name)
                if (admin == null && !localConfig.superusers.includes(name)) {
                    msg.channel.send(MessageUtils.error("Unauthorized access."));
                    return;  
                }
                msg.delete();
                if (args[0] === "ffa") {
                    Scoreboard.updateFFA(client);
                }
                else if (args[0] === "team") {
                    Scoreboard.updateTeam(client);
                }
                else if (args[0] === "solo") {
                    Scoreboard.updateSolo(client);
                } else {
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