const MessageUtils = require("../utils/messageutils");
const Users = require('../db/users');
// Constants
const MaxUsersShown = 50;

module.exports = class PlayersCommand {

    constructor() {
        this.name = 'players',
        this.alias = ['p'],
        this.usage = '!players [search]'
        this.desc = 'Queries for matching player names.'
    }

    run(client, msg, args) {
        var search = "";
        if (args.length >= 1) 
            search = args[0].toLowerCase();
        Users.getMatchingUsers(search).then(function (users) {
            if (users.length > 0) {
                var names = "";
                for (var i = 0; i < users.length && i < MaxUsersShown; i++) 
                    names += users[i].name + ", ";
                names = names.substring(0, names.length - 2) + ".";
                if (users.length >= MaxUsersShown)
                    names += "..";
                msg.channel.send("(" + users.length + "): " + names);
                
            } else {
                msg.channel.send(MessageUtils.error("No players found matching {" + search + "}."));
            }
        })
        .catch(err => {
            console.log(err);
            msg.channel.send(MessageUtils.error("Failed to query database."));
        });
    }
}