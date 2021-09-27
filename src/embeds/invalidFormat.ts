import { MessageEmbed } from 'discord.js';

export const invalidFormatEmbed = new MessageEmbed()
  .setColor('#e76f51')
  .setTitle('Invalid Wallet Address Format')
  .setDescription(`The wallet address you used was not in the proper Ethereum Address format. 
  Ethereum addresses are composed of the prefix "0x" followed by 40 hexadecimal digits.
  e.g. 0xa123b4cd5ef66777gh888888fffff420456769. `);
