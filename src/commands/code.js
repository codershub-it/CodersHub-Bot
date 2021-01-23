const Commands = require('../core/command')

module.exports = class Code extends Commands {

    constructor(client) {
        super(client)
        this.cmd = 'code'
        this.alias = 'co'
        this.args = '[tipo linguaggio(Opzionale)] inserisci il codice...'
        this.example = `${ client.conf.prefix }code [javascript] var idea = 3`
        this.description = 'Utilizza questo comando per condividere il tuo codice nel CodersHub.\n' +
            'Il tipo di linguaggio deve essere inserito tra parentesi quadre (es:[php]) prima del tuo codice.\n\n' +
            '**Attenzione** il carattere ` (apostrofo rovesciato) verrà sostituito con §'
        this.timer = 0
        this.access = [client._botSettings.rules.everyone]
        this.displayHelp = 1
    }

    async execution(message, bot) {

        let id_author = message.author.id
        let code = message.args
        let lang = ''

        // Riferimento di lingua tra [linguaggio]
        if (code.indexOf('[', 0) == 0 && code.indexOf(']',0) > 0 ){
            console.log(code.indexOf('[', 0), '[')
            console.log(code.indexOf(']',0), ']')
            lang = code.substring(code.indexOf('[', 0) + 1, code.indexOf(']',0))
            let langLast = code.indexOf(']',0)
            // Elimino la parte lang [linguaggio]
            code = code.substr(langLast + 1)
        }
        // Escape del carattere ` con §
        code = code.replace(/`/g,'§')

        // Questo per togliere lo spazio dopo [lang]
        if (code.indexOf(' ', 0) == 0) {
            code = code.substr(1)
        }

        //console.log(xxx)
        message.channel.send( `Codice **${lang}** condiviso da <@${id_author}>:`+ '\n```' + lang + '\n' + code + '```').catch((e) => {
            console.log(e)
        })
        await message.delete()
    }
}