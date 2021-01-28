const { rest } = require('msw')
const { SnowflakeUtil, Util } = require('discord.js')
const DiscordManager = require('../../DiscordManager')

const handlers = [
  rest.post('*/api/:apiVersion/guilds/:guild/channels', (req, res, ctx) => {
    const createdChannel = {
      id: SnowflakeUtil.generate(),
      guild_id: req.params.guild,
      ...req.body,
    }
    DiscordManager.channels[createdChannel.id] = {
      ...createdChannel,
    }

    return res(ctx.status(200), ctx.json(createdChannel))
  }),
  rest.post('*/api/:apiVersion/channels/:channelId/messages', (req, res, ctx) => {
    const channel = DiscordManager.channels[req.params.channelId]
    const guild = DiscordManager.guilds[channel.guild_id]
    const members = Array.from(guild.members.cache.values())
    let mentions = []
    if ('embed' in req.body) {
      mentions = Array.from(req.body.embed.description.matchAll(/<@!(?<userId>\d+)>/g)).map(
        (mention) => members.find((user) => user.id === mention.groups.userId).user,
      )
    } else {
      mentions = Array.from(req.body.content.matchAll(/<@!(?<userId>\d+)>/g)).map(
        (mention) => members.find((user) => user.id === mention.groups.userId).user,
      )
    }
    const message = {
      id: SnowflakeUtil.generate(),
      channel_id: channel.id,
      guild_id: channel.guild_id,
      timestamp: new Date().toISOString(),
      author: guild.client.user,
      mentions,
      ...req.body,
    }
    return res(ctx.status(200), ctx.json(message))
  }),
  rest.patch('*/api/:apiVersion/channels/:channelId/messages/:messageId', (req, res, ctx) => {
    const channel = DiscordManager.channels[req.params.channelId]
    const editedMessage = {
      ...req.body,
      id: req.params.messageId,
      channel_id: req.params.channelId,
    }
    DiscordManager.guilds[channel.guild_id].client.actions.MessageUpdate.handle(editedMessage)

    return res(ctx.status(200), ctx.json(editedMessage))
  }),
  rest.delete('*/api/:apiVersion/channels/:channelId/messages/:messageId', (req, res, ctx) => {
    const channel = DiscordManager.channels[req.params.channelId]
    const deletedMessage = {
      id: req.params.messageId,
      channel_id: req.params.channelId,
    }
    DiscordManager.guilds[channel.guild_id].client.actions.MessageDelete.handle(deletedMessage)
    return res(ctx.status(200), ctx.json(deletedMessage))
  }),
  rest.put(
    `*/api/:apiVersion/channels/:channelId/messages/:messageId/reactions/:reaction/@me`,
    (req, res, ctx) => {
      const cachedChannel = DiscordManager.channels[req.params.channelId]

      const discordChannel = Array.from(
        DiscordManager.guilds[cachedChannel.guild_id].channels.cache.values(),
      ).find((channel) => channel.id === cachedChannel.id)

      const messageToUpdate = Array.from(discordChannel.messages.cache.values()).find(
        (message) => message.id === req.params.messageId,
      )
      const { name } = Util.parseEmoji(req.params.reaction)
      const emoji = Array.from(
        DiscordManager.guilds[cachedChannel.guild_id].emojis.cache.values(),
      ).find((guildEmoji) => guildEmoji.name === name)
      let count = 1
      if (messageToUpdate.reactions.cache.has(emoji.id)) {
        count = messageToUpdate.reactions.cache.get(emoji.id).count
      }
      messageToUpdate.reactions.cache.set(emoji.id, {
        count,
        emoji,
      })
      return res(ctx.status(204), ctx.json({}))
    },
  ),
]

module.exports = handlers
