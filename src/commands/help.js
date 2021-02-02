const Commands = require('../core/command')
module.exports = class Help extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'help'
    this.alias = 'h'
    this.args = `${client.conf.prefix}help embed`
    this.example = `${client.conf.prefix}help o ${client.conf.prefix}help [nome del comando]`
    this.description =
      'Usa questo comando da solo per avere la lista tutti i comandi. Aggiungendo il nome del comando hai la descrizione dettagliata'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
  }

  async execution(message, bot) {
    const queue = []
    let nomeComando = message.args
    // Estrapolo il prefix dal nome del comando se presente.
    nomeComando = nomeComando.replace(`${bot.conf.prefix}`, '')
    // Estrapola tutti i comandi disponibili
    const commands = bot._botCommands
    if (!nomeComando) {
      Object.entries(commands).filter(([, fn]) => {
        if (fn.displayHelp === 1) {
          if (message.member.roles.cache.some((itm) => fn.access.includes(itm.name))) {
            if (fn.cmd !== 'help') {
              queue.push({
                cmd: bot.conf.prefix + fn.cmd,
                description: fn.description,
              })
            }
          }
        }
      })
      // Prepara la lista
      const embeds = this.generateQueueEmbed(queue, bot, commands)
      // Creo embed
      await this.embedCompose(embeds, message, bot)
      await message.delete()
    } else {
      let msg = ''
      Object.entries(commands).filter(([, fn]) => {
        if (fn.displayHelp == 1 && (fn.cmd == nomeComando || fn.alias == nomeComando)) {
          if (message.member.roles.cache.some((itm) => fn.access.includes(itm.name))) {
            msg += `\nComando: **${bot.conf.prefix}${fn.cmd}**\nAlias: **${bot.conf.prefix}${fn.alias}**\n`
            if (fn.args) {
              msg += `\n**Parametri aggiuntivi: **\n${fn.args}\n`
            }
            if (fn.description) {
              msg += `\n**Descrizione: **\n${fn.description}\n`
            }
            if (fn.example) {
              msg += `\n**Esempio: **\n${fn.example}\n`
            }
          }
        }
      })
      const emb = new bot._botMessageEmbed()
      if (msg.length == 0) {
        emb.setDescription(
          `Purtroppo questo comando non esiste.\nUsa **${bot.conf.prefix}help** per vedere tutti i miei comandi :kissing_heart: `,
        )
      }
      emb.setTitle('Bot ufficiale di CodersHub')
      if (msg.length > 0) {
        emb.setDescription(msg)
      } else {
        emb.setDescription(
          `Purtroppo questo comando non esiste.\nUsa **${bot.conf.prefix}help** per vedere tutti i miei comandi :kissing_heart: `,
        )
      }
      emb.setColor('RANDOM')
      emb.setThumbnail('https://media1.tenor.com/images/0edd53dd2110147b786329c2e24fb1d0/tenor.gif')
      emb.setFooter(
        `Se hai delle idee o hai un suggerimento per migliorare il gruppo o il bot, invia la tua proposta con il comando ${bot.conf.prefix}proposta`,
      )
      await this.embedCompose([emb], message, bot)
      await message.delete()
    }
  }

  /**
   * Creo la lista dinamica degli elementi trovati
   * @param queue
   * @param client
   * @param args
   * @returns {[]}
   */
  generateQueueEmbed(queue, client, commands) {
    const embeds = []
    let k = 5
    for (let i = 0; i < queue.length; i += 5) {
      const current = queue.slice(i, k)
      k += 5
      const line = current
        .map(
          (track) =>
            '**' +
            track.cmd +
            '** -> Descrizione: ' +
            this.truncateString(track.description, 100) +
            '',
        )
        .join('\n')
      const embed = new client._botMessageEmbed()
        .setDescription(
          `** 🗒 I comandi disponibili**\n**${client.conf.prefix}${commands['help'].cmd} [scrivi il nome del comando]**\n-------\n${commands['help'].description}\n-------\n${line}\n-------\n`,
        )
        .setThumbnail('https://media1.tenor.com/images/0edd53dd2110147b786329c2e24fb1d0/tenor.gif')
        .setFooter(
          `Premi il simbolo ❌ per eliminare questo messaggio, in caso di inattività si eliminerà dopo 30s. Se hai delle idee o hai un suggerimento per migliorare il gruppo o il bot, invia la tua proposta con il comando ${client.conf.prefix}proposta.`,
        )
        .setColor('RANDOM')
      embeds.push(embed)
    }
    return embeds
  }
}
