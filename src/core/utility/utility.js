/**
 * Questo metodo serve ad estrarre una stringa con i ruoli in base ai nomi inseriti cerca all'interno di discord.js
 * @param client {Client}
 * @param params {String} Parametri AND per la ricerca del role
 * @returns {string} Similar `${role} ${role}` Può stampare anche più ruoli se ne trova tanti
 */
function getRoleFromName(client, ...params) {
  const _roles = []
  const _ParamsLength = params.length
  // Estrapolo la lista dei role all'interno del gruppo
  const guild = client.guilds.cache.get(client._botSettings.server_id)
  if (guild) {
    // Estraggo la lista dei roles all'interno del gruppo
    const roles = guild.roles.cache.array()
    roles.forEach((role) => {
      let _indexer = 0
      for (const param of params) {
        // Verifico la presenza di param nella string name
        if (role.name.search(param) >= 0) {
          _indexer++
        }
      }
      // Perché deve trovare gli elementi indicati in params
      if (_indexer == _ParamsLength) {
        _roles.push(role)
      }
    })
  }
  let _str_roles = ``
  for (const role of _roles) {
    _str_roles += `${role} `
  }
  return _str_roles
}

/**
 * Questo metodo serve ad estrarre una Role base ai nomi inseriti cerca all'interno di discord.js
 * @param client {Client}
 * @param params {String}
 * @returns {Role[]}
 */
function getRoleFromNameRaw(client, ...params) {
  const _roles = []
  const _ParamsLength = params.length
  // Estrapolo la lista dei role all'interno del gruppo
  const guild = client.guilds.cache.get(client._botSettings.server_id)
  if (guild) {
    // Estraggo la lista dei roles all'interno del gruppo
    const roles = guild.roles.cache.array()
    roles.forEach((role) => {
      let _indexer = 0
      for (const param of params) {
        // Verifico la presenza di param nella string name
        if (role.name.search(param) >= 0) {
          _indexer++
        }
      }
      // Perché deve trovare gli elementi indicati in params
      if (_indexer == _ParamsLength) {
        _roles.push(role)
      }
    })
  }
  return _roles
}
module.exports = {
  getRoleFromName,
  getRoleFromNameRaw,
}
