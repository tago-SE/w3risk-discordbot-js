const Replay = require('../models/replay');
const Player = require('../models/player');

module.exports = class ParseReplay {

    static parseRisk(bodyObj) {
        var replay = new Replay();
        try {
            replay.id = bodyObj.id;
            replay.map = bodyObj.map;
            replay.timestamp = bodyObj.playedOn*1000;
            replay.length = bodyObj.length;
            replay.uploader = bodyObj.uploads[0].saver;
            replay.richMap = bodyObj.data.game.map;
            const playersObj = bodyObj.data.game.players;

            for (var i = 0; i < playersObj.length; i++) {
                const playerObj = playersObj[i];
                var player = new Player();

                 // Default player data
                 player.name = playerObj.name;
                 player.apm = playerObj.apm;
                 player.stayPercent = playerObj.stayPercent;

                // Custom palyer data
                const varObj = playerObj.variables;

                if (varObj != null) {

                     // Settings stored inside the first player
                    if (i == 0)  {
                        var args = varObj.other.split(' ');
                        replay.rankedMatch = (args[0] === "1");
                        replay.fog = args[1];
                        replay.turns = args[2];
                        replay.version = args[3];
                    }

                    player.result = varObj.result;
                    player.kills = varObj.kills;
                    player.deaths = varObj.deaths;
                    player.gold = varObj.gold;
                    player.team = varObj.team;

                    // Add none observing players to the list
                    if (player.result != null && player.result !== "obs") {
                        replay.players.push(player);
                    }

                    // Detects game type depending on team arrangement and sorts players accordingly 
                    replay.update();   
                } else {
                    replay.error = 2;   
                }
            }
        } catch(err) {
            replay.error = 1;
            console.log(err);
        }
        return replay;
    }
}