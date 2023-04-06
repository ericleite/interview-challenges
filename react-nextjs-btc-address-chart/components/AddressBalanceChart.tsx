import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { AddressBalanceChartData } from "types";
import styles from "./AddressBalanceChart.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
    },
  },
};

interface Props {
  data: AddressBalanceChartData;
}

export default function AddressBalanceChart({ data }: Props) {
  const chartData = useMemo(() => {
    return {
      labels: data?.labels || [],
      datasets: Object.entries(data?.columns || {}).map(([key, values]) => ({
        label: key,
        data: values,
        fill: false,
      })),
    };
  }, [data]);

  return (
    <div className={styles.container}>
      <Line options={options} data={chartData} />
    </div>
  );
}
