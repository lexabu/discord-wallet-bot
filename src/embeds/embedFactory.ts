import { MessageEmbed } from 'discord.js';

const ERROR_HEX = '#c9184a';
const SUCCESS_HEX = '#2a9d8f';
const WARN_HEX = '#fcbf49';
const DEFAULT_HEX = '#7289da';

type EmbedSeverity = 'error' | 'success' | 'warn';

type Embed = {
  description: string;
  title?: string;
  severity: EmbedSeverity;
};

const getColor = severity => {
  switch (severity) {
    case 'error': {
      return ERROR_HEX;
    }
    case 'success': {
      return SUCCESS_HEX;
    }
    case 'warn': {
      return WARN_HEX;
    }
    default: {
      return DEFAULT_HEX;
    }
  }
};

export const embedFactory = ({ description, severity, title = '' }: Embed) =>
  new MessageEmbed()
    .setColor(getColor(severity))
    .setTitle(title)
    .setDescription(description);
