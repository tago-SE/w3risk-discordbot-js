module.exports = class Team {

    constructor() {
        this.id = 0;
        this.members = [];
        this.wins = 0;
        this.losses = 0;
        this.kills = 0;
        this.deaths = 0;
    }

    /**
     * Generates a unique team identifier based on the lower case player name of team members. 
     */
    getTeamId() {
        var sum = 0;
        for (var i = 0; i < this.members.length; i++) {
            const lowerCaseName = this.members[i].toLowerCase();
            for (var j = 0; j < this.members[i].length; j++) {
                sum += lowerCaseName.charCodeAt(j);
            }
        } 
        this.id = sum;
        return sum;
    }

    static getTeamId(members) {
        const t = new Team();
        for (var i = 0; i < members.length; i++) {
            t.members.push(members[i]);
        }   
        return t.getTeamId();
    }

    toString() {
        var playerStr = "";
        for (var i = 0; i < this.members.length; i++) {
            playerStr += this.members[i] + ",";
        } 
        return "Team{id=" + this.id + 
        ", members={" + playerStr.substring(0, playerStr.length - 1) + "}" +
        ", wins=" + this.wins + ", losses=" + this.losses + ", kills=" + this.kills + ", deaths=" + this.deaths +
        "}";
    }

}