const Discord = require('discord.js')
const { makeFakeClient } = require('discord-client')
const { waitUntil } = require('utils')

async function setup() {
  const { client, defaultChannels, js } = await makeFakeClient()

  const getGeneralChannelMessages = () =>
    Array.from(defaultChannels.generalChannel.messages.cache.values())

  return {
    client,
    defaultChannels,
    getGeneralChannelMessages,
    js,
  }
}

it('should start pool', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()

  const message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}poll "Do you like programming with javascript?"`,
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
  expect(messages[0].embeds).toHaveLength(1)

  expect(messages[0].embeds[0].description).toEqual(
    `
-- **Domanda proposta da <@${js.user.id}>** --
Do you like programming with javascript?
`.trim(),
  )

  const reactions = Array.from(messages[0].reactions.cache.values())
  expect(reactions).toHaveLength(2)
  expect(reactions[0].emoji.name).toEqual('👍')
  expect(reactions[1].emoji.name).toEqual('👎')
})

it('should give an error if the command is called with an empty string', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()

  const message = new Discord.Message(
    client,
    { id: Discord.SnowflakeUtil.generate(), content: `${process.env.PREFIX}poll`, author: js.user },
    defaultChannels.generalChannel,
  )

  client.emit('message', message)

  await waitUntil(() => {
    const messages = getGeneralChannelMessages()
    expect(messages).toHaveLength(1)
  })

  expect(getGeneralChannelMessages()[0].content).toEqual(
    `
<@!${js.user.id}>, devi scrivere almeno una domanda e delle risposte tra doppie virgolette  
`.trim(),
  )
})

it('should give an error if the question is less than 20 characters', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()

  const message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}poll "what's your name?"`,
      author: js.user,
    },
    defaultChannels.generalChannel,
  )

  client.emit('message', message)

  await waitUntil(() => {
    const messages = getGeneralChannelMessages()
    expect(messages).toHaveLength(1)
  })

  expect(getGeneralChannelMessages()[0].content).toEqual(
    `
<@!${js.user.id}>, devi scrivere almeno una domanda da 20 caratteri  
`.trim(),
  )
})
