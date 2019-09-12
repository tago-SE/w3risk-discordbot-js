const Discord = require('discord.js');      
const { CommandHandler } = require('djs-commands');
const config = require("./config.json");   
const secret = require("./.secret.json");   
const MessageUtils = require("./utils/messageutils");
// const axios = require('axios')
const client = new Discord.Client();

const request = require('request-promise');
//
//import request from 'request-promise';

const Wc3Stats = require('./controllers/Wc3Stats')
// Test
const Users = require('./db/users');
const ConfigUtils = require('./utils/configutils');
// END Test



const CH = new CommandHandler({
    folder: __dirname + "/commands/",
    prefix: config.discord.prefix
});



client.on('ready', () => {
    // Runs when the bot starts
    console.log(`Logged in as ${client.user.tag} (${client.user.id}) on ${client.guilds.size} server(s)`);
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
});

client.on('guildCreate', guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

/*
client.on('guildMemberAdd', member => {
    member.send("Welcome to the Risk Server! :)\n" +
    "If you wish to participate in the Risk-League you should checkout <#" + config.submissions.channelId + ">, " + 
    "where you can submit replays of your victores to climb the risk-ladder.");
});
*/
  
client.on('message', msg => {

    // TEST
    // Name has changed
    // ReplayWatcher.fetchLatestReplays();

    // Ignore messages sent by bots
    if (msg.author.bot)  return;
    // Ignore messages posted in wrong channels
    if (!config.discord.channels.includes(msg.channel.id)) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "!say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = msg.content.slice(config.discord.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // Check for attachments
    if (msg.attachments.size > 0) {
        let attached = msg.attachments.array()[0];
        let fname = attached.filename;
        if (fname.substring(fname.length - 4, fname.length) !== ".w3g") {
            msg.channel.send(MessageUtils.error("Invalid file format. Can only read w3g files."));
        } else {

            Wc3Stats.postReplayAttachment(attached)
            .then(json => {
                msg.channel.send("Replay uploaded: https://wc3stats.com/games/" + json.body.id);
                const SubmitCommand = require('./commands/submit');
                new SubmitCommand().run(client, msg, [json.body.id]); 
            })
            .catch(err => {
                console.log(err);
            });
        }
        //msg.delete();
    }
    // Ignore none command messages 
    if (msg.content.indexOf(config.discord.prefix) !== 0) return;

    console.log("Command: " + command);

    // Handle command
    const cmd = CH.getCommand('!' + command);
    if (!cmd) {
        return;
    }
    try {
        cmd.run(client, msg, args);
    } catch (e) {
        console.log(e);
    }

});
  
client.login(secret.discord.token);


