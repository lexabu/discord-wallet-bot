import { embedFactory } from './embedFactory';

export const onlyDmEmbed = embedFactory({
  description:
    'This channel is only for summoning the bot to DM you. Please only use the `!join-presale` command here.',
  severity: 'error',
  title: 'Whoa there ✋',
});
