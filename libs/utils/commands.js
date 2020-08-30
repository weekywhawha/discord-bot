import { readdir, stat } from "fs/promises";
import Discord from "discord.js";
import path from "path";
const __dirname = path.resolve();

const COMMANDS_PATH = path.resolve(__dirname, "commands");
const commands = new Discord.Collection();

export const getCommands = async function () {
  if (commands.array.length) {
    return commands;
  }

  // Reads normal .js files in the main dir
  const names = await readdir(COMMANDS_PATH);
  const commandFiles = names.filter((file) => file.endsWith(".js"));
  // Loops through all the folders in the main dir and finds those with a .js extension
  for (const folder of commandFiles) {
    const stats = await stat(path.resolve(COMMANDS_PATH, folder));
    if (stats.isDirectory()) {
      const namesInFolder = await readdir(path.resolve(COMMANDS_PATH, folder));
      const folderFiles = namesInFolder.filter((file) => file.endsWith(".js"));
      for (const file of folderFiles) {
        // @ts-ignore
        commandFiles.push([folder, file]);
      }
    }
  }

  // Takes the two different command and folder lists and requires all the commands into an array which then puts it into the collection
  for (const file of commandFiles) {
    let command;
    if (Array.isArray(file)) {
      command = await import(
        `file:///${path.resolve(COMMANDS_PATH, file[0], file[1])}`
      ).then((m) => m.default);
    } else {
      command = await import(
        `file:///${path.resolve(COMMANDS_PATH, file)}`
      ).then((m) => m.default);
    }
    commands.set(command.name, command);
  }

  return commands;
};
