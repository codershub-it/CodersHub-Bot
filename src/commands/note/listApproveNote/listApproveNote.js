// const Commands = require('../../../core/command')
//
// module.exports = class ListApproveNote extends Commands {
//   constructor(client) {
//     super(client)
//     this.cmd = 'approveNote'
//     this.alias = 'approvenote'
//     this.args = '[id_nota (Opzionale)]'
//     this.example = `${client.conf.prefix}approveNote 00000000000`
//     this.description =
//       'Questo comando serve ad approvare le note inserite dagli utenti. Se non viene inserito' +
//       'nessun id_nota mostrerà un lista con tutte le note da approvare'
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
