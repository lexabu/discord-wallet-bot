import { embedFactory } from './embedFactory';

export const helpEmbed = (isAdmin: boolean) =>
  embedFactory({
    description: `See the list of available commands below:
  \`!add-wallet\`: to add your wallet address to the presale list
  Example: \`!add-wallet 0x1234567890123456789012345678901234567890\`

  \`!change-wallet\`: to change your wallet address on the presale list
  Example: \`!change-wallet 0x1234567890123456789012345678901234567890\`

  \`!remove-wallet\`: to remove your wallet address from the presale list
  Example: \`!remove-wallet\`

  \`!view-wallet\`: to view your wallet address on the presale list
  Example: \`!view-wallet\`
  ${
    isAdmin
      ? `
  \`!download-wallets\`: to receive a csv with all of the wallet addresses (only available to admins)
  Example: \`!download-wallets\`

  \`!count-presale\`: to get a count of how many entries are in the presale (only available to admins)
  Example: \`!count-presale\`
  `
      : ''
  }
  We will NEVER DM you first or ask for your private key.

  If you get a DM from anyone claiming to be from Creepy Creams, please do not respond.`,
    severity: 'warn',
    title: 'Help  📃',
  });
