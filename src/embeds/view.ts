import { MessageEmbed } from 'discord.js';

export const viewEmbed = (walletAddress: string) =>
  new MessageEmbed()
    .setColor('#2a9d8f')
    .setTitle('Wallet address is on the presale')
    .setDescription(
      `Your wallet address is on the presale list: ${walletAddress}.
      Use \`\`!change-wallet\`\` to change the address that you have on the presale list.`,
    );
