const Commands = require('../../core/command')

module.exports = class UpdateRole extends Commands {
  constructor(client) {
    super(client)
    this.cmd = 'updaterole'
    this.alias = ''
    this.args = ''
    this.example = ''
    this.description = ''
    this.timer = 0
    this.access = [client._botSettings.rules.Admin]
    this.displayHelp = 0
    this.client = client
  }

  /**
   * Qui si esegue il processo del comando
   * @param message
   * @param bot
   * @returns {Promise<void>}
   */
  async execution(message) {
    // Estraggo tutti i membri
    message.guild.members
      .fetch()
      .then(async (guildMember) => {
        // Estraggo i ruoli dell'utente nel momento della fetch
        const _guildMembers = guildMember.array()
        const guild = this.client.guilds.cache.get(this.client._botSettings.server_id)
        const roles = guild.roles.cache.array()

        for (const member of _guildMembers) {
          if (!member.user.bot) {
            let _roles = []
            // Popolo _roles
            if (member._roles) _roles = member._roles

            // La lista dei roles corrispettivi category
            const _list_roles_category = this.client._botUtility.getRoleFromNameRaw(
              this.client,
              this.client._botSettings.role_category_index,
            )
            // La lista dei role corrispettivi notification
            const _list_roles_notification = this.client._botUtility.getRoleFromNameRaw(
              this.client,
              this.client._botSettings.role_notification_index,
            )

            let _presence_category = 0
            // Primo ciclo
            for (const role_category of _list_roles_category) {
              // Conto le presenze di quel ruolo
              if (_roles.length > 0 && _roles.includes(role_category.id) >= 0) {
                _presence_category++
              }
            }
            let _presence_notification = 0
            // Primo ciclo
            for (const role_notification of _list_roles_notification) {
              // Conto le presenze di quel ruolo
              if (_roles.length > 0 && _roles.includes(role_notification.id) >= 0) {
                _presence_notification++
              }
            }

            // Se non ha un ruolo
            if (_presence_notification == 0 && _presence_category == 0) {
              try {
                const settingsRoles = roles.filter(
                  (r) =>
                    r.name.includes(this.client._botSettings.role_category_index) ||
                    r.name.includes(this.client._botSettings.role_notification_index),
                )
                await member.edit({ roles: settingsRoles })
              } catch (e) {
                console.log("Errore nell'assegnazione dei ruoli", e)
              }
            }
          }
        }
        message.reply('```Server Aggiornato```')
      })
      .catch((e) => {
        console.log(e)
      })
  }
}
