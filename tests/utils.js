const timers = require('timers')

function getJestFakeTimersType() {
  if (typeof setTimeout.clock !== 'undefined' && typeof jest.getRealSystemTime !== 'undefined') {
    try {
      // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
      jest.getRealSystemTime()
      return 'modern'
    } catch {
      // not using Jest's modern fake timers
    }
  }
  return null
}

const jestFakeTimersAreEnabled = () => Boolean(getJestFakeTimersType())

async function waitUntil(expectation, { timeout = 3000, interval = 1000 } = {}) {
  if (interval < 1) interval = 1
  const maxTries = Math.ceil(timeout / interval)
  let tries = 0
  const usingFakeTimers = jestFakeTimersAreEnabled()
  if (usingFakeTimers) {
    while (tries < maxTries) {
      tries += 1
      jest.advanceTimersByTime(interval)
      try {
        expectation()
        return Promise.resolve()
      } catch (e) {
        if (tries > maxTries) {
          return Promise.reject(e)
        }
      } finally {
        await new Promise((r) => timers.setImmediate(r))
      }
    }
  } else {
    return new Promise((resolve, reject) => {
      const rejectOrRerun = (error) => {
        if (tries > maxTries) {
          reject(error)
          return
        }
        setTimeout(runExpectation, interval)
      }
      function runExpectation() {
        tries += 1
        try {
          Promise.resolve(expectation())
            .then(() => resolve())
            .catch(rejectOrRerun)
        } catch (error) {
          rejectOrRerun(error)
        }
      }
      setTimeout(runExpectation, 0)
    })
  }
}

module.exports = {
  waitUntil,
}
