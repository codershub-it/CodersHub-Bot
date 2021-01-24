module.exports = {
  '**/*.{js}': (files) => [`eslint --quiet --fix ${files.join(' ')}`],
  '**/*.{js}': (files) => [`prettier --write ${files.join(' ')}`],
}
