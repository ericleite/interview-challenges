import { parse } from "csv-parse";
import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import path from "path";
import { finished } from "stream/promises";

import {
  BtcAddressBalanceChartData,
  BtcAddressBalanceChartDataKey,
  BtcAddressBalanceChartDataPoint,
} from "types";

const cachedData: BtcAddressBalanceChartData = [];

const loadData = async () => {
  if (cachedData.length) {
    return cachedData;
  }

  const csvPath = path.join(
    getConfig().serverRuntimeConfig.ROOT_DIR,
    "data/Coin_Metrics_Network_Data_2023-02-02T14-32.csv"
  );

  const sourceParser = fs.createReadStream(csvPath).pipe(
    parse({
      bom: true,
      columns: [
        BtcAddressBalanceChartDataKey.Date,
        BtcAddressBalanceChartDataKey.CountWithBalanceOf1000,
        BtcAddressBalanceChartDataKey.CountWithBalanceOf10000,
        BtcAddressBalanceChartDataKey.CountWithBalanceOf100000,
        BtcAddressBalanceChartDataKey.CountWithBalanceOf1000000,
        BtcAddressBalanceChartDataKey.CountWithBalanceOf10000000,
      ],
      delimiter: "\t",
      from: 2,
      relax_quotes: true,
    })
  );

  sourceParser.on("readable", () => {
    let record: BtcAddressBalanceChartDataPoint;
    while ((record = sourceParser.read()) !== null) {
      cachedData.push(record);
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
