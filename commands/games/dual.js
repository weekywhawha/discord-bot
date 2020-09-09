import pkg from 'googleapis'
import { MessageEmbed } from 'discord.js'
const { google } = pkg

const APIKey = process.env.GOOGLE_API_KEY
const sheets = google.sheets({ version: 'v4', auth: APIKey })

export default {
  name: 'dual',
  description: 'information about Dual Universe ores, please input at least 4 characters for the search',
  usage: '[argument]',
  async execute(message, args) {
    const searchInput = args[0].toLowerCase()
    if (!searchInput || searchInput.length < 4) return message.reply(`invalid search parameter`)
    const request = {
      spreadsheetId: '14iHVub5lhpK4_IeshhHALnRyKDbob14npwo7OPCFvwM',
      range: 'A2:V37',
      majorDimension: 'COLUMNS',
    }

    const sheet = await sheets.spreadsheets.values.get(request)

    const findElement = sheet.data.values.find((element) =>
      element.toString().toLocaleLowerCase().includes(searchInput)
    )

    if (!findElement) return message.reply('your search did not match any item.')

    const oreName = findElement[0]
    const oreValues = findElement.slice(7)
    const planets = sheet.data.values[0].slice(7)

    const oreInfo = new MessageEmbed()
      .setTitle(`${oreName}`)
      .addField(
        'Planets',
        planets.map((str) => str.substring()),
        true
      )
      .addField('\u200b', '\u200b', true)
      .addField('Depth (m)', `${oreValues.toString().replace(/,/g, ' \u200b\n')}`, true)
      .addField('\u200b', '\u200b', false)
      .setFooter('source: docs.google.com', 'https://ssl.gstatic.com/docs/common/product/sheets_app_icon1.png')

    await message.channel.send(oreInfo)
  },
}
