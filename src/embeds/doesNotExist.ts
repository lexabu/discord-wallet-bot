import { embedFactory } from './embedFactory';

export const doesNotExistEmbed = embedFactory({
  description: `You do not have a wallet address on the presale yet.

Use \`!add-wallet\` to add your wallet address.

Example: \`!add-wallet 0x1234567890123456789012345678901234567890\``,
  severity: 'error',
  title: 'Not found  🔎',
});
