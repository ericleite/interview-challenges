import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeScale,
  TimeUnit,
  Title,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { BtcAddressChartData } from "types";
import { DEFAULT_LINE_CHART_OPTIONS } from "../constants";
import styles from "./AddressBalanceChart.module.css";
import clsx from "clsx";

ChartJS.register(
  CategoryScale,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip
);

// TODO: Generate these dynamically
const COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
];

interface Props {
  className?: string;
  data: BtcAddressChartData;
  height?: string;
  timeUnit?: TimeUnit;
}

export default function AddressBalanceChart({
  className,
  data,
  timeUnit,
}: Props) {
  const chartData = useMemo(() => {
    return {
      labels: data?.labels || [],
      datasets: Object.entries(data?.columns || {}).map(
        ([key, values], index) => ({
          label: `>$${key}`,
          data: values,
          fill: false,
          pointStyle: false as const,
          borderColor: COLORS[index % COLORS.length],
          borderWidth: 2,
        })
      ),
    };
  }, [data]);

  const chartOptions = useMemo(() => {
    return {
      ...DEFAULT_LINE_CHART_OPTIONS,
      scales: {
        ...DEFAULT_LINE_CHART_OPTIONS.scales,
        x: {
          ...DEFAULT_LINE_CHART_OPTIONS.scales.x,
          time: {
            unit: timeUnit,
          },
        },
      },
    };
  }, [timeUnit]);

  return (
    <div className={clsx(styles.container, className)}>
      <Line options={chartOptions} data={chartData} />
    </div>
  );
}
