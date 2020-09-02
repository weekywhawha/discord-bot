import { writeFile } from 'fs'
import puppeteer from 'puppeteer'
import { MessageEmbed } from 'discord.js'
import { jsonReader } from '../utils/jsonReader.js'

export const tarkovAmmo = async function main(message) {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const [page] = await browser.pages();

    await page.goto('https://tarkov-tools.com/ammo/')
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    })

    await page.waitForSelector('#root > div > div.display-wrapper > div > div.VictoryContainer > svg')
    const element = await page.$('#root > div > div.display-wrapper > div > div.VictoryContainer > svg')

    await page.evaluate(() => {
      const removeWrapper = document.querySelector('#root > div > div.id-wrapper.id-wrapper-left')
      removeWrapper.parentNode.removeChild(removeWrapper)
    })

    const newDate = await page.evaluate(() =>
      Array.prototype.slice
        .call(document.querySelectorAll('div[class="updated-label"]'))
        .map((a) => a.innerText)
        .toString()
    )

    jsonReader('./data/data.json', async (err, data) => {
      if (err) {
        console.log('File read failed:', err)
        return
      }
      if (data.tarkov.ammo.date !== newDate) {
        data.tarkov.ammo.date = newDate
        await element.screenshot({ path: './data/img/image.png' })
        await browser.close()
        writeFile('./data/data.json', JSON.stringify(data, null, 2).concat('\n'), (err) => {
          if (err) console.log('Error writing file:', err)
          console.log(data.tarkov.ammo.date)

          return
        })
      }
    })

    const ammoInfo = new MessageEmbed()
      .setDescription(`${newDate}`)
      .attachFiles(['./data/img/image.png'])
      .setImage('attachment://image.png')
      .setFooter('source: tarkov-tools.com', 'https://tarkov-tools.com/favicon-32x32.png')

    await message.channel.send(ammoInfo)
  } catch (err) {
    console.error(err)
  }
}
