import { Datastore } from '@google-cloud/datastore';
import { config } from 'dotenv';
import * as Sentry from '@sentry/node';

config();

type PresaleEntry = {
  discordUsername: string;
  walletAddress: string;
};

const GOOGLE_CLOUD_PRIVATE_KEY = process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(
  /\\n/gm,
  '\n',
);

const datastore = new Datastore({
  projectId: 'sprinkles-327416',
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: GOOGLE_CLOUD_PRIVATE_KEY,
  },
});

export const addWalletAddress = async (
  username: string,
  walletAddress: string,
) => {
  const kind = 'creepy-creams-2';

  const key = datastore.key([kind]);

  const presaleEntry = {
    key,
    data: {
      discordUsername: username,
      walletAddress,
    },
  };

  try {
    const [response] = await datastore.save(presaleEntry);

    return response;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'addWalletAddress',
        discordUsername: username,
        walletAddress,
      },
    });
  }
};

export const changeWalletAddress = async (
  username: string,
  walletAddress: string,
) => {
  const query = datastore
    .createQuery('creepy-creams-2')
    .filter('discordUsername', '=', username);

  const [result] = await datastore.runQuery(query);

  const presaleEntry = {
    key: result[0][datastore.KEY],
    data: {
      discordUsername: username,
      walletAddress,
    },
  };

  try {
    const [response] = await datastore.update(presaleEntry);
    return response;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'addWalletAddress',
        username,
        walletAddress,
      },
    });
  }
};

export async function getWalletAddress(username: string): Promise<string> {
  try {
    const query = datastore
      .createQuery('creepy-creams-2')
      .filter('discordUsername', '=', username);

    const [results] = await datastore.runQuery(query);

    const [presaleEntry] = results;

    if (presaleEntry) {
      return presaleEntry.walletAddress;
    }

    throw new Error('address not found');
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'getWalletAddress',
        username,
      },
    });
  }
}

export async function getPresaleList(): Promise<PresaleEntry[]> {
  try {
    const query = datastore.createQuery('creepy-creams-2');

    const [results] = await datastore.runQuery(query);

    return results.map(({ discordUsername, walletAddress }) => ({
      discordUsername,
      walletAddress,
    }));
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'getPresaleList',
      },
    });
  }
}

export async function checkIfUserExists(username: string): Promise<boolean> {
  try {
    const query = datastore
      .createQuery('creepy-creams-2')
      .filter('discordUsername', '=', username);

    const [result] = await datastore.runQuery(query);

    return !!result.length;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'checkIfUserExists',
        fetchedUsername: username,
      },
    });
  }
}

export const removeAddress = async (username: string) => {
  try {
    const query = datastore
      .createQuery('creepy-creams-2')
      .filter('discordUsername', '=', username);

    const [result] = await datastore.runQuery(query);

    await datastore.delete(result[0][datastore.KEY]);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'removeAddress',
        username,
      },
    });
  }
};
