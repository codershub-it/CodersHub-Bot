const onError = require('./core/events/onError')
const onMessage = require('./core/events/onMessage')
const settings = require('./core/settings')
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
require('dotenv').config()

module.exports = class Bot {

    constructor() {
        const client = new Discord.Client();
        client.login(process.env.TOKEN_BOT).catch(e => {console.log(e)})
        client._botSettings = settings
        client._botFetch = fetch
        client._botMessageEmbed = MessageEmbed
        client.conf = {
            prefix: process.env.PREFIX
        };
        client.on('ready', error => {
            if (error) {
                console.log(error, 'Errore di avvio BOT')
                throw error
            } else {
                console.log('Bot online per chiudere CONT + C')
                client.user.setActivity(`${process.env.PREFIX}help per maggiori dettagli`).catch((e) => {
                    console.log(e)
                })
                this.client = client
                // Load Command
                client._botCommands = this.loadCommands()
                // Avvio il core del bot
                this.loadCore().catch((e) => {
                    console.log(e)
                })
            }
        })
    }

    loadCommands() {
        let Help = require('./commands/help')
        let Ban = require('./commands/ban')
        let Kick = require('./commands/kick')
        let Embed = require('./commands/embed')
        let Fatman = require('./commands/fatman')
        let EmbedExample = require('./commands/embed_example')
        let Ping = require('./commands/ping')
        let Code = require('./commands/code')
        let Caffe = require('./commands/caffe')

        return {
            caffè: new Caffe(this.client),
            ban: new Ban(this.client),
            kick: new Kick(this.client),
            embed: new Embed(this.client),
            fat_man: new Fatman(this.client),
            embed_example: new EmbedExample(this.client),
            help: new Help(this.client),
            ping: new Ping(this.client),
            code: new Code(this.client),
        }
    }

    async loadCore() {
        onError.init(this.client)
        onMessage.init(this.client)
    }
}