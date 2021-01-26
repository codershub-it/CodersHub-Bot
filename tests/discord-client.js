const Discord = require('discord.js')
const { SnowflakeUtil } = require('discord.js')
const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const settings = require('core/settings')
const DiscordManager = require('./DiscordManager')

async function createChannels(guild) {
  const generalChannel = await guild.channels.create('generale')
  guild.channels.cache.set(generalChannel.id, generalChannel)

  return {
    generalChannel,
  }
}

async function makeFakeClient() {
  const client = new Discord.Client()
  Object.assign(client, {
    token: process.env.DISCORD_BOT_TOKEN,
    user: new Discord.ClientUser(client, {
      id: SnowflakeUtil.generate(),
      bot: true,
      username: 'BOT',
    }),
    _botSettings: settings,
    _botFetch: fetch,
    _botMessageEmbed: MessageEmbed,
    conf: { prefix: '&' },
  })
  const guild = new Discord.Guild(client, {
    id: SnowflakeUtil.generate(),
    name: 'CodersHubBot',
  })

  // eslint-disable-next-line no-empty-function
  client.ws.shards.set('1', { ping: 100, destroy: () => {} })

  DiscordManager.guilds[guild.id] = guild
  client.guilds.cache.set(guild.id, guild)

  const defaultChannels = await createChannels(guild)

  DiscordManager.clients.push(client)

  return {
    client,
    guild,
    bot: client.user,
    defaultChannels,
  }
}

module.exports = {
  makeFakeClient,
  DiscordManager,
}
