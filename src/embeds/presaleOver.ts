import { embedFactory } from './embedFactory';

export const presaleOverEmbed = embedFactory({
  description:
    'The presale is over! You can view your wallet with the `!view-wallet` command.',
  severity: 'warn',
  title: 'Whoa there!  ✋',
});
