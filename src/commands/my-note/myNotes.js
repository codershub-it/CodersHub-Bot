const Commands = require('../../core/command')
const numberToEmoji = require('../../core/utility/numberToEmoji')

module.exports = class MyNotes extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'myNotes'
    this.alias = 'mynotes'
    this.args = 'Puoi scrivere dopo lo spazio la chiave di ricerca'
    this.example = `${client.conf.prefix}mynotes Angular`
    this.description =
      'Questo comando mostra tutte le note personali presenti mostrando lista dinamica.'
    this.timer = 0
    this.access = []
    this.displayHelp = 1
    this.myNoteModel = note
    this.client = client
  }

  async execution(message) {
    let notes = []
    if (message.args) {
      // Estrae i dati con il motore di ricerca
      notes = await this.myNoteModel.find({
        $and: [{ note: new RegExp(message.args, 'i') }, { author_id: message.author.id }],
      })
      // Se non trova nulla...
      if (notes.length == 0) {
        message
          .reply(`Purtroppo non ho trovato nulla con la chiave di ricerca: ${message.args}`)
          .then((m) => m.delete({ timeout: 10000 }))
        message.delete()
        return
      }
    } else {
      notes = await this.myNoteModel.find({ author_id: message.author.id })
      // Se non trova nulla...
      if (notes.length == 0) {
        message
          .reply('Purtroppo non ci sono tue note salvate')
          .then((m) => m.delete({ timeout: 10000 }))
        message.delete()
        return
      }
    }
    const embeds = this.generateQueueEmbed(notes, this.client, message.args)
    await this.personalEmbedCompose(embeds, message, this.client)
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
            `** 🗒 La tua lista note, trovati ${numberToEmoji.toEmoji(
              queue.length,
            )} elementi con chiave di ricerca: ${args}**\n${line} `,
          )
          .setFooter('Premi il simbolo ❌ per eliminare questo messaggio')
          .setColor('RANDOM')
        embeds.push(embed)
      } else {
        const embed = new client._botMessageEmbed()
          .setDescription(
            `** 🗒 La tua lista note, ${numberToEmoji.toEmoji(queue.length)} elementi **\n${line}`,
          )
          .setFooter('Premi il simbolo ❌  per eliminare questo messaggio')
          .setColor('RANDOM')
        embeds.push(embed)
      }
    }
    return embeds
  }
}
