'use strict';
const fs = require('fs');
const Discord = require('discord.js');
const puppeteer = require('puppeteer');
module.exports = {
	name: 'tarkov',
	description: 'Escape from Tarkov information using these specific arguments:\nmarket | barter | keys | ammo | customs | factory | interchange | labs | reserve | shoreline | woods',
	usage: '[argument]',
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
						.setTitle('**Flea Market Prices 📈**')
						.addField('\u200b\nItems\n\u200b', items.map(str => str.substring(0, 40)), true)
						.addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
						.addField('\u200b', '\u200b', false)
						.setFooter('source: tarkov-market.com ', 'https://tarkov-market.com/favicon-32x32.png');

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
						.setTitle('**Barter Prices 🤝**')
						.addField('\u200b\nItems\n\u200b', items.map(str => str.substring(0, 40)), true)
						.addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
						.addField('\u200b', '\u200b', false)
						.setFooter('source: tarkov-market.com ', 'https://tarkov-market.com/favicon-32x32.png');

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
						.setTitle('**Key Prices 🔑**')
						.addField('\u200b\nItems\n\u200b', items.map(str => str.substring(0, 40)), true)
						.addField('Avg price (24h) \nPer slot\n\u200b', avgPrice, true)
						.addField('\u200b', '\u200b', false)
						.setFooter('source: tarkov-market.com ', 'https://tarkov-market.com/favicon-32x32.png');

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

					await page.evaluate(() => {
						const removeWrapper = document.querySelector('#root > div > div.id-wrapper.id-wrapper-left');
						removeWrapper.parentNode.removeChild(removeWrapper);
					});

					const newDate = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('div[class="updated-label"]')).map(a => a.innerText).toString(),
					);

					const oldDate = fs.readFileSync('./data/ammo_updated.txt').toString();

					if(newDate !== oldDate) {
						fs.writeFile('./data/ammo_updated.txt', newDate.toString(), (err) => {

							if (err) throw err;
						});
						await element.screenshot({ path: './data/img/image.png' });
						await browser.close();
					}
					const ammoInfo = new Discord.MessageEmbed()
						.setDescription(`${newDate}`)
						.attachFiles(['./data/img/image.png'])
						.setImage('attachment://image.png')
						.setFooter('source: tarkov-tools.com', 'https://tarkov-tools.com/favicon-32x32.png');

					await message.channel.send(ammoInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

			// maps
		case 'customs':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/Customs');

					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('Customs')
						.setImage('https://tarkov-tools.com/maps/customs.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

		case 'factory':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/Factory');

					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('Factory')
						.setImage('https://tarkov-tools.com/maps/factory.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

		case 'interchange':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/Interchange');

					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('Interchange')
						.setImage('https://tarkov-tools.com/maps/interchange.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

		case 'labs':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/The_Lab');


					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(5) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(5) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('The Lab')
						.setImage('https://tarkov-tools.com/maps/labs.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

		case 'reserve':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/Reserve');


					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(5) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(5) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('Reserve')
						.setImage('https://tarkov-tools.com/maps/reserve.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

		case 'shoreline':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/Shoreline');


					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('Shoreline')
						.setImage('https://tarkov-tools.com/maps/shoreline.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;

		case 'woods':
			(async function main() {
				try {
					const browser = await puppeteer.launch();
					const [page] = await browser.pages();

					await page.goto('https://escapefromtarkov.gamepedia.com/Woods');


					const raidDuration = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(3) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const playerNumbers = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(4) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);
					const enemies = await page.evaluate(
						() => Array.prototype.slice.call(document.querySelectorAll('#va-infobox0-content > td > table:nth-child(7) > tbody > tr:nth-child(6) > td.va-infobox-content'))
							.map(a => a.innerText).toString(),
					);

					const locationInfo = new Discord.MessageEmbed()
						.setTitle('Woods')
						.setImage('https://tarkov-tools.com/maps/woods.jpg')
						.addField('Raid Duration', `${raidDuration}`, true)
						.addField('Players', `${playerNumbers}`, true)
						.addField('Enemies', `${enemies}`, true)
						.setFooter('source: escapefromtarkov.gamepedia.com', 'https://mercury-media.cursecdn.com/avatars/0/676/635077524106421849.png');

					await browser.close();
					return message.channel.send(locationInfo);
				}
				catch (err) {
					console.error(err);
				}
			})();
			break;
		}

	},
};