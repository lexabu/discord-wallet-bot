import { embedFactory } from './embedFactory';

export const successRemoveEmbed = embedFactory({
  description: `Your wallet address was successfully removed from the presale list. Use \`!add-wallet\` to rejoin!

  Example: \`!add-wallet 0x1234567890123456789012345678901234567890\``,
  severity: 'warn',
  title: 'Removed 🚮',
});
