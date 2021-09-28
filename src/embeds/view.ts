import { embedFactory } from './embedFactory';

export const viewEmbed = (walletAddress: string) =>
  embedFactory({
    description: `Address: \`${walletAddress}\`

    Use \`!change-wallet\` to change the wallet address that you have on the presale list.

    Example: \`!change-wallet 0x1234567890123456789012345678901234567890\``,
    severity: 'success',
    title: 'Your wallet address is on the presale list!  💯',
  });
