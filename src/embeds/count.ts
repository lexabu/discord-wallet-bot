import { embedFactory } from './embedFactory';

export const countEmbed = (count: number) =>
  embedFactory({
    description: `There are ${count} members in the presale! 🎉`,
    severity: 'success',
  });
