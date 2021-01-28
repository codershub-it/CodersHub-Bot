const Commands = require('../../../core/command')
const numberToEmoji = require('../../../core/utility/numberToEmoji')

module.exports = class Notes extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'Notes'
    this.alias = 'notes'
    this.args = 'Puoi scrivere dopo lo spazio la chiave di ricerca'
    this.example = `${client.conf.prefix}Notes Angular`
    this.description =
      'Questo comando mostra tutte le note presenti in un canale mostrando un lista dinamica.'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
    this.modelNote = note
  }

  async execution(message, bot) {
    let notes = []
    if (message.args) {
      // Estrae i dati con il motore di recerca
      notes = await this.modelNote.find({
        $and: [
          { note: new RegExp(message.args, 'i') },
          { status: true },
          { channel_id: message.channel.id },
        ],
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
        return
      }
    } else {
      notes = await this.modelNote.find({
        $and: [{ status: true }, { channel_id: message.channel.id }],
      })
      // Se non trova nulla...
      if (notes.length == 0) {
        const embed = new bot._botMessageEmbed()
        embed.setDescription(`Purtroppo non ci sono note salvate`)
        embed.setColor('RANDOM')
        message.reply(embed)
        return
      }
    }

    // Creo l'embeds
    const embeds = this.generateQueueEmbed(notes, bot, message.args)
    let currentPage = 0
    const queueEmbed = await message.channel.send(
      `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
      embeds[currentPage],
    )
    // Aggiungo le reazioni
    await queueEmbed.react('⬅️')
    await queueEmbed.react('➡️')
    await queueEmbed.react('❌')
    // Creo il sistema di filtraggio in base alla reaction
    const filter = (reaction, user) =>
      ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && message.author.id === user.id
    const collector = queueEmbed.createReactionCollector(filter)
    // Avvio il collect di eventi
    collector.on('collect', async (reaction, user) => {
      // In base al tipo di reazione effettuo un processo di cambio pagina.
      if (reaction.emoji.name === '➡️') {
        if (currentPage < embeds.length - 1) {
          currentPage++
          await queueEmbed.edit(
            `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
            embeds[currentPage],
          )
          await reaction.users.remove(user.id)
        }
        await reaction.users.remove(user.id)
      } else if (reaction.emoji.name === '⬅️') {
        if (currentPage !== 0) {
          --currentPage
          await queueEmbed.edit(
            `Pagina corrente: ${currentPage + 1}/${embeds.length}`,
            embeds[currentPage],
          )
          await reaction.users.remove(user.id)
        }
        await reaction.users.remove(user.id)
      } else {
        collector.stop()
        await queueEmbed.delete()
        await message.delete()
      }
    })
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
            `**${++j}** - [${this.highlightValueInString(track.note, args)}](${this.makeStringUrl(
              track.guild_id,
              track.channel_id,
              track.message_id,
            )})`,
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
