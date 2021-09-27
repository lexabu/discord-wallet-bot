import { MessageEmbed } from 'discord.js';

export const errorEmbed = new MessageEmbed()
  .setColor('#e76f51')
  .setTitle('Error').setDescription(`Something went wrong, please try again.
  Please see the list of available commands below:
\`\`!add-wallet\`\` : to add your wallet address to the presale list
example: \`\`!add-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!change-wallet\`\` : to change your wallet address on the presale list
example: \`\`!change-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!delete-wallet\`\` : to delete your wallet address from the presale list
example: \`\`!delete-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!view-wallet\`\` : to view your wallet address on the presale list
example: \`\`!view-wallet 0x1234567890123456789012345678901234567890\`\`
  `);
