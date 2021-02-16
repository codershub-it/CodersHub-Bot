const Discord = require('discord.js')
const { makeFakeClient } = require('discord-client')
const { waitUntil } = require('utils')

async function setup() {
  const { client, js, defaultChannels, createUser } = await makeFakeClient()

  const getGeneralChannelMessages = () =>
    Array.from(defaultChannels.generalChannel.messages.cache.values())

  return {
    client,
    js,
    defaultChannels,
    getGeneralChannelMessages,
    createUser,
  }
}

test('should send a coffee message if not present user tag', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()

  const message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}birra`,
      author: js.user,
    },
    defaultChannels.generalChannel,
  )

  client.emit('message', message)

  await waitUntil(() => {
    const messages = getGeneralChannelMessages()
    expect(messages).toHaveLength(1)
  })

  const messages = getGeneralChannelMessages()
  expect(messages).toHaveLength(1)
  expect(messages[0].content).toEqual(`Ciao <@${js.user.id}> eccoti una buona :beer:`)
})

test('should send a coffee message if is present user tag', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages, createUser } = await setup()

  const message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}birra`,
      author: js.user,
    },
    defaultChannels.generalChannel,
  )

  const mentionedUsers = (await Promise.all([createUser('test_1')])).map(
    (guildMember) => guildMember.user,
  )

  // Creo un mention
  Object.assign(message, {
    mentions: new Discord.MessageMentions(message, mentionedUsers, [], false),
  })

  client.emit('message', message)

  await waitUntil(() => {
    const messages = getGeneralChannelMessages()
    expect(messages).toHaveLength(1)
  })

  const messages = getGeneralChannelMessages()
  expect(messages).toHaveLength(1)
  expect(messages[0].content).toEqual(
    `Ciao <@${mentionedUsers[0].id}> sei fortunato, l'utente <@${js.user.id}> ti ha offerto una :beers:`,
  )
})
