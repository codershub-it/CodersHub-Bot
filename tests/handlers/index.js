const channelsHandlers = require('./discord/channels')
const rolesHandlers = require('./discord/roles')
const guildsHandlers = require('./discord/guilds')

module.exports = [...channelsHandlers, ...rolesHandlers, ...guildsHandlers]
