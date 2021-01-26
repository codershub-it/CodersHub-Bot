const jestConfig = {
  roots: ['src'],
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules', 'src', 'tests'],
  collectCoverageFrom: ['src/**/*.+(js)'],
  testMatch: ['**/__tests__/**/*.+(js)'],
  setupFilesAfterEnv: ['./tests/setup-env.js'],
  preset: '@shelf/jest-mongodb',
}

module.exports = jestConfig
