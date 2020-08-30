import weather from "weather-js";
import {MessageEmbed} from "discord.js";

export default {
  name: 'weather',
  description: 'Checks weather forecast',
  usage: '[location]',
  execute(message, args) {
    weather.find({ search: args.join(''), degreeType: 'C' }, (error, result) => {
      if(error) return message.reply('Please specify a location.');
      if(result === undefined || result.length === 0) return message.reply('Invalid location.');

      const current = result[0].current;
      const location = result[0].location;

      const timezone = location.timezone > 0 ? `+${location.timezone}` : location.timezone;

      const weatherInfo = new MessageEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`Weather forecast for ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x111111)
        .addField('Timezone', `UTC${Number(timezone) === 0 ? `±${timezone}` : timezone}`, true)
        .addField('Date', `${current.date}`, true)
        .addField('Wind', current.winddisplay, true)
        .addField('Temperature', `${current.temperature}°C`, true)
        .addField('Feels like', `${current.feelslike}°C`, true)
        .addField('Humidity', `${current.humidity}%`, true);

      return message.channel.send(weatherInfo);
    });
  },
};