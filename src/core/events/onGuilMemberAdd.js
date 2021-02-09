function init(client) {
  client.on('guildMemberAdd', async (member) => {
    try {
      await addSettingsRoles(client, member)
      await sendPmToNewMember(client._botSettings.channel.impostazione_ruoli_id, member)
    } catch (e) {
      console.log('Errore al guildMemberAdd', e)
    }
  })
}

module.exports = { init }

async function addSettingsRoles(client, member) {
  try {
    const guild = client.guilds.cache.get(client._botSettings.server_id)
    const roles = guild.roles.cache.array()
    const settingsRoles = roles.filter(
      (r) =>
        r.name.includes(client._botSettings.role_category_index) ||
        r.name.includes(client._botSettings.role_notification_index),
    )
    await member.edit({ roles: settingsRoles })
  } catch (e) {
    console.log("Errore nell'assegnazione dei ruoli di notifica", e)
  }
}

async function sendPmToNewMember(settingsChannelId, member) {
  await member.user.send('Ciao!', {
    embed: {
      title: 'Benvenuto su CodersHub!',
      description: `Se vuoi scegliere quali sezioni vedere e che tipo di notifiche ricevere all'interno del nostro server, puoi andare nel canale <#${settingsChannelId}> e personalizzare le impostazioni`,
      color: 'RANDOM',
      thumbnail: {
        url: 'https://media.tenor.com/images/7ab5c8247e639abe8a5bb6de0f2bcf76/tenor.gif',
      },
    },
  })
}
