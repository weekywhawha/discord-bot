export default {
  name: 'kick',
  description: 'Tag a member and kick them',
  guildOnly: "true",
  usage: '[member-tag] [reason(optional)]',
  async execute(message, args) {
    if (!message.member.roles.cache.some((r) => r.name === 'Admin'))
      return message.reply('you do not have permission to use this command')

    const member = message.mentions.members.first() || message.guild.members.get(args[0])
    if (!member) return message.reply('Please mention a valid member of this server')
    if (!member.kickable)
      return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?')

    let reason = args.slice(1).join(' ')
    if (!reason) reason = 'No reason provided'

    await member
      .kick(reason)
      .catch((error) => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`))
    message.channel.send(`<@${member.user.id}> has been kicked by <@${message.author.id}>. **Reason:** ${reason}`)
  },
}
