import { parse } from "csv-parse";
import fs from "fs";
import getConfig from "next/config";
import path from "path";
import { finished } from "stream/promises";
import {
  BtcAddressChartData,
  BtcAddressChartDataKey,
  BtcAddressesTimePeriod,
  ChartData,
} from "types";
// @ts-ignore - No types available for downsample-lttb
import downsampler from "downsample-lttb";

export const downsampleChartData = (
  data: ChartData,
  maxDataPoints: number = 1000
) => {
  const downsampledData: ChartData = {
    labels: [],
    columns: {},
  };

  Object.keys(data.columns).forEach((key) => {
    const processedData: [number, number][] = downsampler.processData(
      data.columns[key].map((y, i) => [data.labels[i], y]),
      maxDataPoints
    );
    downsampledData.columns[key] = processedData.map(([, y]) => Math.round(y));
    downsampledData.labels = processedData.map(([x]) => x);
  });

  return downsampledData;
};

export const fetcher = (...args: any) =>
  fetch.apply(null, args).then((res) => res.json());

export const loadBtcAddressChartData = async (
  period: BtcAddressesTimePeriod
) => {
  const data: BtcAddressChartData = {
    labels: [],
    columns: {
      [BtcAddressChartDataKey.Count1K]: [],
      [BtcAddressChartDataKey.Count10K]: [],
      [BtcAddressChartDataKey.Count100K]: [],
      [BtcAddressChartDataKey.Count1M]: [],
      [BtcAddressChartDataKey.Count10M]: [],
    },
  };

  const csvPath = path.join(
    getConfig().serverRuntimeConfig.ROOT_DIR,
    "data/Coin_Metrics_Network_Data_2023-02-02T14-32.csv"
  );
  const timeColumnKey = "Time";

  const sourceParser = fs.createReadStream(csvPath).pipe(
    parse({
      bom: true,
      columns: [timeColumnKey, ...Object.keys(data.columns)],
      delimiter: "\t",
      from: 2,
      on_record: (record) => {
        return getBtcAddressChartStartTime(period) <
          new Date(record[timeColumnKey]).getTime()
          ? record
          : null;
      },
      relax_quotes: true,
    })
  );

  sourceParser.on("readable", () => {
    let record: any;
    while ((record = sourceParser.read()) !== null) {
      data.labels.push(new Date(record[timeColumnKey]).getTime());
      Object.keys(data.columns).forEach((key) => {
        const dataKey = key as BtcAddressChartDataKey;
        data.columns[dataKey].push(record[dataKey]);
      });
    }
  });

  await finished(sourceParser);

  return data;
};

export const getBtcAddressChartStartTime = (period: BtcAddressesTimePeriod) => {
  // Hard coding this since the CSV data is statically defined from this date. Ideally, this would be determined dynamically.
  const today = new Date("2023-02-01");

  switch (period) {
    case BtcAddressesTimePeriod.All:
      return 0;

    case BtcAddressesTimePeriod.YTD:
      return new Date(today.getFullYear(), 0, 1).getTime();

    case BtcAddressesTimePeriod["12M"]:
      return today.getTime() - 1000 * 60 * 60 * 24 * 365;

    case BtcAddressesTimePeriod["3M"]:
      return today.getTime() - 1000 * 60 * 60 * 24 * 90;

    case BtcAddressesTimePeriod["1M"]:
      return today.getTime() - 1000 * 60 * 60 * 24 * 30;

    default:
      return 0;
  }
};
