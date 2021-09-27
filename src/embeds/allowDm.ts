import { MessageEmbed } from 'discord.js';

export const allowDmEmbed = new MessageEmbed()
  .setColor('#e76f51')
  .setTitle('Allow DMs from this server')
  .setDescription(
    `Turn on the setting to allow DMs by navigating to \`\`Privacy Settings > Direct Messages > Allow direct messages from server members\`\` `,
  );
