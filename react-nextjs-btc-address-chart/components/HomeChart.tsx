import { TimeUnit } from "chart.js";
import clsx from "clsx";
import React from "react";
import useSWR from "swr";
import { ApiEndpoints, BtcAddressesTimePeriod } from "types";
import { fetcher } from "utils";
import { ALLOWED_BTC_ADDRESS_TIME_PERIODS } from "../constants";
import AddressBalanceChart from "./AddressBalanceChart";
import styles from "./HomeChart.module.css";

const PERIOD_TO_TIME_UNIT: Record<BtcAddressesTimePeriod | string, TimeUnit> = {
  [BtcAddressesTimePeriod.All]: "year",
  [BtcAddressesTimePeriod.YTD]: "week", // TODO: Use "month" if > 3 months left in year (or "day" if > 1 month left in year)
  [BtcAddressesTimePeriod["12M"]]: "month",
  [BtcAddressesTimePeriod["3M"]]: "week",
  [BtcAddressesTimePeriod["1M"]]: "day",
};

export default function HomeChart() {
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<BtcAddressesTimePeriod>(BtcAddressesTimePeriod.All);
  const selectedTimeUnit = PERIOD_TO_TIME_UNIT[selectedPeriod];

  // TODO: Make this a reusable hook
  const { data, error, isLoading } = useSWR(
    `${ApiEndpoints.BtcAddresses}?period=${selectedPeriod}`,
    fetcher
  );

  let content = null;

  if (!data) {
    if (isLoading) {
      content = (
        <div className={clsx(styles.content, styles.overlay)}>Loading...</div>
      );
    } else if (error) {
      content = (
        <div className={clsx(styles.content, styles.overlay)}>
          Oops, something went wrong.
        </div>
      );
    }
  } else {
    content = (
      <AddressBalanceChart
        className={styles.content}
        data={data}
        timeUnit={selectedTimeUnit}
      />
    );
  }

  return (
    <div className={styles.container}>
      {content}
      <div className={styles.controls}>
        {ALLOWED_BTC_ADDRESS_TIME_PERIODS.map((period) => {
          return (
            <button
              key={period}
              className={clsx(
                styles.button,
                period === selectedPeriod && styles.active
              )}
              onClick={() => setSelectedPeriod(period)}
            >
              {period}
            </button>
          );
        })}
      </div>
    </div>
  );
}
