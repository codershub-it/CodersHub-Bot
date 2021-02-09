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

            const presence = _roles.some(
              (role_id) =>
                _list_roles_category.some((role) => role.id === role_id) ||
                _list_roles_notification.some((role) => role.id === role_id),
            )
            console.log(member.user.username, presence)

            if (!presence) {
              // Se non ha un ruolo
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
