export enum AddressBalanceChartDataKey {
  Count1K = "1K",
  Count10K = "10K",
  Count100K = "100K",
  Count1M = "1M",
  Count10M = "10M",
}

export type AddressBalanceChartData = {
  columns: {
    [AddressBalanceChartDataKey.Count1K]: number[];
    [AddressBalanceChartDataKey.Count10K]: number[];
    [AddressBalanceChartDataKey.Count100K]: number[];
    [AddressBalanceChartDataKey.Count1M]: number[];
    [AddressBalanceChartDataKey.Count10M]: number[];
  };
  labels: number[];
};
