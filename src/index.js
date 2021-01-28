const onError = require('./core/events/onError')
const onMessage = require('./core/events/onMessage')
const onReaction = require('./core/events/onReaction')
const settings = require('./core/settings')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const noteModel = require('./core/model/note')

module.exports = class Bot {
  constructor(client, mongo) {
    client._botSettings = settings
    client._botFetch = fetch
    client._botMessageEmbed = MessageEmbed
    client._botMongo = mongo
    client.conf = {
      prefix: process.env.PREFIX,
    }
    this.client = client

    // Load Command
    client._botCommands = this.loadCommands()
    // Avvio il core del bot
    this.loadCore(client).catch((e) => {
      console.log(e)
    })
    client.on('ready', (error) => {
      if (error) {
        console.log(error, 'Errore di avvio BOT')
        throw error
      } else {
        console.log('Bot online per chiudere CONT + C')
        client.user.setActivity(`${process.env.PREFIX}help per maggiori dettagli`).catch((e) => {
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
    const Demo = require('./commands/test/demo')
    const Note = require('./commands/note/note/Note')
    const Notes = require('./commands/note/notes/Notes')
    const DelNote = require('./commands/note/delNote/delNote')
    const GetNotesModeration = require('./commands/note/getNotesModeration/getNotesModeration')

    return {
      coffee: new Coffee(this.client),
      ban: new Ban(this.client),
      kick: new Kick(this.client),
      embed: new Embed(this.client),
      fat_man: new Fatman(this.client),
      embed_example: new EmbedExample(this.client),
      help: new Help(this.client),
      ping: new Ping(this.client),
      code: new Code(this.client),
      hint: new Hint(this.client),
      poll: new Poll(this.client),
      demo: new Demo(this.client),
      note: new Note(this.client, noteModel),
      notes: new Notes(this.client, noteModel),
      del_note: new DelNote(this.client, noteModel),
      get_notes_moderation: new GetNotesModeration(this.client, noteModel),
    }
  }

  async loadCore() {
    onError.init(this.client)
    onMessage.init(this.client)
    onReaction.init(this.client)
  }
}
