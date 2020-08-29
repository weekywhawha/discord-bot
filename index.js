const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
const prefix = process.env.PREFIX;
const client = new Discord.Client();

// Gets all directories in the main folder - Only goes 1 down.
function getDirectories() {
	return fs.readdirSync('./commands').filter(function subFolder(file) {
		return fs.statSync('./commands/' + file).isDirectory();
	});
}

client.commands = new Discord.Collection();
// Reads normal .js files in the main dir
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// Loops through all the folders in the main dir and finds those with a .js extension
for (const folder of getDirectories()) {
	const folderFiles = fs.readdirSync('./commands/' + folder).filter(file => file.endsWith('.js'));
	for (const file of folderFiles) {
		commandFiles.push([folder, file]);
	}
}
// Takes the two different command and folder lists and requires all the commands into an array which then puts it into the collection
for (const file of commandFiles) {
	let command;
	if (Array.isArray(file)) {
		command = require(`./commands/${file[0]}/${file[1]}`);
	}
	else {
		command = require(`./commands/${file}`);
	}
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	console.log(args);
	const commandName = args.shift().toLowerCase();


	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.args && !args.length) {
		return message.reply(`You didn't provide any arguments, ${message.author}!`);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.DISCORD_TOKEN);