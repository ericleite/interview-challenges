export enum BtcAddressBalanceChartDataKey {
  CountWithBalanceOf1000 = "count_with_balance_of_1000",
  CountWithBalanceOf10000 = "count_with_balance_of_10000",
  CountWithBalanceOf100000 = "count_with_balance_of_100000",
  CountWithBalanceOf1000000 = "count_with_balance_of_1000000",
  CountWithBalanceOf10000000 = "count_with_balance_of_10000000",
  Date = "date",
}

export interface BtcAddressBalanceChartDataPoint {
  [BtcAddressBalanceChartDataKey.CountWithBalanceOf1000]: number;
  [BtcAddressBalanceChartDataKey.CountWithBalanceOf10000]: number;
  [BtcAddressBalanceChartDataKey.CountWithBalanceOf100000]: number;
  [BtcAddressBalanceChartDataKey.CountWithBalanceOf1000000]: number;
  [BtcAddressBalanceChartDataKey.CountWithBalanceOf10000000]: number;
  [BtcAddressBalanceChartDataKey.Date]: string;
}

export type BtcAddressBalanceChartData = BtcAddressBalanceChartDataPoint[];
