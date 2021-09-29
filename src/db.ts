import { DeleteResult, MongoClient, UpdateResult } from 'mongodb';
import { config } from 'dotenv';
import * as Sentry from '@sentry/node';

config();

type PresaleEntry = {
  _id: string;
  username: string;
  walletAddress: string;
};

const uri = process.env.MONGO_DB_URI;

const mongoDBClient = new MongoClient(uri);

export async function getAddress(username: string): Promise<PresaleEntry> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection<PresaleEntry>('presale-entries');

    await mongoDBClient.close();
    return entries.findOne({ username });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'getAddress',
        username,
      },
    });
  }
}

export async function getPresaleList(): Promise<PresaleEntry[]> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection<PresaleEntry>('presale-entries');

    await mongoDBClient.close();
    return entries.find({}).project<PresaleEntry>({ _id: 0 }).toArray();
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
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection('presale-entries');

    const count = await entries.find({ username }).count();

    await mongoDBClient.close();
    return !!count;
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'checkIfUserExists',
        fetchedUsername: username,
      },
    });
  }
}

export async function upsertAddress(
  username: string,
  walletAddress: string,
): Promise<UpdateResult> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection('presale-entries');

    await mongoDBClient.close();
    return entries.updateOne(
      { username },
      { $set: { username, walletAddress } },
      { upsert: true },
    );
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'upsertAddress',
        username,
        walletAddress,
      },
    });
  }
}

export async function removeAddress(username: string): Promise<DeleteResult> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection('presale-entries');

    await mongoDBClient.close();
    return entries.deleteOne({
      username,
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        command: 'removeAddress',
        username,
      },
    });
  }
}
