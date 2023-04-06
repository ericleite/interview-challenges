import { parse } from "csv-parse";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import path from "path";
import { finished } from "stream/promises";

import { AddressBalanceChartData, AddressBalanceChartDataKey } from "types";

const cachedData: AddressBalanceChartData = {
  labels: [],
  columns: {
    [AddressBalanceChartDataKey.Count1K]: [],
    [AddressBalanceChartDataKey.Count10K]: [],
    [AddressBalanceChartDataKey.Count100K]: [],
    [AddressBalanceChartDataKey.Count1M]: [],
    [AddressBalanceChartDataKey.Count10M]: [],
  },
};

const loadData = async () => {
  if (cachedData.labels.length) {
    return cachedData;
  }

  const csvPath = path.join(
    getConfig().serverRuntimeConfig.ROOT_DIR,
    "data/Coin_Metrics_Network_Data_2023-02-02T14-32.csv"
  );

  const sourceParser = fs.createReadStream(csvPath).pipe(
    parse({
      bom: true,
      columns: ["Time", ...Object.keys(cachedData.columns)],
      delimiter: "\t",
      from: 2,
      relax_quotes: true,
    })
  );

  sourceParser.on("readable", () => {
    let record: any;
    while ((record = sourceParser.read()) !== null) {
      // Here we build out the data format required by chart library
      // Ideally, I would have used a different library that doesn't require this format
      // However, due to the time constraint, we will have to make due with this
      // At least this O(n * m) operation is only done once due to caching
      cachedData.labels.push(record.Time);

      Object.keys(cachedData.columns).forEach((key) => {
        const dataKey = key as AddressBalanceChartDataKey;
        cachedData.columns[dataKey].push(record[dataKey]);
      });
    }
  });

  await finished(sourceParser);

  return cachedData;
};

export default async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await loadData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Failed to load data.",
    });
  }
};
