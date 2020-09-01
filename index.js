import dotenv from "dotenv";
import Discord from "discord.js";
import { getCommands } from "./libs/utils/commands.js";

dotenv.config();

const prefix = process.env.PREFIX;
const client = new Discord.Client();

const init = async function () {
  const commands = await getCommands();
  const cooldowns = new Discord.Collection();

  client.once("ready", () => {
    console.log("Ready!");
  });

  client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    console.log(args);
    const commandName = args.shift().toLowerCase();

    const command =
      commands.get(commandName) ||
      commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type === "dm") {
      return message.reply("I can't execute that command inside DMs!");
    }

    if (command.args && !args.length) {
      return message.reply(
        `You didn't provide any arguments, ${message.author}!`
      );
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
        return message.reply(
          `please wait ${timeLeft.toFixed(
            1
          )} more second(s) before reusing the \`${command.name}\` command.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      message.reply("there was an error trying to execute that command!");
    }
  });

  client.login();
};

init();
