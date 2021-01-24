const onError = require('./core/events/onError')
const onMessage = require('./core/events/onMessage')
const onReaction = require('./core/events/onReaction')
const settings = require('./core/settings')
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
require('dotenv').config()

module.exports = class Bot {
  constructor() {
    const client = new Discord.Client()
    client.login(process.env.TOKEN_BOT).catch((e) => {
      console.log(e)
    })
    client._botSettings = settings
    client._botFetch = fetch
    client._botMessageEmbed = MessageEmbed
    client.conf = {
      prefix: process.env.PREFIX,
    }
    client.on('ready', (error) => {
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
    const Help = require('./commands/help')
    const Ban = require('./commands/ban')
    const Kick = require('./commands/kick')
    const Embed = require('./commands/embed')
    const Fatman = require('./commands/fatman')
    const EmbedExample = require('./commands/embed_example')
    const Ping = require('./commands/ping')
    const Code = require('./commands/code')
    const Caffe = require('./commands/caffe')
    const Hint = require('./commands/hint')
    const Poll = require('./commands/poll')

    return {
      caffè: new Caffe(this.client),
      ban: new Ban(this.client),
      kick: new Kick(this.client),
      embed: new Embed(this.client),
      fat_man: new Fatman(this.client),
      embed_example: new EmbedExample(this.client),
      help: new Help(this.client),
      ping: new Ping(this.client),
      // test: new TestList(this.client),
      code: new Code(this.client),
      hint: new Hint(this.client),
      poll: new Poll(this.client),
    }
  }

  async loadCore() {
    // await mongo.init();
    onError.init(this.client)
    onMessage.init(this.client)
    onReaction.init(this.client)
  }
}
