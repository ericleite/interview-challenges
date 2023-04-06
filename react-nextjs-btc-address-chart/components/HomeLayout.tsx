import React from "react";
import useSWR from "swr";
import { ApiEndpoints } from "types";
import { fetcher } from "utils";
import AddressBalanceChart from "./AddressBalanceChart";
import styles from "./HomeLayout.module.css";

export default function HomeLayout() {
  // TODO: Make this a reusable hook
  const { data, error, isLoading } = useSWR(ApiEndpoints.BtcAddresses, fetcher);

  let content = <>Loading...</>;

  if (!isLoading) {
    if (error) {
      content = <>Oops, something went wrong.</>;
    } else {
      content = <AddressBalanceChart data={data} height="500px" />;
    }
  }

  return <section className={styles.container}>{content}</section>;
}
