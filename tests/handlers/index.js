const { rest } = require('msw')
const channelsHandlers = require('./discord/channels')
const rolesHandlers = require('./discord/roles')
const guildsHandlers = require('./discord/guilds')

module.exports = [
  ...channelsHandlers,
  ...rolesHandlers,
  ...guildsHandlers,
  rest.get('*/api/:apiVersion/gateway/bot', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        url: '',
        shards: 1,
        session_start_limit: {
          total: 1000,
          remaining: 999,
          reset_after: 14400000,
        },
      }),
    )
  }),
]
