const { rest } = require('msw')
const { SnowflakeUtil } = require('discord.js')
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
    const mentions = Array.from(req.body.content.matchAll(/<@!(?<userId>\d+)>/g)).map(
      (mention) => members.find((user) => user.id === mention.groups.userId).user,
    )
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
]

module.exports = handlers
