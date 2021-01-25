const Commands = require('../../../core/command')

module.exports = class TestList extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'test_list'
    this.alias = 't_list'
    this.args = ''
    this.example = ''
    this.description = 'Esempio di gestione multi pagina'
    this.timer = 0
    this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
    this.displayHelp = 0
    // Esempio lista
    this.exemplce_element = [
      { url: 'www.exemple.com', name: 'Tino Cino1' },
      { url: 'www.exemple.com', name: 'Tino Cino2' },
      { url: 'www.exemple.com', name: 'Tino Cino3' },
      { url: 'www.exemple.com', name: 'Tino Cino4' },
      { url: 'www.exemple.com', name: 'Tino Cino5' },
      { url: 'www.exemple.com', name: 'Tino Cino6' },
      { url: 'www.exemple.com', name: 'Tino Cino7' },
      { url: 'www.exemple.com', name: 'Tino Cino8' },
      { url: 'www.exemple.com', name: 'Tino Cino9' },
      { url: 'www.exemple.com', name: 'Tino Cino10' },
      { url: 'www.exemple.com', name: 'Tino Cino11' },
      { url: 'www.exemple.com', name: 'Tino Cino12' },
      { url: 'www.exemple.com', name: 'Tino Cino13' },
      { url: 'www.exemple.com', name: 'Tino Cino14' },
      { url: 'www.exemple.com', name: 'Tino Cino15' },
      { url: 'www.exemple.com', name: 'Tino Cino16' },
      { url: 'www.exemple.com', name: 'Tino Cino17' },
      { url: 'www.exemple.com', name: 'Tino Cino19' },
      { url: 'www.exemple.com', name: 'Tino Cino20' },
      { url: 'www.exemple.com', name: 'Tino Cino21' },
      { url: 'www.exemple.com', name: 'Tino Cino22' },
      { url: 'www.exemple.com', name: 'Tino Cino23' },
      { url: 'www.exemple.com', name: 'Tino Cino24' },
      { url: 'www.exemple.com', name: 'Tino Cino25' },
    ]
  }

  async execution(message, bot) {
    let currentPage = 0
    const embeds = this.generateQueueEmbed(this.exemplce_element, bot)
    const queueEmbed = await message.channel.send(
      `Current Page: ${currentPage + 1}/${embeds.length}`,
      embeds[currentPage],
    )
    await queueEmbed.react('⬅️')
    await queueEmbed.react('➡️')
    await queueEmbed.react('❌')

    const filter = (reaction, user) =>
      ['⬅️', '➡️', '❌'].includes(reaction.emoji.name) && message.author.id === user.id
    const collector = queueEmbed.createReactionCollector(filter)

    collector.on('collect', async (reaction, user) => {
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

  generateQueueEmbed(queue, client) {
    const embeds = []
    let k = 10
    for (let i = 0; i < queue.length; i += 10) {
      const current = queue.slice(i, k)
      let j = i
      k += 10
      const info = current
        .map(
          (track) =>
            `${++j} - "this supports [named links](https://discordapp.com) on top of the previously shown subset of markdown.  [${
              track.name
            }][${track.url}]`,
        )
        .join('\n')
      const embed = new client._botMessageEmbed().setDescription(
        `**[current info: ${queue[0].name}]**\n${info}`,
      )
      embeds.push(embed)
    }
    return embeds
  }
}
