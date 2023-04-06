export const DEFAULT_LINE_CHART_OPTIONS = {
  animation: {
    duration: 400,
  },
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
