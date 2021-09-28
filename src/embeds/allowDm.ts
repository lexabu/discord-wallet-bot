import { embedFactory } from './embedFactory';

export const allowDmEmbed = embedFactory({
  description: `Whoops! Our bot is trying to message you. Turn on the setting to allow DMs by right-clicking the server icon -> Privacy Settings -> Allow direct messages from server members.

  After making this change, try sending \`!join-presale\` again.

  You can turn this setting off once you join the presale.`,
  severity: 'warn',
  title: 'Allow DMs from this server  😬',
});
