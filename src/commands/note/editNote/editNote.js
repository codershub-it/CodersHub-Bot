// const Commands = require('../../../core/command')
//
// module.exports = class EditNote extends Commands {
//   constructor(client) {
//     super(client)
//     this.cmd = 'editNote'
//     this.alias = 'editnote'
//     this.args = '[id_nota] [nuova memo]'
//     this.example = `${client.conf.prefix}editNote 00000000000 Questa è una nuova nota che sovrascrive la vecchia`
//     this.description = 'Questo comando serve a sovrascrivere la nota con un testo nuovo'
//     this.timer = 0
//     this.access = [
//       client._botSettings.rules.Admin,
//       client._botSettings.rules.Moderatore,
//       client._botSettings.rules.Collaboratore,
//     ]
//     this.displayHelp = 1
//   }
//
//   async execution(message, bot) {}
// }
