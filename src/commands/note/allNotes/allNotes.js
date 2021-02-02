const Commands = require('../../../core/command')
const numberToEmoji = require('../../../core/utility/numberToEmoji')

module.exports = class AllNotes extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'AllNotes'
    this.alias = 'allnotes'
    this.args = 'Puoi scrivere dopo lo spazio la chiave di ricerca'
    this.example = `${client.conf.prefix}allNotes Angular`
    this.description = 'Questo comando mostra tutte le note presenti mostrando lista dinamica.'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
    this.modelNote = note
  }

  async execution(message, bot) {
    let notes = []
    if (message.args) {
      // Estrae i dati con il motore di ricerca
      notes = await this.modelNote.find({
        $and: [{ note: new RegExp(message.args, 'i') }, { status: true }],
      })
      // Se non trova nulla...
      if (notes.length == 0) {
        const embed = new bot._botMessageEmbed()
        embed.setTitle('404')
        embed.setDescription(
          `Purtroppo non ho trovato nulla con la chiave di ricerca: ${message.args}`,
        )
        embed.setColor('RANDOM')
        message.reply(embed)
        message.delete()
        return
      }
    } else {
      notes = await this.modelNote.find({ status: true })
      // Se non trova nulla...
      if (notes.length == 0) {
        const embed = new bot._botMessageEmbed()
        embed.setDescription(`Purtroppo non ci sono note salvate`)
        embed.setColor('RANDOM')
        message.reply(embed)
        message.delete()
        return
      }
    }
    const embeds = this.generateQueueEmbed(notes, bot, message.args)
    await this.embedCompose(embeds, message, bot)
    await message.delete()
  }

  /**
   * Creo la lista dinamica degli elementi trovati
   * @param queue
   * @param client
   * @param args
   * @returns {[]}
   */
  generateQueueEmbed(queue, client, args) {
    const embeds = []
    let k = 10
    for (let i = 0; i < queue.length; i += 10) {
      const current = queue.slice(i, k)
      let j = i
      k += 10
      const line = current
        .map(
          (track) =>
            `**${++j}** [<#${track.channel_id}>] [${this.highlightValueInString(
              track.note,
              args,
            )}](${this.makeStringUrl(track.guild_id, track.channel_id, track.message_id)})`,
        )
        .join('\n')
      if (args) {
        const embed = new client._botMessageEmbed()
          .setDescription(
            `** 🗒 Lista Note trovate ${numberToEmoji.toEmoji(
              queue.length,
            )} elementi con chiave di ricerca: ${args}**\n${line} `,
          )
          .setFooter('Premi il simbolo ❌ per eliminare questo messaggio')
          .setColor('RANDOM')
        embeds.push(embed)
      } else {
        const embed = new client._botMessageEmbed()
          .setDescription(
            `** 🗒 Lista Note trovate ${numberToEmoji.toEmoji(queue.length)} elementi **\n${line}`,
          )
          .setFooter('Premi il simbolo ❌  per eliminare questo messaggio')
          .setColor('RANDOM')
        embeds.push(embed)
      }
    }
    return embeds
  }
}
