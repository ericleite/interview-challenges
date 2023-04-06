import React from "react";
import styles from "./HomeLayout.module.css";
import HomeChart from "./HomeChart";

export default function HomeLayout() {
  return (
    <section className={styles.container}>
      <HomeChart />
    </section>
  );
}
