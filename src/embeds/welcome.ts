import { embedFactory } from './embedFactory';

export const welcomeEmbed = embedFactory({
  description: `Run the \`!add-wallet\` command to get added to the presale list.

    Example: \`!add-wallet 0x1234567890123456789012345678901234567890\`

    \`!help\` : to view all available commands from the bot

    We will NEVER DM you first or ask for your private key

    If you get a DM from anyone claiming to be from Creepy Creams or the Sprinkles bot, please do not respond.`,
  severity: 'success',
  title: 'Welcome!  👋',
});
