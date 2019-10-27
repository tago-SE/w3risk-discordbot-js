const Replay = require('../models/replay');
const Player = require('../models/player');
const StringUtils = require('../utils/strutils');

module.exports = class ParseReplay {

    static getVersion(mapName) {
        var startIndex = -1;
        var endIndex = -1;
        var dotCounter = 0;
        var prevWasNumber = false;
        for (var i = 0; i < mapName.length; i++) {
            let c = mapName.charAt(i);

            if (StringUtils.charIsNumber(c)) {
                if (startIndex == -1) {
                    startIndex = i;
                    
                };
                endIndex = i;
                prevWasNumber = true;
                continue;
            } 
            else if (StringUtils.charIsLetter(c) && prevWasNumber && StringUtils.isLowerCase(c)) {
                prevWasNumber = false;
                endIndex = i;
                break;
            }
            else if (c == '.' && dotCounter == 0 && prevWasNumber) {
                dotCounter++;
                endIndex = i;
                prevWasNumber = false;
            } 
            else if (startIndex != -1) {
                break;
            }
        }
        return mapName.substring(startIndex, endIndex + 1);
    }

    static parseRisk(bodyObj) {
        var replay = new Replay();
        try {
            replay.id = bodyObj.id;
            replay.map = bodyObj.map;
            replay.timestamp = bodyObj.playedOn*1000;
            replay.length = bodyObj.length;
            replay.uploader = bodyObj.uploads[0].saver;
            replay.richMap = bodyObj.data.game.map;
            replay.version = ParseReplay.getVersion(replay.richMap);

            const playersObj = bodyObj.data.game.players;

            for (var i = 0; i < playersObj.length; i++) {
                const playerObj = playersObj[i];
                var player = new Player();

                 // Default player data
                 player.name = playerObj.name;
                 player.apm = playerObj.apm;
                 player.color = playerObj.colour;
                 player.stayPercent = playerObj.stayPercent;

                // Custom palyer data
                const varObj = playerObj.variables;

                if (varObj != null) {
                    try {
                        // Settings stored inside the first player
                        if (i == 0)  {
                            var args = varObj.other.split(' ');
                            replay.rankedMatch = (args[0] === "1");
                            replay.fog = args[1];
                            replay.turns = args[2];
                        }
                        player.result = varObj.result;
                        player.kills = varObj.kills;
                        player.deaths = varObj.deaths;
                        player.gold = varObj.gold;
                        player.team = varObj.team;
                    } catch (err) {
                        console.log("Failed to parse Custom Data of " + player.name);
                        replay.error = 3; 
                    }
                
                    // Add none observing players to the list
                    if (player.result != null && player.result !== "obs") {
                        replay.players.push(player);
                    }
                } else {
                    replay.error = 2;   
                }
            }
             // Detects game type depending on team arrangement and sorts players accordingly 
             replay.update();   
        } catch(err) {
            replay.error = 1;
            console.log(err);
        }
        return replay;
    }
}