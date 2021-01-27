const { rest } = require('msw')
const DiscordManager = require('../../DiscordManager')

const handlers = [
  rest.put('*/api/:apiVersion/guilds/:guildId/members/:memberId/roles/:roleId', (req, res, ctx) => {
    const updateUser = {
      id: req.params.memberId,
    }
    const guild = DiscordManager.guilds[req.params.guildId]

    const user = Array.from(guild.members.cache.values()).find(
      (guildMember) => guildMember.user.id === req.params.memberId,
    )
    const assigneRole = Array.from(guild.roles.cache.values()).find(
      (role) => role.id === req.params.roleId,
    )
    user._roles.push(assigneRole.id)
    return res(ctx.status(200), ctx.json(updateUser))
  }),
]

module.exports = handlers
