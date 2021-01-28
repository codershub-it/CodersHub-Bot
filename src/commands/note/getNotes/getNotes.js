const Commands = require('../../../core/command')
const numberToEmoji = require('../../../core/utility/numberToEmoji')

module.exports = class GetNotes extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'getNotes'
    this.alias = 'getnotes'
    this.args = 'Puoi scrivere dopo lo spazio la chiave di ricerca'
    this.example = `${client.conf.prefix}getNotes Angular`
    this.description =
      'Questo comando mostra tutte le note presenti in un canale mostrando un lista dinamica.' +
      'Indicando una id_nota aprirà il dettaglio di quella nota specifica'
    this.timer = 0
    this.access = [client._botSettings.rules.everyone]
    this.displayHelp = 1
    this.modelNote = require('../../../core/model/note')
  }

  async execution(message, bot) {
    const access = [
      bot._botSettings.rules.Admin,
      bot._botSettings.rules.Moderatore,
      bot._botSettings.rules.Collaboratore,
    ]
    // Verifico se l'utente è un amministratore
    const user_admin = message.member.roles.cache.some((itm) => access.includes(itm.name))

    let notes = []
    if (message.args) {
      // Estrae i dati con il motore di recerca
      if (user_admin) {
        notes = await this.modelNote.find({ note: new RegExp(message.args, 'i') })
      } else {
        notes = await this.modelNote
          .find({ note: new RegExp(message.args, 'i') })
          .where('status', true)
      }
    } else if (user_admin) {
      notes = await this.modelNote.find({})
    } else {
      notes = await this.modelNote.find({}).where('status', true)
    }
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
    // Creo l'embeds
    const embeds = this.generateQueueEmbed(notes, bot, message.args, user_admin)
    let currentPage = 0
    const queueEmbed = await message.channel.send(
      `Current Page: ${currentPage + 1}/${embeds.length}`,
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
            `Current Page: ${currentPage + 1}/${embeds.length}`,
            embeds[currentPage],
          )
          await reaction.users.remove(user.id)
        }
        await reaction.users.remove(user.id)
      } else if (reaction.emoji.name === '⬅️') {
        if (currentPage !== 0) {
          --currentPage
          await queueEmbed.edit(
            `Current Page: ${currentPage + 1}/${embeds.length}`,
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
  generateQueueEmbed(queue, client, args, user_admin) {
    const embeds = []
    let k = 10
    for (let i = 0; i < queue.length; i += 10) {
      const current = queue.slice(i, k)
      let j = i
      k += 10
      const line = current
        .map(
          (track) =>
            `**${++j}** ${user_admin ? (track.status ? '[ 🟢 ]' : '[ 🔴 ]') : ''}[<#${
              track.channel_id
            }>]${user_admin ? '[ ' + track._id + ' ]\n' : ''}[${this.highlightValueInString(
              track.note,
              args,
            )}](${this.makeStringUrl(track.guild_id, track.channel_id, track.message_id)})`,
        )
        .join('\n')
      if (args) {
        const embed = new client._botMessageEmbed()
          .setDescription(
            `** 🗒 Lista Note 🗒 ${numberToEmoji.toEmoji(
              queue.length,
            )} Elementi - Chiave di ricerca: ${args}**\n${line} `,
          )
          .setFooter('Premi il simbolo ❌ per eliminare questo messaggio')
          .setColor('RANDOM')
        embeds.push(embed)
      } else {
        const embed = new client._botMessageEmbed()
          .setDescription(
            `** 🗒 Lista Note 🗒 ${numberToEmoji.toEmoji(queue.length)} Elementi **\n${line}`,
          )
          .setFooter('Premi il simbolo ❌  per eliminare questo messaggio')
          .setColor('RANDOM')
        embeds.push(embed)
      }
    }
    return embeds
  }
}
