const Discord = require('discord.js');
const config = require("../config.json");  

module.exports = class MessageUtils {

    static error(str) {
        return "```diff\n" +
                "- " + str + "\n" +
                "```"; 
   }

} 