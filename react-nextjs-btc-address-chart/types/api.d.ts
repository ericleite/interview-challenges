export enum ApiEndpoints {
  BtcAddresses = "/api/btc-addresses",
}

export enum BtcAddressesTimePeriod {
  All = "all",
  YTD = "ytd",
  "12M" = "12m",
  "3M" = "3m",
  "1M" = "1m",
}

export interface ChartData {
  labels: number[];
  columns: Record<string, number[]>;
}
