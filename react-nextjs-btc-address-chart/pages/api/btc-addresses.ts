import { ALLOWED_BTC_ADDRESS_TIME_PERIODS } from "../../constants";
import { NextApiRequest, NextApiResponse } from "next";
import { BtcAddressChartData, BtcAddressesTimePeriod } from "types";
import { downsampleChartData, loadBtcAddressChartData } from "utils";

let chartDataCache: Record<BtcAddressesTimePeriod, BtcAddressChartData>;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { period } = req.query as { period: BtcAddressesTimePeriod };

  if (!period) {
    res.status(400).json({
      message: "Missing period query parameter.",
    });
    return;
  }

  if (!ALLOWED_BTC_ADDRESS_TIME_PERIODS.includes(period)) {
    res.status(400).json({
      message: `Invalid period. Must be one of [${ALLOWED_BTC_ADDRESS_TIME_PERIODS.join(
        "|"
      )}]`,
    });
    return;
  }

  if (!chartDataCache) {
    chartDataCache = {} as Record<BtcAddressesTimePeriod, BtcAddressChartData>;
  }

  try {
    if (!chartDataCache[period]) {
      const chartDataForPeriod = await loadBtcAddressChartData(period);
      const downsampledChartDataForPeriod =
        downsampleChartData(chartDataForPeriod);
      chartDataCache[period] = downsampledChartDataForPeriod;
    }
    res.status(200).json(chartDataCache[period]);
  } catch (error) {
    res.status(500).json({
      error,
      message: "Failed to load data.",
    });
  }
};
