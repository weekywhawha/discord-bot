import puppeteer from 'puppeteer'
import { MessageEmbed } from 'discord.js'

export const tarkovSearch = async function (message, args) {
  try {
    const searchInput = args.slice(1).join(' ')

    if (!searchInput || searchInput.length < 3) return message.reply(`invalid search parameter`)

    const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
    const [page] = await browser.pages()

    await page.goto('https://tarkov-market.com/')

    const input = await page.waitForSelector('div[class="search"]')

    await page.click('div[class="search"]')

    await input.type(searchInput)

    await page.waitForSelector('th[class="price pointer"]')
    await page.click('th[class="price pointer"]')
    await page.waitForSelector('div[class="nuxt-progress"]')
    await page.waitForSelector('div[class="nuxt-progress"]', {
      visible: false,
    })

    const items = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img[alt]'), (a) => a.getAttribute('alt'))
    )
    const avgPrice = await page.evaluate(() =>
      Array.prototype.slice.call(document.querySelectorAll('span[class="price-main"]')).map((a) => a.innerText)
    )

    if (!items.length) {
      await browser.close()
      return message.reply('your search did not match any item.')
    }

    const searchInfo = new MessageEmbed()
      .setTitle(`**Search Results for** *"${searchInput}"* 📦`)
      .addField(
        '\u200b\nItems\n\u200b',
        items.map((str) => str.substring(0, 40)),
        true
      )
      .addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
      .addField('\u200b', '\u200b', false)
      .setFooter('source: tarkov-market.com ', 'https://tarkov-market.com/favicon-32x32.png')

    await browser.close()
    return message.channel.send(searchInfo)
  } catch (err) {
    console.error(err)
  }
}
