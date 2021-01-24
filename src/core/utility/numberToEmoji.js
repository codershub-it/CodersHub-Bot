/**
 * Trasforma il numero in emoji
 */
class NumberToEmoji {
  /**
   * Converts numbers from a string into emojis.
   * @param {string|number} str - The string with numbers to be converted.
   * @returns {string}
   */
  static toEmoji(str) {
    if (str === undefined || str === null || str === '') {
      return str
    }

    if (typeof str !== 'string') {
      str = str.toString()
    }

    if (str === '10') {
      return '🔟'
    }

    return str
      .replace(/0/g, '0️⃣')
      .replace(/1/g, '1️⃣')
      .replace(/2/g, '2️⃣')
      .replace(/3/g, '3️⃣')
      .replace(/4/g, '4️⃣')
      .replace(/5/g, '5️⃣')
      .replace(/6/g, '6️⃣')
      .replace(/7/g, '7️⃣')
      .replace(/8/g, '8️⃣')
      .replace(/9/g, '9️⃣')
  }

  /**
   * Converts emojis from a string into numbers.
   * @param {string|number} str - The string with emojis to be converted to numbers.
   * @returns {string}
   */
  static fromEmoji(str) {
    if (str === undefined || str === null || str === '') {
      return str
    }

    if (typeof str !== 'string') {
      str = str.toString()
    }

    return str
      .replace(/🔟/g, '10')
      .replace(/0️⃣/g, '0')
      .replace(/1️⃣/g, '1')
      .replace(/2️⃣/g, '2')
      .replace(/3️⃣/g, '3')
      .replace(/4️⃣/g, '4')
      .replace(/5️⃣/g, '5')
      .replace(/6️⃣/g, '6')
      .replace(/7️⃣/g, '7')
      .replace(/8️⃣/g, '8')
      .replace(/9️⃣/g, '9')
  }
}

module.exports = NumberToEmoji
