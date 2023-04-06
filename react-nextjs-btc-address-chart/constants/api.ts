import { BtcAddressesTimePeriod } from "types";

export const ALLOWED_BTC_ADDRESS_TIME_PERIODS: BtcAddressesTimePeriod[] = [
  BtcAddressesTimePeriod.All,
  BtcAddressesTimePeriod.YTD,
  BtcAddressesTimePeriod["12M"],
  BtcAddressesTimePeriod["3M"],
  BtcAddressesTimePeriod["1M"],
];
