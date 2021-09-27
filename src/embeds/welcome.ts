import { MessageEmbed } from 'discord.js';

export const welcomeEmbed = new MessageEmbed()
  .setColor('#e76f51')
  .setTitle('Please run the add-wallet command')
  .setDescription(
    `\`\`!add-wallet\`\` : to add your wallet address to the presale list
example: \`\`!add-wallet 0x1234567890123456789012345678901234567890\`\`

\`\`!help\`\` : to view all available commands from the bot
example: \`\`!help\`\`

We will NEVER DM you first or ask for your private key

If you get a DM from anyone claiming to be from Creepy Creams or the Piggy Bank Bot, please do not respond.`,
  );
