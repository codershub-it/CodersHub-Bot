const Commands = require('../core/command')

module.exports = class Help extends Commands {

    constructor(client) {
        super(client)
        this.cmd = 'kick'
        this.alias = 'kik'
        this.args = '[@nomeutente] [testo motivazione dell\'espulsione]'
        this.example = `${ client.conf.prefix }kink @utente Perché hai inserito testo scorretto troppe volte`
        this.description = 'Effettua un ban di un utente'
        this.timer = 0
        this.access = [client._botSettings.rules.Admin, client._botSettings.rules.Moderatore]
        this.displayHelp = 1
    }

    async execution(message, bot) {
        const user = message.mentions.users.first()
        let str_mention = message.args.split(' ')[0]
        let reason = message.args.replace(str_mention,'').trim()
        if (!reason) reason = "nessuna ragione"
        if (user) {
            const member = message.guild.member(user)
            if (member) {
                member
                    .kick(reason)
                    .then(() => {
                        message.reply(`espulso con successo ${user.tag}`)
                    })
                    .catch(err => {
                        message.reply('non sono riuscito a calciare il membro')
                        console.error(err)
                    })
            } else {
                message.reply("quell'utente non è in questa gilda!")
            }
        } else {
            message.reply("non hai menzionato l'utente per calciare!")
        }
    }
}