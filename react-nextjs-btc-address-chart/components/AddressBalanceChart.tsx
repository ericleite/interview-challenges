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
        pointStyle: "line",
        usePointStyle: true,
      },
      position: "top" as const,
    },
    tooltip: {
      callbacks: {
        title: function (context: any) {
          return new Intl.DateTimeFormat("en-US", {
            month: "numeric",
            day: "numeric",
            year: "numeric",
          }).format(new Date(context[0].parsed.x));
        },
        labelPointStyle: function () {
          return {
            pointStyle: "line" as const,
            rotation: 0,
          };
        },
        label: function (context: any) {
          let label = context.dataset.label || "";

          if (label) {
            label += ": ";
          }

          if (context.parsed.y !== null) {
            label += new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              minimumSignificantDigits: 1,
              maximumSignificantDigits: 3,
            }).format(context.parsed.y);
          }

          return label;
        },
      },
      intersect: false,
      usePointStyle: true,
    },
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      type: "time" as const,
      time: {
        unit: "year" as const,
      },
    },
    y: {
      border: {
        display: false,
      },
      ticks: {
        callback: function (value: string | number) {
          if (typeof value === "number") {
            return new Intl.NumberFormat("en-US", {
              notation: "compact",
              compactDisplay: "short",
              minimumSignificantDigits: 1,
              maximumSignificantDigits: 3,
            }).format(value);
          }
        },
      },
    },
  },
};

// TODO: Generate these dynamically
const colors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
];

interface Props {
  data: AddressBalanceChartData;
  height?: string;
}

export default function AddressBalanceChart({ data, height }: Props) {
  const chartData = useMemo(() => {
    return {
      labels: data?.labels || [],
      datasets: Object.entries(data?.columns || {}).map(
        ([key, values], index) => ({
          label: `>$${key}`,
          data: values,
          fill: false,
          pointStyle: false as const,
          borderColor: colors[index % colors.length],
          borderWidth: 2,
        })
      ),
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
