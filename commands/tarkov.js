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

				const items = await page.evaluate(
					() => Array.from(document.querySelectorAll('img[alt]'),
						a => a.getAttribute('alt'),
					),
				);
				const avgPrice = await page.evaluate(
					() => Array.prototype.slice.call(document.querySelectorAll('span[class="price-main"]')).map(a => a.innerText),
				);

				const dailyChange = await page.evaluate(
					() => Array.prototype.slice.call(document.querySelectorAll('td[class="h-mob plus"]')).map(a => a.innerText),
				);

				for (let i = 0; i < dailyChange.length; i++) {
					dailyChange.splice(i + 1, 1);
				}

				const lootInfo = new Discord.MessageEmbed()
					.setDescription('**Flea Market Prices**')
					.addField('Items', items.map(str => str.substring(0, 40)), true)
					.addField('Price', avgPrice, true)
					.addField('24h Change', dailyChange, true);

				await browser.close();
				return message.channel.send(lootInfo);
			}
			catch (err) {
				console.error(err);
			}
		})();
	},
};