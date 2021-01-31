const DiscordManager = require('./DiscordManager')
const server = require('./server')
const mongo = require('core/mongo')

process.env.DISCORD_BOT_TOKEN = 'FAKE_BOT_TOKEN'
process.env.PREFIX = '$'
process.env.DEBUG_PREFIX = 'CodersHubTest'

beforeAll(async () => await mongo.init())

beforeEach(async () => {
  server.listen({
    onUnhandledRequest: 'error',
  })
})

afterEach(async () => {
  await mongo.removeAllCollections()
  server.resetHandlers()
  DiscordManager.cleanup()
  jest.restoreAllMocks()
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  }
})

afterAll(async () => {
  server.close()
  await mongo.disconnect()
})
