const Discord = require('discord.js')
const { makeFakeClient } = require('discord-client')
const { waitUntil } = require('utils')

async function setup() {
  const { client, js, defaultChannels } = await makeFakeClient()

  const getGeneralChannelMessages = () =>
    Array.from(defaultChannels.generalChannel.messages.cache.values())

  return {
    client,
    js,
    defaultChannels,
    getGeneralChannelMessages,
  }
}

test('should send a ping/pong message', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()

  const message = new Discord.Message(
    client,
    { id: Discord.SnowflakeUtil.generate(), content: `${process.env.PREFIX}ping`, author: js.user },
    defaultChannels.generalChannel,
  )

  client.emit('message', message)

  await waitUntil(() => {
    const messages = getGeneralChannelMessages()
    expect(messages).toHaveLength(1)
  })

  const messages = getGeneralChannelMessages()
  expect(messages).toHaveLength(1)
  expect(messages[0].content).toMatch(/^Pong! 🏓 Latenza server \d+ms. Latenza API 100ms$/)
})
