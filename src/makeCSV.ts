const ObjectsToCsv = require('objects-to-csv');

type PresaleEntry = {
  id: string;
  username: string;
  walletAddress: string;
};

export const makeCSV = async (presaleList: PresaleEntry[]) => {
  const csv = new ObjectsToCsv(presaleList);
  await csv.toDisk('./presale-entries.csv');
};
