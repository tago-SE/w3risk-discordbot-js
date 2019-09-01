const MessageUtils = require("../utils/messageutils");
const config = require("../config.json");  
const Admins = require('../db/admins');

module.exports = class AdminsCommand {

    constructor() {
        this.name = 'admins',
        this.alias = ['ad'],
        this.usage = '!admins'
        this.disc = "List all bot administrators.";
    }

    run(client, msg, args) {
        (async () => {
            try {
                var currentAdmins = await Admins.getAll();
                var names = "";
                for (var i = 0; i < currentAdmins.length; i++)
                    names += currentAdmins[i].name + ", ";
                for (var i = 0; i < config.discord.superusers.length; i++)
                    names += config.discord.superusers[i] + ", ";
                msg.channel.send("Admins (" + (currentAdmins.length + config.discord.superusers.length) + "): " + names.substring(0, names.length - 2) + ".");
            } catch (err) {
                console.log(err);
            }
        })();
    }
}