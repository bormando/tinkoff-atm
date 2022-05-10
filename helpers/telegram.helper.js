const TelegramBot = require('node-telegram-bot-api')

class TelegramHelper {
  constructor() {
    this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: false })
  }

  sendMessage(atms, previousMessage) {
    const newMessage = this._prepareMessage(atms)
    if (newMessage.length > 4096) {
      console.log('Зона покрытия большая - слишком много банкоматов. Уменьшайте зону поиска.')
      return newMessage
    }
    if (!(newMessage === previousMessage))
      if (newMessage.length === 0)
        this.bot.sendMessage(process.env.CHAT_ID, 'Банкоматы пусты')
      else
        this.bot.sendMessage(process.env.CHAT_ID, newMessage)
    return newMessage
  }

  _prepareMessage(atms) {
    let message = ''

    for (let atm of atms) {
      const currencies = atm.atmInfo.limits
        .map(limit => `${limit.currency} (${limit.amount})`)
        .join(', ')
      message += `${message.length === 0 ? '' : '\n\n' }Адрес: ${atm.address}\nВалюты: ${currencies}`
    }

    return message
  }
}

module.exports = new TelegramHelper()