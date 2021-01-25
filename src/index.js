const onError = require('./core/events/onError')
const onMessage = require('./core/events/onMessage')
const onReaction = require('./core/events/onReaction')
const settings = require('./core/settings')
const mongo = require('./core/mongo')
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
        this.loadCore(client).catch((e) => {
          console.log(e)
        })
      }
    })
  }

  loadCommands() {
    const Help = require('./commands/help')
    const Ban = require('./commands/moderation/ban/ban')
    const Kick = require('./commands/moderation/kick/kick')
    const Embed = require('./commands/utility/embed/embed')
    const Fatman = require('./commands/utility/fatman/fatman')
    const EmbedExample = require('./commands/utility/embed/embed_example')
    const Ping = require('./commands/utility/ping/ping')
    const Code = require('./commands/utility/code/code')
    const Coffee = require('./commands/fun/coffee/coffee')
    const Hint = require('./commands/utility/hint/hint')
    const Poll = require('./commands/utility/poll/poll')
    // Note module
    const AddNote = require('./commands/note/addNote/addNote')
    // const DelNote = require('./commands/note/delNote/delNote')
    // const EditNote = require('./commands/note/editNote/editNote')
    // const GetNote = require('./commands/note/getNote/getNote')
    // const ListAppNote = require('./commands/note/listApproveNote/listApproveNote')

    return {
      coffee: new Coffee(this.client),
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
      addnote: new AddNote(this.client),
      // delnote: new DelNote(this.client),
      // editnote: new EditNote(this.client),
      // getnote: new GetNote(this.client),
      // listappnote: new ListAppNote(this.client),
    }
  }

  async loadCore(client) {
    await mongo.init()
    client._botMongo = mongo
    onError.init(this.client)
    onMessage.init(this.client)
    onReaction.init(this.client)
  }
}
