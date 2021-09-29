import { Client, Intents, MessageAttachment } from 'discord.js';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import * as Sentry from '@sentry/node';
import { makeCSV } from './makeCSV';
import {
  addWalletAddress,
  changeWalletAddress,
  checkIfUserExists,
  getPresaleList,
  getWalletAddress,
  removeAddress,
} from './db';
import {
  allowDmEmbed,
  alreadyExistsEmbed,
  checkDmEmbed,
  doesNotExistEmbed,
  errorEmbed,
  helpEmbed,
  invalidFormatEmbed,
  joinPresaleEmbed,
  onlyDmEmbed,
  successAddEmbed,
  successChangeEmbed,
  successRemoveEmbed,
  viewEmbed,
  welcomeEmbed,
  wrongChannelEmbed,
} from './embeds';

config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

const client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE'],
});

const SERVER_ID = process.env.CREEPY_CREAMS_SERVER_ID;
const PRESALE_CHANNEL_ID = process.env.PRESALE_CHANNEL_ID;
const PRESALE_ROLES = ['OG Sundae', 'Presale Cream'];

const BOT_PREFIX = '!';

const ADD = 'add-wallet';
const CHANGE = 'change-wallet';
const DOWNLOAD = 'download-wallets';
const HELP = 'help';
const JOIN = 'join-presale';
const REMOVE = 'remove-wallet';
const START = 'start-presale';
const VIEW = 'view-wallet';

const checkIfAdmin = async (id: string) => {
  const guild = await client.guilds.fetch(SERVER_ID);
  const founders =
    guild.roles.cache
      .find(role => role.name === 'Founder')
      ?.members.map(member => member.id) || [];

  const devs =
    guild.roles.cache
      .find(role => role.name === 'Demonic Devs')
      ?.members.map(member => member.id) || [];

  return [...founders, ...devs]?.includes(id);
};

const checkIfEligibleForPresale = async (id: string) => {
  const guild = await client.guilds.fetch(SERVER_ID);
  const eligiblePresaleMembers = guild.roles.cache
    .find(role => PRESALE_ROLES.includes(role.name))
    ?.members.map(member => member.id);

  return eligiblePresaleMembers?.includes(id);
};

