const MessageUtils = require("../utils/messageutils");
const config = require("../config.json");  
const Admins = require('../db/admins');

module.exports = class AdminsCommand {

    constructor() {
        this.name = 'admins'
        this.alias = ['ad']
        this.usage = this.name;
        this.desc = 'List all bot admins.'
    }

    run(client, msg, args) {

        const ConfigUtils = require('../utils/configutils');
        let localConfig = ConfigUtils.findConfigMatchingMessage(msg);

        (async () => {
            try {
                var currentAdmins = await Admins.getAll();
                var names = "";
                for (var i = 0; i < currentAdmins.length; i++)
                    names += currentAdmins[i].name + ", ";
                for (var i = 0; i < localConfig.superusers.length; i++)
                    names += localConfig.superusers[i] + ", ";
                msg.channel.send("Admins (" + (currentAdmins.length + config.discord.superusers.length) + "): " + names.substring(0, names.length - 2) + ".");
            } catch (err) {
                console.log(err);
            }
        })();
    }
}