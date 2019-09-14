module.exports = class Player {

    constructor() {
       this.name = null;
       this.result = null;
       this.apm = 0;
       this.team = 0;
       this.kills = 0;
       this.deaths = 0;
       this.gold = 0;
       this.stayPercent = 0;
       this.color = "";
    }
    
    toString() {
        return "Player{name=" + this.name  + ", result=" + this.result + ", apm=" + this.apm + +", color= " + this.color + ", team=" + this.team + ", k=" + this.kills + ", d=" + this.deaths + ", g=" + this.gold +
         ", stayPercent=" + this.stayPercent + "}";
    }
}