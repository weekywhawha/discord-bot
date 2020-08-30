import puppeteer from "puppeteer"
import { MessageEmbed } from "discord.js";


export const tarkovKeys = async function main(message) {
  try {
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();

    await page.goto("https://tarkov-market.com/tag/keys");
    await page.waitForSelector('th[class="price pointer"]');
    await page.click('th[class="price pointer"]');
    await page.waitForSelector('div[class="nuxt-progress"]', {
      visible: false,
    });

    const items = await page.evaluate(() =>
      Array.from(document.querySelectorAll("img[alt]"), (a) =>
        a.getAttribute("alt")
      )
    );
    const avgPrice = await page.evaluate(() =>
      Array.prototype.slice
        .call(document.querySelectorAll('span[class="price-main"]'))
        .map((a) => a.innerText)
    );

    const lootInfo = new MessageEmbed()
      .setTitle("**Key Prices 🔑**")
      .addField(
        "\u200b\nItems\n\u200b",
        items.map((str) => str.substring(0, 40)),
        true
      )
      .addField("Avg price (24h) \nPer slot\n\u200b", avgPrice, true)
      .addField("\u200b", "\u200b", false)
      .setFooter(
        "source: tarkov-market.com ",
        "https://tarkov-market.com/favicon-32x32.png"
      );

    await browser.close();
    return message.channel.send(lootInfo);
  } catch (err) {
    console.error(err);
  }
}