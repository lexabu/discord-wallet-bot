import { Client, Intents, MessageAttachment } from 'discord.js';
import { config } from 'dotenv';
import { ethers } from 'ethers';
import { makeCSV } from './makeCSV';
import {
  checkIfUserExists,
  deleteAddress,
  getAddress,
  getPresaleList,
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
  successAddEmbed,
  successChangeEmbed,
  successDeleteEmbed,
  viewEmbed,
  welcomeEmbed,
} from './embeds';

config();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
  partials: ['CHANNEL'],
});

const BOT_PREFIX = '!';

const ADD = 'add-wallet';
const CHANGE = 'change-wallet';
const DELETE = 'delete-wallet';
const DOWNLOAD = 'download-wallets';
const HELP = 'help';
const JOIN = 'join-presale';
const VIEW = 'view-wallet';

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
      case DELETE: {
        const exists = await checkIfUserExists(fullUsername);
        if (exists) {
          await deleteAddress(fullUsername);
          await channel.send({ embeds: [successDeleteEmbed] });
        } else {
          await channel.send({ embeds: [doesNotExistEmbed] });
        }
        break;
      }
      case DOWNLOAD: {
        const founders = message.guild.roles.cache
          .find(role => role.name === 'Admins')
          .members.map(member => member.id);

        if (founders.includes(id)) {
          try {
            const presaleList = await getPresaleList();
            await makeCSV(presaleList);
            const entries = new MessageAttachment('./presale-entries.csv');

            await channel.send({ files: [entries] });
          } catch (error) {
            await channel.send({ embeds: [errorEmbed] });
          }
        } else {
          await channel.send('you do not have permissions');
        }
        break;
      }
      case HELP: {
        await channel.send({ embeds: [helpEmbed] });
        break;
      }
      case JOIN: {
        const user = await client.users.fetch(id);
        try {
          await user.send({ embeds: [welcomeEmbed] });
          await channel.send(`${checkDmEmbed(user)}`);
        } catch (error) {
          if (error.code === 50007) {
            await user.send({ embeds: [allowDmEmbed] });
          } else {
            await user.send({ embeds: [errorEmbed] });
          }
        }
        break;
      }
      case VIEW: {
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
        await channel.send({ embeds: [helpEmbed] });
        break;
      }
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
