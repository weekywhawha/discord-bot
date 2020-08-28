'use strict';
const Discord = require('discord.js');
const puppeteer = require('puppeteer');
module.exports = {
	name: 'tarkov',
	description: 'top loot',
	execute(message) {
		(async function main() {
			try {
				const browser = await puppeteer.launch();
				const [page] = await browser.pages();

				await page.goto('https://tarkov-market.com/');
				await page.waitForSelector('th[class="price pointer"]');
				await page.click('th[class="price pointer"]');
				await page.waitForSelector('div[class="nuxt-progress"]', { visible: false });


				const items = await page.evaluate(
					() => Array.from(document.querySelectorAll('img[alt]'),
						a => a.getAttribute('alt'),
					),
				);
				const avgPrice = await page.evaluate(
					() => Array.prototype.slice.call(document.querySelectorAll('span[class="price-main"]')).map(a => a.innerText),
				);


				const lootInfo = new Discord.MessageEmbed()
					.setDescription('**Flea Market Prices**')
					.addField('Items\n 🏷', items.map(str => str.substring(0, 40)), true)
					.addField('Avg price (24h) \nPer slot 💰', avgPrice, true)
					.setFooter('source: tarkov-market.com ', 'https://images.discordapp.net/avatars/675451616865943552/d854b2b1a02fbb4c4b5eea47f9840caf.png?size=512');

				await browser.close();
				return message.channel.send(lootInfo);
			}
			catch (err) {
				console.error(err);
			}
		})();
	},
};