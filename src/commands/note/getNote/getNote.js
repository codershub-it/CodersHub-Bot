// const Commands = require('../../../core/command')
//
// module.exports = class GetNote extends Commands {
//   constructor(client) {
//     super(client)
//     this.cmd = 'getNote'
//     this.alias = 'getnote'
//     this.args = '[id_nota (Opzionale)]'
//     this.example = `${client.conf.prefix}getNote 00000000000`
//     this.description =
//       'Questo comando mostra tutte le note presenti in un canale mostrando un lista dinamica.' +
//       'Indicando una id_nota aprirà il dettaglio di quella nota specifica'
//     this.timer = 0
//     this.access = [client._botSettings.rules.everyone]
//     this.displayHelp = 1
//   }
//
//   async execution(message, bot) {}
// }
