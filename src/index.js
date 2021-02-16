const onError = require('./core/events/onError')
const onMessage = require('./core/events/onMessage')
const onReactionSteps = require('./core/events/onReactionSteps')
const onClearNote = require('./core/events/onClearNote')
const onStart = require('./core/events/onStart')
const settings = require('./core/settings')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const noteModel = require('./core/model/note')
const myNoteModel = require('./core/model/myNote')
const eventsModel = require('./core/model/events')
const utility = require('./core/utility/utility')
const onGuildMemberAdd = require('./core/events/onGuilMemberAdd')

module.exports = class Bot {
  constructor(client, mongo) {
    client._botSettings = settings
    client._botUtility = utility
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
        onStart.init(this.client).catch((e) => {
          console.log(e)
        })
      }
    })
  }

  loadCommands() {
    const Help = require('./commands/help')
    const Ban = require('./commands/ban/ban')
    const Kick = require('./commands/kick/kick')
    const Embed = require('./commands/embed/embed')
    const Fatman = require('./commands/fatman/fatman')
    const EmbedExample = require('./commands/embed/embed_example')
    const Ping = require('./commands/ping/ping')
    const Code = require('./commands/code/code')
    const Coffee = require('./commands/coffee/coffee')
    const Hint = require('./commands/hint/hint')
    const Poll = require('./commands/poll/poll')
    const Demo = require('./commands/test/demo')
    const Note = require('./commands/note/note')
    const Notes = require('./commands/note/notes')
    const AllNotes = require('./commands/note/allNotes')
    const DelNote = require('./commands/note/delNote')
    const GetNotesModeration = require('./commands/note/getNotesModeration')
    const Say = require('./commands/say/say')
    const EightBall = require('./commands/eightBall/eightBall')
    const Opla = require('./commands/opla/opla')
    const Eval = require('./commands/eval/eval')
    const UpdateRole = require('./commands/update-role/updateRole')
    const Event = require('./commands/event/event')
    const MyNote = require('./commands/my-note/myNote')
    const MyNotes = require('./commands/my-note/myNotes')
    const Image = require('./commands/test/image')

    return {
      // My note
      mynote: new MyNote(this.client, myNoteModel),
      mynotes: new MyNotes(this.client, myNoteModel),
      // Notes
      note: new Note(this.client, noteModel),
      notes: new Notes(this.client, noteModel),
      all_notes: new AllNotes(this.client, noteModel),
      del_note: new DelNote(this.client, noteModel),
      get_notes_moderation: new GetNotesModeration(this.client, noteModel),
      // Altro
      say: new Say(this.client),
      poll: new Poll(this.client),
      hint: new Hint(this.client),
      coffee: new Coffee(this.client),
      ban: new Ban(this.client),
      kick: new Kick(this.client),
      embed: new Embed(this.client),
      fat_man: new Fatman(this.client),
      embed_example: new EmbedExample(this.client),
      help: new Help(this.client),
      ping: new Ping(this.client),
      code: new Code(this.client),
      demo: new Demo(this.client),
      eight_ball: new EightBall(this.client),
      opla: new Opla(this.client),
      eval: new Eval(this.client),
      update_role: new UpdateRole(this.client),
      event: new Event(this.client, eventsModel),
      image: new Image(this.client),
    }
  }

  async loadCore() {
    onError.init(this.client)
    onMessage.init(this.client, eventsModel)
    onReactionSteps.init(this.client, eventsModel)
    onClearNote.init(this.client)
    onGuildMemberAdd.init(this.client)
  }
}
