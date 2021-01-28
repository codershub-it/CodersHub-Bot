const Commands = require('../../core/command')

module.exports = class Karma extends Commands {
  constructor(client, karma) {
    super(client)
    this.cmd = 'karma'
    this.alias = 'ka'
    this.args = ''
    this.example = `${client.conf.prefix}caffè @nomeutente`
    this.description =
      'Mostra quanto karma gli utenti hanno dato alla tua risposte, si aggiunge un punto karma con una stella ⭐️'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
    this.karma = karma
  }

  async eventAddReaction(reaction, user) {
    console.log(reaction)
    console.log(user)
  }

  async execution(message) {
    const id_author = message.author.id
    if (message.mentions.members.first()) {
      const id_mention = message.mentions.members.first().id
      message.channel
        .send(
          `Ciao <@${id_mention}> sei fortunato, l'utente <@${id_author}> ti ha offerto un :coffee:`,
        )
        .catch((e) => {
          console.log(e)
        })
    } else {
      message.channel.send(`Ciao <@${id_author}> eccoti un buon :coffee:`).catch((e) => {
        console.log(e)
      })
    }
  }
}
