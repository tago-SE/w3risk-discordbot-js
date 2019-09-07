const Discord = require('discord.js');
const config = require("../config.json");  

module.exports = class ConfigUtils {

    /**
     * Returns the config associated to the server a message was sent on
     * @param {Message} message 
     */
   static findConfigMatchingMessage(message) {
        let id = message.channel.id;
        for (var i = 0; i < config.servers.length; i++) {
            if (config.servers[i].channels.includes(id))
                return config.servers[i]; 
        }
        return null;
   }

} 