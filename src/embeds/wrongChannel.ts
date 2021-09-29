import { Channel } from 'discord.js';
import { embedFactory } from './embedFactory';

export const wrongChannelEmbed = (presaleChannel: Channel) =>
  embedFactory({
    description: `Please use the ${presaleChannel} channel or DM to interact with me!`,
    severity: 'warn',
    title: 'Wrong channel  ⚠️',
  });
