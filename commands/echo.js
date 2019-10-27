module.exports = class PlayersCommand {

    constructor() {
        this.name = 'echo'
        this.alias = ['e']
        this.usage = this.name
        this.desc = 'Returns a response to see if the bot is responsive.'
    }

    run(client, msg, args) {
        msg.channel.send(args);
    }
}