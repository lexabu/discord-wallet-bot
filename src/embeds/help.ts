import { MessageEmbed } from 'discord.js';

export const helpEmbed = new MessageEmbed()
  .setColor('#e76f51')
  .setTitle('Help')
  .setDescription(
    `Please see the list of available commands below:
\`\`!add-wallet\`\` : to add your wallet address to the presale list
example: \`\`!add-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!change-wallet\`\` : to change your wallet address on the presale list
example: \`\`!change-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!delete-wallet\`\` : to delete your wallet address from the presale list
example: \`\`!delete-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!view-wallet\`\` : to view your wallet address on the presale list
example: \`\`!view-wallet 0x1234567890123456789012345678901234567890\`\`

We will NEVER DM you first or ask for your private key

If you get a DM from anyone claiming to be from Creepy Creams or the Piggy Bank Bot, please do not respond.`,
  );
