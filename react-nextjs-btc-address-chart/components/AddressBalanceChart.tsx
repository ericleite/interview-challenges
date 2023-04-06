import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
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
  Legend,
  TimeScale
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        usePointStyle: true,
      },
      position: "top" as const,
    },
  },
  scales: {
    x: {
      type: "time" as const,
      time: {
        unit: "year" as const,
      },
    },
  },
};

interface Props {
  data: AddressBalanceChartData;
  height?: string;
}

export default function AddressBalanceChart({ data, height }: Props) {
  const chartData = useMemo(() => {
    return {
      labels: data?.labels || [],
      datasets: Object.entries(data?.columns || {}).map(([key, values]) => ({
        label: key,
        data: values,
        fill: false,
        pointStyle: false as const,
      })),
    };
  }, [data]);

  const containerStyle = useMemo(() => {
    return {
      height,
    };
  }, [height]);

  return (
    <div className={styles.container} style={containerStyle}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}
