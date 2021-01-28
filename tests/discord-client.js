const Discord = require('discord.js')
const { SnowflakeUtil } = require('discord.js')
const DiscordManager = require('./DiscordManager')
const Bot = require('index')
const settings = require('core/settings')
const mongo = require('core/mongo')

async function createChannels(guild) {
  const generalChannel = await guild.channels.create('generale')
  guild.channels.cache.set(generalChannel.id, generalChannel)

  return {
    generalChannel,
  }
}

async function createEmojis(guild) {
  const emojies = ['👍', '👎']

  const guildEmojis = {}
  for (const emoji of emojies) {
    guildEmojis[emoji] = await guild.emojis.create(Buffer.from(emoji), emoji)
  }
  return guildEmojis
}

function createRoles(client, guild) {
  const roles = {}

  for (const [key, name] of Object.entries(settings.rules)) {
    roles[key] = new Discord.Role(
      client,
      { id: key === 'everyone' ? guild.id : SnowflakeUtil.generate(), name: name },
      guild,
    )
    guild.roles.cache.set(roles[key].id, roles[key])
  }

  return roles
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
  })
  new Bot(client, mongo)

  const guild = new Discord.Guild(client, {
    id: SnowflakeUtil.generate(),
    name: 'CodersHubBot',
  })

  // eslint-disable-next-line no-empty-function
  client.ws.shards.set('1', { ping: 100, destroy: () => {} })

  DiscordManager.guilds[guild.id] = guild
  client.guilds.cache.set(guild.id, guild)

  const defaultChannels = await createChannels(guild)
  const { everyone } = createRoles(client, guild)
  await createEmojis(guild)

  async function createUser(username, options = {}) {
    const newUser = new Discord.GuildMember(client, { nick: username }, guild)
    newUser.user = new Discord.User(client, {
      id: SnowflakeUtil.generate(),
      username,
      discriminator: client.users.cache.size,
      ...options,
    })
    guild.members.cache.set(newUser.id, newUser)
    await newUser.roles.add(everyone)
    return newUser
  }

  const jsUser = await createUser('js')

  DiscordManager.clients.push(client)
  return {
    client,
    guild,
    bot: client.user,
    js: jsUser,
    defaultChannels,
  }
}

module.exports = {
  makeFakeClient,
  DiscordManager,
}
