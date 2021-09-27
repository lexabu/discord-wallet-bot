import { MessageEmbed } from 'discord.js';

export const successDeleteEmbed = new MessageEmbed()
  .setColor('#2a9d8f')
  .setTitle('Success')
  .setDescription(
    `Your wallet address was successfully removed from the presale list.
     Use \`\`!add-wallet\`\` to rejoin!`,
  );
