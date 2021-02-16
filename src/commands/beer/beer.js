const Commands = require('../../core/command')

module.exports = class Beer extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'birra'
    this.alias = 'beer'
    this.args = "[@nomeutente (Opzionale)] Se vuoi offrire una buona birra ad un'altra persona"
    this.example = `${client.conf.prefix}birra @nomeutente`
    this.description = 'Ideala per bere una buona birra in compagnia o offerto dal bot 👊🏻'
    this.timer = 0
    this.access = []
    this.displayHelp = 1
    this.client = client
  }

  async execution(message) {
    const id_author = message.author.id
    if (message.mentions.members.first()) {
      const id_mention = message.mentions.members.first().id
      message.channel
        .send(
          `Ciao <@${id_mention}> sei fortunato, l'utente <@${id_author}> ti ha offerto una :beers:`,
        )
        .catch((e) => {
          console.log(e)
        })
    } else {
      message.channel.send(`Ciao <@${id_author}> eccoti una buona :beer:`).catch((e) => {
        console.log(e)
      })
    }
  }
}
