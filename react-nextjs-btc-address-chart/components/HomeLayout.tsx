import { TimeUnit } from "chart.js";
import clsx from "clsx";
import React from "react";
import useSWR from "swr";
import { ApiEndpoints } from "types";
import { fetcher } from "utils";
import AddressBalanceChart from "./AddressBalanceChart";
import styles from "./HomeLayout.module.css";

const ALLOWED_TIME_UNITS: TimeUnit[] = ["year", "month", "week", "day"];

export default function HomeLayout() {
  const [timeUnit, setTimeUnit] = React.useState<TimeUnit>("year");

  // TODO: Make this a reusable hook
  const { data, error, isLoading } = useSWR(ApiEndpoints.BtcAddresses, fetcher);

  let content = <>Loading...</>;

  if (!isLoading) {
    if (error) {
      content = <>Oops, something went wrong.</>;
    } else {
      content = (
        <div className={styles.chartContainer}>
          <AddressBalanceChart data={data} height="500px" timeUnit={timeUnit} />
          <div className={styles.controls}>
            {ALLOWED_TIME_UNITS.map((unit) => (
              <button
                className={clsx(
                  styles.button,
                  timeUnit === unit && styles.active
                )}
                onClick={() => setTimeUnit(unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        </div>
      );
    }
  }

  return <section className={styles.container}>{content}</section>;
}
