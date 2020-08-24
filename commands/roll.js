const diceRoller = require('rpg-dice-roller');

module.exports = {
	name: 'roll',
	description: 'Executes a command given in dice notation, and returns the results.\nSee https://greenimp.github.io/rpg-dice-roller/guide/notation/ for more information about dice notation.',
	usage: '[dice-notation]',
	args: true,
	execute(message, args) {

		const dice = new diceRoller.DiceRoller();

		const input = args.toString().replace(/,/g, '');

		dice.roll(input);

		const result = dice.log.shift();

		const reply = `${message.author} rolled**${result.toString().substring(result.toString().indexOf(':') + 1)}**`;

		return message.channel.send(reply).catch(console.error);

	},
};