import { MessageEmbed } from 'discord.js';

export const successChangeEmbed = new MessageEmbed()
  .setColor('#2a9d8f')
  .setTitle('Success')
  .setDescription(`Successfully changed your address!`);
