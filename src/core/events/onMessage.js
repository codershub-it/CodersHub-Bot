/**
 * Estrapola e estende l'oggetto message aggiungendo cmd che è il comando usato e args sono gli argomenti dopo cmd
 * @param client
 * @param message
 * @returns {*}
 */
const extendMessage = (client, message) => {
  const _message = message
  const cmd = message.content.substr(1, message.content.length).split(' ')[0]
  _message.cmd = cmd.toLowerCase()
  _message.args = message.content.replace(client.conf.prefix + cmd, '').trim()
  return _message
}

/**
 * Legge i messaggi ricevuti e ne gestisce se sono comandi
 * @param message
 * @param client
 * @returns {*}
 */
function readMessage(message, client) {
  if (message.author.bot) return

  if (message.content[0] !== client.conf.prefix) return
  message = extendMessage(client, message)

  // Questo parametro mi serve per capire se il comando non esiste
  let presence_cmd = 0
  // Estraggo tutti i comandi inseriti, verifico il permesso e avvio il comando.
  Object.entries(client._botCommands).forEach(([, cmd]) => {
    if (cmd.cmd === message.cmd || cmd.alias === message.cmd) {
      // Permesso di accesso al comando.
      const rules_access = cmd.access
      // Verifico se ci sono dei limiti di accesso
      if (rules_access.length > 0) {
        // Gestione ruolo e permessi di uso del comando
        let _roles = []
        // Estraggo i roles utente che ha scritto il messaggio
        if (message.member._roles) _roles = message.member._roles
        let _presence_role = 0
        // Ciclo role
        for (const role_id of rules_access) {
          // Conto le presenze di quel ruolo
          if (_roles.length > 0 && _roles.includes(role_id) >= 0) {
            _presence_role++
          }
        }
        // Verifico se ha gli accessi
        if (_presence_role == 0) {
          presence_cmd++
          return message.reply('mi dispiace ma non hai i permessi per inviare questo comando')
        }
      }
      // Start command
      cmd.execution(message).catch((e) => {
        console.log(e)
      })
      presence_cmd++
    }
  })
  // Se non ci sono risposte positive
  if (presence_cmd == 0) {
    const emb = new client._botMessageEmbed()
      .setTitle(`Hei ${message.author.username} sicuro di aver scritto giusto? :scream:`)
      .setColor('RANDOM')
      .setDescription(
        `Questo comando mi emoziona ma non so a cosa serva.. Usa **${client.conf.prefix}help** per vedere tutti i miei comandi :kissing_heart: `,
      )
    message.channel.send(emb).catch((e) => {
      console.log(e)
    })
  }
}

/**
 * Init della pagina
 * @param client
 */
function init(client) {
  client.on('message', (message) => {
    readMessage(message, client)
  })
}
module.exports = { init }
