module.exports = {
  '*.js': (files) => [
    `eslint --quiet --fix ${files.join(' ')}`,
    `prettier --write ${files.join(' ')}`,
    `jest --passWithNoTests`,
  ],
}
