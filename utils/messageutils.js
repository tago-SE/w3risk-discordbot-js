const Discord = require('discord.js');
const config = require("../config.json");  

module.exports = class MessageUtils {

    static error(str) {
        return "```diff\n" +
                "- " + str + "\n" +
                "```"; 
   }

   static formatRatio(n, m, dec) {
        if (m == 0) {
            if (n != 0)
                return "" + (1).toFixed(dec);
            return "" + (0).toFixed(dc);
        }
        return (n/m).toFixed(dec);
   }


} 