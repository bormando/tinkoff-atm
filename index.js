require('dotenv').config()

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function start() {
  while(true) {
    const atms = await require('./helpers/api.helper').getAtms()
    if (!atms)
      continue
    previousMessage = await require('./helpers/telegram.helper').sendMessage(atms, previousMessage)
    await delay(+process.env.TIMEOUT)
  }
}

let previousMessage = ''

start()