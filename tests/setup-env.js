const DiscordManager = require('./DiscordManager')
const server = require('./server')

process.env.DISCORD_BOT_TOKEN = 'FAKE_BOT_TOKEN'
process.env.PREFIX = '$'

beforeEach(() => {
  server.listen({
    onUnhandledRequest: 'error',
  })
})

afterEach(() => {
  server.resetHandlers()
  DiscordManager.cleanup()
  jest.restoreAllMocks()
  if (jest.isMockFunction(setTimeout)) {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  }
})

afterAll(() => server.close())
