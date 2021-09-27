import { MessageEmbed, User } from 'discord.js';

export const checkDmEmbed = (user: User) =>
  new MessageEmbed()
    .setColor('#2a9d8f')
    .setTitle('Check your Direct Messages')
    .setDescription(`${user} Check your DM to join the presale!`);
