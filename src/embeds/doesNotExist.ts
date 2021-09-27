import { MessageEmbed } from 'discord.js';

export const doesNotExistEmbed = new MessageEmbed()
  .setColor('#e76f51')
  .setTitle('Wallet Address does not exist')
  .setDescription(
    `You do not have a wallet address on the presale yet.
    Use \`\`!add-wallet\`\` to add your address.
    example: \`\`!add-wallet 0x1234567890123456789012345678901234567890\`\``,
  );
