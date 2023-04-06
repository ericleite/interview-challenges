import { parse } from "csv-parse";
import fs from "fs";
import getConfig from "next/config";
import path from "path";
import { finished } from "stream/promises";
import { BtcAddressChartData, BtcAddressChartDataKey, ChartData } from "types";
// @ts-ignore - No types available for downsample-lttb
import downsampler from "downsample-lttb";

export const loadBtcAddressChartData = async () => {
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

  const sourceParser = fs.createReadStream(csvPath).pipe(
    parse({
      bom: true,
      columns: ["Time", ...Object.keys(data.columns)],
      delimiter: "\t",
      from: 2,
      relax_quotes: true,
    })
  );

  sourceParser.on("readable", () => {
    let record: any;
    while ((record = sourceParser.read()) !== null) {
      // Here we build out the data format required by chart library
      // Ideally, I would restructure this to be a single pass operation
      // However, due to the time constraint, we will have to make due with this
      // At least this O(n * m) operation is only done once due to caching
      data.labels.push(new Date(record.Time).getTime());

      Object.keys(data.columns).forEach((key) => {
        const dataKey = key as BtcAddressChartDataKey;
        data.columns[dataKey].push(record[dataKey]);
      });
    }
  });

  await finished(sourceParser);

  return data;
};

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
