const ObjectsToCsv = require('objects-to-csv');

type PresaleEntry = {
  username: string;
  walletAddress: string;
};

export const makeCSV = async (presaleList: PresaleEntry[]) => {
  const csv = new ObjectsToCsv(presaleList);
  await csv.toDisk('./presale-entries.csv');
};
