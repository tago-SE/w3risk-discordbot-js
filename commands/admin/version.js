const MessageUtils = require("../../utils/messageutils");
const Maps = require("../../db/maps");
const Admins = require("../../db/admins");

module.exports = class VersionCommand {

    constructor() {
        this.name = 'version',
        this.alias = ['v'],
        this.usage = '!version [operator] (version/map name) (map name)'
        this.disc = "Manages accepted versions associated to a map";
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
                var arg = args[0];
                if (arg == null) {
                    msg.channel.send(MessageUtils.error("Need to provide operator 'add', 'remove' or 'all'"));
                    return;
                }

                // Show all versions belonging to a map
                if (arg == "all") {
                    args.splice(0, 1);
                    var map = args.join(' ');
                    const foundMap = await Maps.getMap(map);
                    if (foundMap == null) {
                        msg.channel.send(MessageUtils.error("No map matching {" + map.toLowerCase() + "}"));
                    } 
                    else {
                        if (foundMap.versions != undefined && foundMap.versions.length > 0) 
                            msg.channel.send("Versions: " + foundMap.versions.join(', ') + ".");
                        else 
                            msg.channel.send("Versions: none");
                    }
                    return;
                }

                // Add or remove version
                var ver = args[1];
                args.splice(0, 2);
                var map = args.join(' ');
                var foundMap = await Maps.getMap(map);
                if (foundMap == null) {
                    msg.channel.send(MessageUtils.error("No map matching {" + map.toLowerCase() + "}"));
                    return;
                }
                if (arg == "add") {       
                    if (foundMap.versions != undefined && foundMap.versions.includes(ver)) {
                        msg.channel.send(MessageUtils.error(foundMap.name + " already includes version " + ver + "."));
                        return;
                    } 
                    await Maps.addVersion(map, ver);
                    foundMap = await Maps.getMap(map);
                    msg.channel.send("Updated: " + foundMap.name + ", versions = {" + foundMap.versions.join(', ') + "}.");
                }
                else if (arg == "remove") {
                    if (foundMap.versions != undefined && foundMap.versions.includes(ver)) {
                        await Maps.deleteVersion(map, ver);
                        foundMap = await Maps.getMap(map);
                        msg.channel.send("Updated: " + foundMap.name + ", versions = {" + foundMap.versions.join(', ') + "}.");
                    }
                    else {
                        msg.channel.send(MessageUtils.error(foundMap.name + " does not include version " + ver + "."));
                        return;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        })();
    }
}