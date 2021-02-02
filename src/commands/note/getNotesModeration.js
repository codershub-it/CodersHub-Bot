const Commands = require('../../core/command')
const numberToEmoji = require('../../core/utility/numberToEmoji')

module.exports = class GetNotesModeration extends Commands {
  constructor(client, note) {
    super(client)
    this.cmd = 'NotesMod'
    this.alias = 'notesmod'
    this.args = "[inserisci l'id della nota da attivare]"
    this.example = `${client.conf.prefix} 3057392487254763492347029`
    this.description =
      'Questo comando serve a gestire la moderazione delle note inserite dagli utenti del gruppo'
    this.timer = 0
    this.access = [
      client._botSettings.rules.Admin,
      client._botSettings.rules.Moderatore,
      client._botSettings.rules.Collaboratore,
    ]
    this.displayHelp = 1
    this.modelNote = note
  }

  async execution(message, bot) {
    // Abilito un id specifico
    if (message.args) {
      const noteID = message.args
      try {
        await this.modelNote.findByIdAndUpdate(noteID, { status: true })
        const embed = new bot._botMessageEmbed()
        embed.setDescription(`Abilitato con successo`)
        embed.setColor('RANDOM')
        message.reply(embed)
        message.delete()
      } catch (e) {
        const embed = new bot._botMessageEmbed()
        embed.setDescription(`Abilitazione non riuscita`)
        embed.setColor('RANDOM')
        message.reply(embed)
        message.delete()
      }
      return
    }
    // Mostro la lista
    let notes = []
    notes = await this.modelNote.find({}).where('status', false)
    // Se non trova nulla...
    if (notes.length == 0) {
      const embed = new bot._botMessageEmbed()
      embed.setDescription(`Non ci sono note da gestire.`)
      embed.setColor('RANDOM')
      message.reply(embed)
      message.delete()
      return
    }
    // Creo l'embeds
    const embeds = this.generateQueueEmbed(notes, bot)
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
  generateQueueEmbed(queue, client) {
    const embeds = []
    let k = 5
    for (let i = 0; i < queue.length; i += 5) {
      const current = queue.slice(i, k)
      let j = i
      k += 5
      const line = current
        .map(
          (track) =>
            `**${++j}** [Chan: <#${track.channel_id}>]
                        [Id: ${track._id}]
                        [Note: ${track.note}](${this.makeStringUrl(
              track.guild_id,
              track.channel_id,
              track.message_id,
            )})
                        ------`,
        )
        .join('\n')
      const embed = new client._botMessageEmbed()
        .setDescription(
          `**🗒 Elementi da verificare: ${numberToEmoji.toEmoji(queue.length)}**\n${line}`,
        )
        .setFooter('Premi il simbolo ❌ per eliminare questo messaggio')
        .setColor('RANDOM')
      embeds.push(embed)
    }
    return embeds
  }
}
