/**
 * Questa è la classe madre di commands se si vuole creare dei metodi o variabili per tutti i comandi
 * @type {Commands}
 */
module.exports = class Commands {
  /**
   * Estrapola il valore del testo tra le prime [] e risponde il valore all'interno e il txt senza quel elemento
   * @param txt
   * @returns {{txt: string, squareValue: string}}
   */
  estractFromSquareBrackets(txt, index = 0) {
    let squareValue = ''
    let result = ''
    // Riferimento di lingua tra [linguaggio]
    if (txt.indexOf('[', index) == 0 && txt.indexOf(']', index) > 0) {
      squareValue = txt.substring(txt.indexOf('[', index) + 1, txt.indexOf(']', index))
      const langLast = txt.indexOf(']', index)
      // Elimino la parte lang [linguaggio]
      result = txt.substr(langLast + 1)
    }
    return { txt: result, squareValue: squareValue }
  }

  /**
   * Evidenza un valore nella stringa
   * @param str
   * @param value
   * @returns {*|void|string}
   */
  highlightValueInString(str, value) {
    if (value) {
      return str.replace(value, '**' + value + '**')
    } else {
      return str
    }
  }

  /**
   * Crea una link al messaggio
   * @param guild_id
   * @param channel_id
   * @param message_id
   * @returns {string}
   */
  makeStringUrl(guild_id, channel_id, message_id) {
    return `https://discord.com/channels/${guild_id}/${channel_id}/${message_id}`
  }

  /**
   * Taglia una stringa
   * @param str
   * @param num
   * @returns {string|*}
   */
  truncateString(str, num) {
    if (str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }
}
