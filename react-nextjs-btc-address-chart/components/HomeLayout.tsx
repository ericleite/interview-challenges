import { TimeUnit } from "chart.js";
import clsx from "clsx";
import { ALLOWED_BTC_ADDRESS_TIME_PERIODS } from "../constants";
import React from "react";
import useSWR from "swr";
import { ApiEndpoints, BtcAddressesTimePeriod } from "types";
import { fetcher } from "utils";
import AddressBalanceChart from "./AddressBalanceChart";
import styles from "./HomeLayout.module.css";

const PERIOD_TO_TIME_UNIT: Record<BtcAddressesTimePeriod | string, TimeUnit> = {
  [BtcAddressesTimePeriod.All]: "year",
  [BtcAddressesTimePeriod.YTD]: "week", // TODO: Use "month" if > 3 months left in year (or "day" if > 1 month left in year)
  [BtcAddressesTimePeriod["12M"]]: "month",
  [BtcAddressesTimePeriod["3M"]]: "week",
  [BtcAddressesTimePeriod["1M"]]: "day",
};

export default function HomeLayout() {
  const [selectedPeriod, setSelectedPeriod] =
    React.useState<BtcAddressesTimePeriod>(BtcAddressesTimePeriod.All);
  const selectedTimeUnit = PERIOD_TO_TIME_UNIT[selectedPeriod];

  // TODO: Make this a reusable hook
  const { data, error, isLoading } = useSWR(
    `${ApiEndpoints.BtcAddresses}?period=${selectedPeriod}`,
    fetcher
  );

  let content = <>Loading...</>;

  if (!isLoading) {
    if (error) {
      content = <>Oops, something went wrong.</>;
    } else {
      content = (
        <div className={styles.chartContainer}>
          <AddressBalanceChart
            data={data}
            height="500px"
            timeUnit={selectedTimeUnit}
          />
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
  }

  return <section className={styles.container}>{content}</section>;
}
