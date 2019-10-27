const MessageUtils = require("../utils/messageutils");
const Maps = require("../db/maps");

module.exports = class SubmitCommand {
    constructor() 
    {
        this.name = 'versions'
        this.alias = ['vs']
        this.usage = this.name;
        this.desc = 'Current official league games.'
    }

    run(client, msg, args) {
        (async () => {          
            var map = "Risk Reforged"; 
            const foundMap = await Maps.getMap(map);
            if (foundMap == null) {
                msg.channel.send(MessageUtils.error("No map matching {" + map.toLowerCase() + "}"));
            } 
            else {
                if (foundMap.versions != undefined && foundMap.versions.length > 0) {
                    foundMap.versions.sort();
                    msg.channel.send("Versions: " + foundMap.versions.join(', ') + ".");
                }
                else 
                    msg.channel.send("Versions: none");
            }
        })();
    }

}