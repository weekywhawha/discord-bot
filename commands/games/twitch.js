import axios from 'axios'
import { MessageEmbed } from 'discord.js'

const token = process.env.TWITCH_TOKEN
const clientId = process.env.TWITCH_ID

export default {
  name: 'twitch',
  description: 'Get a link for the channel requested.',
  usage: '[argument]',
  async execute(message, args) {
    if (!args[0]) {
      return message.reply("you didn't provide a username to search for.")
    }
    const credentials = await axios({
      method: 'POST',
      url: 'https://id.twitch.tv/oauth2/token',
      params: {
        client_id: clientId,
        client_secret: token,
        grant_type: 'client_credentials',
        redirect_uri: 'http://localhost',
      },
    })

    let stream

    try {
      stream = await axios({
        method: 'GET',
        url: 'https://api.twitch.tv/helix/streams',
        headers: {
          'client-id': clientId,
          Authorization: `Bearer ${credentials.data.access_token}`,
        },
        params: {
          user_login: `${args[0]}`,
          first: 1,
        },
      })
    } catch (error) {
      return console.log(error)
    }

    if (!stream.data.data.length) {
      return message.reply("the streamer you are looking for is not online or doesn't exist.")
    }

    const info = stream.data.data[0]
    console.log(info)
    const gameId = info.game_id
    const name = info.user_name
    const title = info.title
    const viewers = info.viewer_count
    const thumbnail = info.thumbnail_url.replace(`{width}`, '640').replace(`{height}`, '360')
    console.log(thumbnail)

    const game = await axios({
      method: 'GET',
      url: 'https://api.twitch.tv/helix/games',
      headers: {
        'client-id': clientId,
        Authorization: `Bearer ${credentials.data.access_token}`,
      },
      params: {
        id: gameId,
      },
    })
    console.log(game.data)

    if (!game.data.data.length) {
      return console.log('game data is unreachable')
    }

    const artwork = game.data.data[0].box_art_url.replace(`{width}`, '285').replace(`{height}`, '380')
    const gameName = game.data.data[0].name
    console.log(artwork)

    const twitchInfo = new MessageEmbed()
      .setTitle(`🔴 ${name} is live`)
      .setThumbnail(artwork)
      .addField('Title', `${title}`)
      .addField('Game', `${gameName}`, true)
      .addField('Viewers', `${viewers} viewers`, true)
      .setImage(`${thumbnail}`)
      .setURL(`https://www.twitch.tv/${name}`)

    return message.channel.send(twitchInfo)
  },
}
