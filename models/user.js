module.exports = class BnetUser {

    constructor() {
        this.name = null;
        this.dbName = null;
        this.discName = null;

        this.soloWins = 0;
        this.soloLosses = 0;
        this.soloKills = 0;
        this.soloDeaths = 0;

        this.teamWins = 0;
        this.teamLosses = 0;
        this.teamKills = 0;
        this.teamDeaths = 0;
        
        this.ffaWins = 0;
        this.ffaLosses = 0;
        this.ffaKills = 0;
        this.ffaDeaths = 0;
    }

    toString() {
        return "User{name=" + this.name + ", dbName=" + this.dbName + ", discName=" + this.discName +
        ", soloWins=" + this.soloWins + ", soloLosses=" + this.soloLosses + ", soloKills=" + this.soloKills + ", soloDeaths=" + this.soloDeaths + 
        ", teamWins=" + this.teamWins + ", teamLosses=" + this.teamLosses + ", teamKills= " + this.teamKills + ", teamDeaths=" + this.teamDeaths + 
        ", ffaWins=" + this.ffaWins + ", ffaLosses=" + this.ffaLosses + ", ffaKilsl= " + this.ffaKills + ", ffaDeaths=" + this.ffaDeaths;
    }

}
