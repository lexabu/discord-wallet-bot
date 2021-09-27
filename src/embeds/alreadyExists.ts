import { MessageEmbed } from 'discord.js';

export const alreadyExistsEmbed = new MessageEmbed()
  .setColor('#e9c46a')
  .setTitle('User already exists')
  .setDescription(
    `You already have a wallet address in the presale.
    Use \`\`!change-wallet\`\` to change your address.
    example: \`\`!change-wallet 0x1234567890123456789012345678901234567890\`\``,
  );
