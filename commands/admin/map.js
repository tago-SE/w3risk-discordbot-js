const MessageUtils = require("../../utils/messageutils");

module.exports = class MapCommand {

    constructor() {
        this.name = 'map',
        this.alias = ['m'],
        this.usage = '!map [name]'
        this.disc = "Manages the maps contained inside the database";
        this.adminCommand = true;
    }

    run(client, msg, args) {
        
        var name = msg.author.username + "#" + msg.author.discriminator;
        const ConfigUtils = require('../../utils/configutils');
        let localConfig = ConfigUtils.findConfigMatchingMessage(msg);
        
        if ( !localConfig.superusers.includes(name)) {
            msg.channel.send(MessageUtils.error("Unauthorized access."));
            return;  
        }
        if (args < 1) {
            msg.channel.send(MessageUtils.error("Need to provide operator 'add' or 'remove' followed by map name"));
            return;
        }
        const Maps = require("../../db/maps");
        (async () => {
            var arg = args[0];
            args.splice(0, 1);
            var map = args.join(' ');
            if (arg == "add") {
                if (map.length > 0) {
                    Maps.insertMap(map);
                    msg.channel.send("Updated map: " + map)
                } else {
                    msg.channel.send(MessageUtils.error("No specified map name"));
                }
            }
            else if (arg == "remove") {
                var response = await Maps.getMap(map);
                if (response != null) {
                    Maps.deleteMap(map);
                    msg.channel.send("Removed map: " + map)
                } else {
                    msg.channel.send(MessageUtils.error("No map found matching {" + map + "}"));
                }
            } 
            else {
                msg.channel.send(MessageUtils.error("Did not recognize operator {" + arg + "} must be either 'add' or 'remove'"));
            }
        })();
    } 
}

