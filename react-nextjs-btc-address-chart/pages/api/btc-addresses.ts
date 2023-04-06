import { NextApiRequest, NextApiResponse } from "next";
import { BtcAddressChartData, BtcAddressChartDataKey } from "types";
import { downsampleChartData, loadBtcAddressChartData } from "utils";

let chartDataCache: BtcAddressChartData = {
  labels: [],
  columns: {
    [BtcAddressChartDataKey.Count1K]: [],
    [BtcAddressChartDataKey.Count10K]: [],
    [BtcAddressChartDataKey.Count100K]: [],
    [BtcAddressChartDataKey.Count1M]: [],
    [BtcAddressChartDataKey.Count10M]: [],
  },
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!chartDataCache.labels.length) {
      const chartData = await loadBtcAddressChartData();
      const downsampledChartData = downsampleChartData(chartData);
      chartDataCache = downsampledChartData;
    }
    res.status(200).json(chartDataCache);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Failed to load data.",
    });
  }
};
