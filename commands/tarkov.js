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

				await page.goto('https://tarkov-tools.com/loot-tier/barter-items');

				const lootItems = await page.evaluate(
					() => Array.from(document.querySelectorAll('img[alt]'),
						a => a.getAttribute('alt'),
					),
				);
				const price = await page.evaluate(
					() => document.querySelector('div[class="price-range-wrapper"]').innerText,

				);

				const itemPrice = await page.evaluate(
					() => document.querySelector('div[class="barter-group-items"]').innerText,
				);

				const lootInfo = new Discord.MessageEmbed()
					.setDescription('**S TIER LOOT**')
					.addField(`${price.split('\n').splice(0, 1)}`, lootItems.slice(0, 27), true)
					.addField('Value', itemPrice.replace(/^Value:|^Per slot:.*\n?/gm, ''), true);

				await browser.close();
				return message.channel.send(lootInfo);
			}
			catch (err) {
				console.error(err);
			}
		})();
	},
};