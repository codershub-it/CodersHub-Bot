const Discord = require('discord.js')
const { makeFakeClient } = require('discord-client')
const Ping = require('commands/utility/ping/ping')

async function setup() {
  const { client, bot, defaultChannels } = await makeFakeClient()

  const ping = new Ping(client)

  const getGeneralChannelMessages = () =>
    Array.from(defaultChannels.generalChannel.messages.cache.values())

  return {
    client,
    ping,
    bot,
    defaultChannels,
    getGeneralChannelMessages,
  }
}
describe('Test Ping Command', () => {
  it('should send a ping/pong message', async () => {
    jest.useFakeTimers('modern')
    const { ping, client, bot, defaultChannels, getGeneralChannelMessages } = await setup()

    const message = new Discord.Message(
      client,
      { id: Discord.SnowflakeUtil.generate(), content: `${process.env.PREFIX}ping`, author: bot },
      defaultChannels.generalChannel,
    )
    jest.advanceTimersByTime(1000 * 60 * 5)
    const startTimestamp = message.createdTimestamp
    const endTimestamp = startTimestamp + 1000 * 60 * 5

    await ping.execution(message, client)

    const messages = getGeneralChannelMessages()
    expect(messages).toHaveLength(1)
    expect(messages[0].content).toEqual(
      `Pong! 🏓 Latenza server ${endTimestamp - startTimestamp}ms. Latenza API 100ms`,
    )
  })
})
