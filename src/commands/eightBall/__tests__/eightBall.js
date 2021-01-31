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

it('should give an error if the string is empty or is not a question', async () => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()

  let message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}pallaotto`,
      author: js.user,
    },
    defaultChannels.generalChannel,
  )
  client.emit('message', message)

  await waitUntil(() => {
    expect(getGeneralChannelMessages()).toHaveLength(1)
  })

  let messages = getGeneralChannelMessages()

  expect(messages[0].content).toEqual(`<@!${js.user.id}>, devi scrivere almeno una domanda`)

  message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}pallaotto testo senza domanda`,
      author: js.user,
    },
    defaultChannels.generalChannel,
  )

  client.emit('message', message)

  await waitUntil(() => {
    expect(getGeneralChannelMessages()).toHaveLength(1)
  })

  messages = getGeneralChannelMessages()

  expect(messages[0].content).toEqual(`<@!${js.user.id}>, devi scrivere almeno una domanda`)
})

it.each([
  ['Per quanto posso vedere, sì', 1],
  ['È certo', 2],
  ['È decisamente così', 3],
  ['Molto probabilmente', 4],
  ['Le prospettive sono buone', 5],
  ['Le mie fonti indicano di sì', 6],
  ['Senza alcun dubbio', 7],
  ['Sì', 8],
  ['Sì, senza dubbio', 9],
  ['Ci puoi contare', 10],
  ['È difficile rispondere, prova di nuovo', 11],
  ['Rifai la domanda più tardi', 12],
  ['Meglio non risponderti adesso', 13],
  ['Non posso predirlo ora', 14],
  ['Concentrati e rifai la domanda', 15],
  ['Non ci contare', 16],
  ['La mia risposta è no', 17],
  ['Le mie fonti dicono di no', 18],
  ['Le prospettive non sono buone', 19],
  ['Molto incerto', 20],
  ['Mi puoi rifare la domanda, non ho capito..', 21],
])('should answer with %s', async (text, index) => {
  const { client, js, defaultChannels, getGeneralChannelMessages } = await setup()
  const message = new Discord.Message(
    client,
    {
      id: Discord.SnowflakeUtil.generate(),
      content: `${process.env.PREFIX}pallaotto my next commit will not break the code?`,
      author: js.user,
    },
    defaultChannels.generalChannel,
  )

  jest.spyOn(Math, 'random').mockImplementationOnce(() => (index - 1) / 20)

  client.emit('message', message)

  await waitUntil(() => {
    expect(getGeneralChannelMessages()).toHaveLength(1)
  })

  const messages = getGeneralChannelMessages()
  expect(messages[0].embeds).toHaveLength(1)
  expect(messages[0].embeds[0]).toMatchObject({
    description: text,
    title: '🎱 La palla dice...',
    type: 'rich',
  })
})
