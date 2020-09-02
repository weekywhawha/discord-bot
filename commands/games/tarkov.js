import { tarkovMarket } from '../../libs/tarkov/market.js'
import { tarkovBarter } from '../../libs/tarkov/barter.js'
import { tarkovKeys } from '../../libs/tarkov/keys.js'
import { tarkovAmmo } from '../../libs/tarkov/ammo.js'
import { tarkovCustoms } from '../../libs/tarkov/customs.js'
import { tarkovFactory } from '../../libs/tarkov/factory.js'
import { tarkovInterchange } from '../../libs/tarkov/interchange.js'
import { tarkovLabs } from '../../libs/tarkov/labs.js'
import { tarkovReserve } from '../../libs/tarkov/reserve.js'
import { tarkovShoreline } from '../../libs/tarkov/shoreline.js'
import { tarkovWoods } from '../../libs/tarkov/woods.js'

export default {
  name: 'tarkov',
  description:
    'Escape from Tarkov information using these specific arguments:\nmarket | barter | keys | ammo | customs | factory | interchange | labs | reserve | shoreline | woods',
  usage: '[argument]',
  execute(message, args) {
    if (!args[0]) return message.reply('Please specify an argument')
    switch (args[0]) {
      // market data
      case 'market':
        return tarkovMarket(message)
      case 'barter':
        return tarkovBarter(message)
      case 'keys':
        return tarkovKeys(message)
      case 'ammo':
        return tarkovAmmo(message)

      // maps
      case 'customs':
        return tarkovCustoms(message)
      case 'factory':
        return tarkovFactory(message)
      case 'interchange':
        return tarkovInterchange(message)
      case 'labs':
        return tarkovLabs(message)
      case 'reserve':
        return tarkovReserve(message)
      case 'shoreline':
        return tarkovShoreline(message)
      case 'woods':
        return tarkovWoods(message)
    }
  },
}
