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
import styles from "./AddressBalanceChart.module.css";

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

const DEFAULT_CHART_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        padding: 16,
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
    },
    y: {
      border: {
        display: false,
      },
      ticks: {
        format: {
          notation: "compact" as const,
          compactDisplay: "short" as const,
          minimumSignificantDigits: 1,
          maximumSignificantDigits: 3,
        },
      },
    },
  },
};

// TODO: Generate these dynamically
const COLORS = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
];

interface Props {
  data: BtcAddressChartData;
  height?: string;
  timeUnit?: TimeUnit;
}

export default function AddressBalanceChart({ data, height, timeUnit }: Props) {
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
      ...DEFAULT_CHART_OPTIONS,
      scales: {
        ...DEFAULT_CHART_OPTIONS.scales,
        x: {
          ...DEFAULT_CHART_OPTIONS.scales.x,
          time: {
            unit: timeUnit,
          },
        },
      },
    };
  }, [timeUnit]);

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
