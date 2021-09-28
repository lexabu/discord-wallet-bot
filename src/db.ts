import { DeleteResult, MongoClient, UpdateResult } from 'mongodb';
import { config } from 'dotenv';

config();

type PresaleEntry = {
  _id: string;
  username: string;
  walletAddress: string;
};

const uri = process.env.MONGO_DB_URI as string;

const mongoDBClient = new MongoClient(uri);

export async function getAddress(username: string): Promise<PresaleEntry> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection<PresaleEntry>('presale-entries');

    return entries.findOne({ username });
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPresaleList(): Promise<PresaleEntry[]> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection<PresaleEntry>('presale-entries');

    return entries.find({}).project<PresaleEntry>({ _id: 0 }).toArray();
  } catch (error) {
    throw new Error(error);
  }
}

export async function checkIfUserExists(username: string): Promise<number> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection('presale-entries');

    return entries.find({ username }).count();
  } catch (error) {
    throw new Error(error);
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

    return entries.updateOne(
      { username },
      { $set: { username, walletAddress } },
      { upsert: true },
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function removeAddress(username: string): Promise<DeleteResult> {
  try {
    await mongoDBClient.connect();
    const database = mongoDBClient.db('wallet-bot');
    const entries = database.collection('presale-entries');

    return entries.deleteOne({
      username,
    });
  } catch (error) {
    throw new Error(error);
  }
}