client.on('messageCreate', async message => {
  const presaleChannel = await client.channels.fetch(PRESALE_CHANNEL_ID);

  const { author, content, channel } = message;

  const { bot, discriminator, id, username } = author;

  const isEligibleForPresale = checkIfEligibleForPresale(id);

  if (bot || !isEligibleForPresale) return;

  const fullUsername = `${username}#${discriminator}`;

  if (content.startsWith(BOT_PREFIX)) {
    const [command] = content.substring(1).split(' ');

    switch (command) {
      case START: {
        const isFounder = await checkIfAdmin(id);
        if (
          isFounder &&
          channel.id === PRESALE_CHANNEL_ID &&
          channel.type !== 'DM'
        ) {
          await channel.send({ embeds: [joinPresaleEmbed] });
        }
        break;
      }
      case ADD: {
        if (channel.id !== PRESALE_CHANNEL_ID && channel.type !== 'DM') {
          await message.reply({ embeds: [wrongChannelEmbed(presaleChannel)] });
          break;
        }

        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }

        const [, walletAddress] = content.substring(1).split(' ');

        try {
          const exists = await checkIfUserExists(fullUsername);
          if (exists) {
            await channel.send({ embeds: [alreadyExistsEmbed] });
          } else {
            if (ethers.utils.isAddress(walletAddress)) {
              await addWalletAddress(fullUsername, walletAddress);
              await channel.send({ embeds: [successAddEmbed] });
            } else {
              await channel.send({ embeds: [invalidFormatEmbed] });
            }
          }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              command: ADD,
              discordUsername: fullUsername,
            },
          });
          await channel.send({ embeds: [errorEmbed] });
        }
        break;
      }
      case CHANGE: {
        if (channel.id !== PRESALE_CHANNEL_ID && channel.type !== 'DM') {
          await message.reply({ embeds: [wrongChannelEmbed(presaleChannel)] });
          break;
        }

        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }

        const [, walletAddress] = content.substring(1).split(' ');

        try {
          const exists = await checkIfUserExists(fullUsername);
          if (exists) {
            if (ethers.utils.isAddress(walletAddress)) {
              await changeWalletAddress(fullUsername, walletAddress);
              await channel.send({ embeds: [successChangeEmbed] });
            } else {
              await channel.send({ embeds: [invalidFormatEmbed] });
            }
          } else {
            await channel.send({ embeds: [doesNotExistEmbed] });
          }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              command: CHANGE,
              discordUsername: fullUsername,
            },
          });
        }
        break;
      }
      case DOWNLOAD: {
        const isFounder = await checkIfAdmin(id);

        if (isFounder) {
          try {
            const presaleList = await getPresaleList();
            await makeCSV(presaleList);
            const entries = new MessageAttachment('./presale-entries.csv');

            await channel.send({
              files: [entries],
              content:
                'Here is a CSV of the wallet addresses on the presale list!',
            });
            Sentry.captureMessage('download');
          } catch (error) {
            Sentry.captureException(error, {
              tags: {
                command: DOWNLOAD,
                discordUsername: fullUsername,
              },
            });
            await channel.send({ embeds: [errorEmbed] });
          }
        } else {
          await channel.send({ embeds: [helpEmbed(isFounder)] });
        }
        break;
      }
      case HELP: {
        if (channel.id !== PRESALE_CHANNEL_ID && channel.type !== 'DM') {
          await message.reply({ embeds: [wrongChannelEmbed(presaleChannel)] });
          break;
        }

        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }

        const isFounder = await checkIfAdmin(id);
        await channel.send({ embeds: [helpEmbed(isFounder)] });
        break;
      }
      case JOIN: {
        if (channel.id !== PRESALE_CHANNEL_ID && channel.type !== 'DM') {
          await message.reply({ embeds: [wrongChannelEmbed(presaleChannel)] });
          break;
        }

        if (channel.type === 'DM') {
          const isFounder = await checkIfAdmin(id);
          await channel.send({ embeds: [helpEmbed(isFounder)] });
          break;
        }
        const user = await client.users.fetch(id);
        try {
          await user.send({ embeds: [welcomeEmbed] });
          await message.reply({ embeds: [checkDmEmbed] });
        } catch (error) {
          if (error.code === 50007) {
            await message.reply({ embeds: [allowDmEmbed] });
          } else {
            Sentry.captureException(error, {
              tags: {
                command: JOIN,
                discordUsername: fullUsername,
              },
            });
            await message.reply({ embeds: [errorEmbed] });
          }
        }
        break;
      }
      case REMOVE: {
        if (channel.id !== PRESALE_CHANNEL_ID && channel.type !== 'DM') {
          await message.reply({ embeds: [wrongChannelEmbed(presaleChannel)] });
          break;
        }

        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }

        try {
          const exists = await checkIfUserExists(fullUsername);
          if (exists) {
            await removeAddress(fullUsername);
            await channel.send({ embeds: [successRemoveEmbed] });
          } else {
            await channel.send({ embeds: [doesNotExistEmbed] });
          }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              command: REMOVE,
              discordUsername: fullUsername,
            },
          });
        }
        break;
      }
      case VIEW: {
        if (channel.id !== PRESALE_CHANNEL_ID && channel.type !== 'DM') {
          await message.reply({ embeds: [wrongChannelEmbed(presaleChannel)] });
          break;
        }

        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }

        try {
          const exists = await checkIfUserExists(fullUsername);
          if (exists) {
            const walletAddress = await getWalletAddress(fullUsername);
            await channel.send({ embeds: [viewEmbed(walletAddress)] });
          } else {
            await channel.send({ embeds: [doesNotExistEmbed] });
          }
        } catch (error) {
          Sentry.captureException(error, {
            tags: {
              command: VIEW,
              discordUsername: fullUsername,
            },
          });
          await channel.send({ embeds: [errorEmbed] });
        }
        break;
      }
      default: {
        if (channel.id === PRESALE_CHANNEL_ID || channel.type === 'DM') {
          const isFounder = await checkIfAdmin(id);
          await channel.send({ embeds: [helpEmbed(isFounder)] });
        }
        break;
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
