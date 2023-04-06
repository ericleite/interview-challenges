import { ChartData } from "./api";

export enum BtcAddressChartDataKey {
  Count1K = "1K",
  Count10K = "10K",
  Count100K = "100K",
  Count1M = "1M",
  Count10M = "10M",
}

export interface BtcAddressChartData extends ChartData {
  columns: Record<BtcAddressChartDataKey, number[]>;
}
