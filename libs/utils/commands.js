import Discord from "discord.js";
import path from "path";
import { dirs, toArray } from "./file-system.js";
const __dirname = path.resolve();

const commands = new Discord.Collection();

export const getCommands = async function () {
  if (commands.array.length) {
    return commands;
  }

  const files = await toArray(dirs("./commands"));
  const commandFiles = files.filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = await import(
      `file:///${path.resolve(__dirname, file)}`
    ).then((m) => m.default);
    commands.set(command.name, command);
  }
  return commands;
};
