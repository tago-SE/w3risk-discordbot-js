class Replay {

    constructor() {
        this.id = null;
        this.map = null;
        this.version = null;
        this.length = null;
        this.uploader = null;
        this.turns = null;
        this.gameType = null;
        this.timestamp = null;
        this.rankedMatch = null;
        this.fog = null;
        this.activePlayers = null;
        this.players = [];
    }

    /**
     * Determines game type depending on team configuration (1vs1, team game or ffa), counts active players and sort players by teams if necessary. 
     */
    update() {
        this.gameType = "ffa";          // default game type: ffa
        this.activePlayers = 0;  

        var teamMembersCount = [];
        for (var i = 0; i < 24; i++)
            teamMembersCount[i] = 0;

        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (player.result === "obs") 
                continue;
            if (player.result !== "win" && player.result !== "lose" && player.result !== "draw")    //Should throw exception here really...
                console.error("invalid result for " + player.name + ": " + player.result);
            // Increase count of active players and number of team members to the team the player belongs to
            this.activePlayers++;       
            if (player.team >= 0) {
                teamMembersCount[player.team]++;
                if (teamMembersCount[player.team] > 1)
                    this.gameType = "team"
            }
        }
        if (this.activePlayers <= 1) 
            this.gameType = "single";
        else if (this.gameType === "ffa" && this.activePlayers === 2)
            this.gameType = "solo";

        // if team game then sort the players by team
        if (this.gameType === "team") {
            this.players.sort(function(p1, p2) {
                return p1.team - p2.team;
            });
        }
    }

    toString() { 
        var playerStr = "";
        for (var i = 0; i < this.players; i++) {
            playerStr += this.players[i].toString();
        } 
        return "Replay{id=" + this.id + ", map=" + this.map + ", version=" + this.version + ", length=" + this.length + 
        ", uploader=" + this.uploader + ",turns=" + this.turns + ", gameType=" + this.gameType + ", timestamp=" + this.timestamp + 
        ", rankedMatch=" + this.rankedMatch + ", fog=" + this.fog + ", activePlayers=" + this.activePlayers + ", players=" + playerStr + "}";
    }

}
module.exports = Replay;