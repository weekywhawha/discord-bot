'use strict';
const fs = require('fs');
const Discord = require('discord.js');
const puppeteer = require('puppeteer');
module.exports = {
	name: 'tarkov',
	description: 'Top20 items listed on the flea market organised by avg price (24h) per slot  ',
	execute(message, args) {
		if (!args[0]) return message.reply('Please specify an argument');
		switch(args[0]) {
		// market data
		case 'market':
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
						.setDescription('**Flea Market Prices 📈**')
						.addField('\u200b\nItems\n\u200b', items.map(str => str.substring(0, 40)), true)
						.addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
						.addField('\u200b', '\u200b', false)
						.setFooter('source: tarkov-market.com ', 'https://images.discordapp.net/avatars/675451616865943552/d854b2b1a02fbb4c4b5eea47f9840caf.png?size=512');

					await browser.close();
					return message.channel.send(lootInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;
		case 'barter':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://tarkov-market.com/tag/barter');
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
						.setDescription('**Barter Prices 🤝**')
						.addField('\u200b\nItems\n\u200b', items.map(str => str.substring(0, 40)), true)
						.addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
						.addField('\u200b', '\u200b', false)
						.setFooter('source: tarkov-market.com ', 'https://images.discordapp.net/avatars/675451616865943552/d854b2b1a02fbb4c4b5eea47f9840caf.png?size=512');

					await browser.close();
					return message.channel.send(lootInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;
		case 'keys':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://tarkov-market.com/tag/keys');
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
						.setDescription('**Key Prices 🔑**')
						.addField('\u200b\nItems\n\u200b', items.map(str => str.substring(0, 40)), true)
						.addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
						.addField('\u200b', '\u200b', false)
						.setFooter('source: tarkov-market.com ', 'https://images.discordapp.net/avatars/675451616865943552/d854b2b1a02fbb4c4b5eea47f9840caf.png?size=512');

					await browser.close();
					return message.channel.send(lootInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;
		case 'ammo':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://tarkov-tools.com/ammo/');
					await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
					await page.waitForSelector('#root > div > div.display-wrapper > div > div.VictoryContainer > svg');
					const element = await page.$('#root > div > div.display-wrapper > div > div.VictoryContainer > svg');

					const newDate = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('div[class="updated-label"]')).map(a => a.innerText).toString(),
					);
					console.log(newDate);

					const oldDate = fs.readFileSync('./data/ammo_updated.txt').toString();


					console.log(oldDate.toString());
					if(newDate !== oldDate) {
						fs.writeFile('./data/ammo_updated.txt', newDate.toString(), (err) => {

							if (err) throw err;
						});
						await element.screenshot({ path: './data/img/image.png' });
						await browser.close();
					}
					await message.channel.send(`${newDate}💥`, { files:['./data/img/image.png'] });
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;
			// maps
		case 'customs':
			message.channel.send('https://tarkov-tools.com/maps/customs.jpg');
			break;
		case 'factory':
			message.channel.send('https://tarkov-tools.com/maps/factory.jpg');
			break;
		case 'interchange':
			message.channel.send('https://tarkov-tools.com/maps/interchange.jpg');
			break;
		case 'labs':
			message.channel.send('https://tarkov-tools.com/maps/labs.jpg');
			break;
		case 'reserve':
			message.channel.send('https://tarkov-tools.com/maps/reserve.jpg');
			break;
		case 'shoreline':
			message.channel.send('https://tarkov-tools.com/maps/shoreline.jpg');
			break;
		case 'woods':
			message.channel.send('https://tarkov-tools.com/map/woods.jpg');
			break;
		}

	},
};