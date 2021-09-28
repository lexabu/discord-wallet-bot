import { embedFactory } from './embedFactory';

export const alreadyExistsEmbed = embedFactory({
  description: `You already have a wallet address on the presale list. Use \`!change-wallet\` to change the wallet address that you have on the presale list.

    Example: \`!change-wallet 0x1234567890123456789012345678901234567890\``,
  severity: 'warn',
  title: 'User already exists  ✋',
});
