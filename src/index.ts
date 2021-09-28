import { Client, Intents, MessageAttachment } from 'discord.js';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { makeCSV } from './makeCSV';
import {
  checkIfUserExists,
  getAddress,
  getPresaleList,
  removeAddress,
  upsertAddress,
} from './db';
import {
  allowDmEmbed,
  alreadyExistsEmbed,
  checkDmEmbed,
  doesNotExistEmbed,
  errorEmbed,
  helpEmbed,
  invalidFormatEmbed,
  onlyDmEmbed,
  successAddEmbed,
  successChangeEmbed,
  successRemoveEmbed,
  viewEmbed,
  welcomeEmbed,
} from './embeds';

config();

const client = new Client({
  intents: [
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  partials: ['CHANNEL', 'USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION'],
});

const SERVER_ID = '870075047543459871'; // testing
const FOUNDER_ROLE_NAME = 'Admins'; // testing
// const SERVER_ID = '883617950614061078'; // creepy creams
// const FOUNDER_ROLE_NAME = 'Founder'; // founders

const BOT_PREFIX = '!';

const ADD = 'add-wallet';
const CHANGE = 'change-wallet';
const DOWNLOAD = 'download-wallets';
const HELP = 'help';
const JOIN = 'join-presale';
const REMOVE = 'remove-wallet';
const VIEW = 'view-wallet';

const checkIfFounder = async (id: string) => {
  const guild = await client.guilds.fetch(SERVER_ID);
  const founders = guild.roles.cache
    .find(role => role.name === FOUNDER_ROLE_NAME)
    ?.members.map(member => member.id);

  return founders?.includes(id);
};

client.on('messageCreate', async message => {
  const { author, content, channel } = message;

  const { bot, discriminator, id, username } = author;

  if (bot) return;

  const fullUsername = `${username}#${discriminator}`;

  if (content.startsWith(BOT_PREFIX)) {
    const [command] = content.substring(1).split(' ');

    switch (command) {
      case ADD: {
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
              await upsertAddress(fullUsername, walletAddress);
              await channel.send({ embeds: [successAddEmbed] });
            } else {
              await channel.send({ embeds: [invalidFormatEmbed] });
            }
          }
        } catch (error) {
          await channel.send({ embeds: [errorEmbed] });
        }
        break;
      }
      case CHANGE: {
        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }
        const [, walletAddress] = content.substring(1).split(' ');

        const exists = await checkIfUserExists(fullUsername);
        if (exists) {
          if (ethers.utils.isAddress(walletAddress)) {
            await upsertAddress(fullUsername, walletAddress);
            await channel.send({ embeds: [successChangeEmbed] });
          } else {
            await channel.send({ embeds: [invalidFormatEmbed] });
          }
        } else {
          await channel.send({ embeds: [doesNotExistEmbed] });
        }
        break;
      }
      case REMOVE: {
        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }
        const exists = await checkIfUserExists(fullUsername);
        if (exists) {
          await removeAddress(fullUsername);
          await channel.send({ embeds: [successRemoveEmbed] });
        } else {
          await channel.send({ embeds: [doesNotExistEmbed] });
        }
        break;
      }
      case DOWNLOAD: {
        const isFounder = await checkIfFounder(id);

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
          } catch (error) {
            await channel.send({ embeds: [errorEmbed] });
          }
        } else {
          await channel.send({ embeds: [helpEmbed(isFounder)] });
        }
        break;
      }
      case HELP: {
        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }
        const isFounder = await checkIfFounder(id);
        await channel.send({ embeds: [helpEmbed(isFounder)] });
        break;
      }
      case JOIN: {
        if (channel.type === 'DM') {
          const isFounder = await checkIfFounder(id);
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
            await message.reply({ embeds: [errorEmbed] });
          }
        }
        break;
      }
      case VIEW: {
        if (channel.type !== 'DM') {
          await message.reply({ embeds: [onlyDmEmbed] });
          break;
        }
        try {
          const exists = await checkIfUserExists(fullUsername);
          if (exists) {
            const { walletAddress } = await getAddress(fullUsername);
            await channel.send({ embeds: [viewEmbed(walletAddress)] });
          } else {
            await channel.send({ embeds: [doesNotExistEmbed] });
          }
        } catch {
          await channel.send({ embeds: [errorEmbed] });
        }
        break;
      }
      default: {
        const isFounder = await checkIfFounder(id);
        await channel.send({ embeds: [helpEmbed(isFounder)] });
        break;
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
