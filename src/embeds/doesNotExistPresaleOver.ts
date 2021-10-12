import { embedFactory } from './embedFactory';

export const doesNotExistPresaleOverEmbed = embedFactory({
  description: `You do not have a wallet address on the presale list.

Unfortunately, the period to join the presale list has ended.`,
  severity: 'error',
  title: 'Not found  🔎',
});
