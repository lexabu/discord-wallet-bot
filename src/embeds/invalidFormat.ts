import { embedFactory } from './embedFactory';

export const invalidFormatEmbed = embedFactory({
  description: `The wallet address you used was not in the proper Ethereum address format. Ethereum addresses are composed of the prefix \`0x\` followed by 40 hexadecimal digits.

    Example: \`0x1234567890123456789012345678901234567890\``,
  severity: 'error',
  title: 'Invalid wallet address format ❌',
});
