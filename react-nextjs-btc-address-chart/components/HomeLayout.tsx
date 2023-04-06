import React from "react";
import useSWR from "swr";
import { ApiEndpoints } from "types";
import { fetcher } from "utils";
import AddressBalanceChart from "./AddressBalanceChart";
import styles from "./HomeLayout.module.css";

export default function HomeLayout() {
  // TODO: Make this a reusable hook
  const { data, error, isLoading } = useSWR(ApiEndpoints.BtcAddresses, fetcher);

  return (
    <section className={styles.container}>
      <AddressBalanceChart data={data} height="500px" />
    </section>
  );
}
