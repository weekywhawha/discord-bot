const diceRoller = require('rpg-dice-roller');
const dice = new diceRoller.DiceRoller();

module.exports = {
	name: 'roll',
	description: 'Executes a command given in dice notation, and returns the results.\nSee https://greenimp.github.io/rpg-dice-roller/guide/notation/ for more information about dice notation.',
	usage: '[dice-notation]',
	execute(message, args) {
		if (!args[0]) return message.reply('Please specify a dice type e.g., 1d6, 2d5 + 1d7 etc.');

		try{
			dice.roll(args.join(''));

			const result = dice.log.shift();

			return message.channel.send(`${message.author} rolled**${result.toString().substring(result.toString().indexOf(':') + 1)}**`);
		}
		catch (err) {
			message.reply('Wrong dice notation please use a valid notation.');
		}

	},
};