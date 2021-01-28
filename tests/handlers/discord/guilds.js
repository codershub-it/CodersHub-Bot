const { rest } = require('msw')
const { SnowflakeUtil } = require('discord.js')

const handlers = [
  rest.post('*/api/:apiVersion/guilds/:guildId/emojis', (req, res, ctx) => {
    const emoji = {
      id: SnowflakeUtil.generate(),
      ...req.body,
    }
    return res(ctx.status(200), ctx.json(emoji))
  }),
]

module.exports = handlers
