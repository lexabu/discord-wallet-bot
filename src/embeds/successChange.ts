import { embedFactory } from './embedFactory';

export const successChangeEmbed = embedFactory({
  description: 'Successfully changed your wallet address!',
  severity: 'success',
  title: 'Changed ✅',
});
