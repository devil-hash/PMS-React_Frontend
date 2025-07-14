import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface TeamPerformanceChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  };
  showLegend?: boolean;
  showTooltips?: boolean;
}

const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({
  data,
  showLegend = true,
  showTooltips = true,
}) => {
  // Calculate percentages for each performance category
  const total = data.datasets[0].data.reduce((sum, value) => sum + value, 0);
  const percentages = data.datasets[0].data.map(value => 
    total > 0 ? ((value / total) * 100).toFixed(1) : 0
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        display: showLegend,
        labels: {
          generateLabels: (chart: any) => {
            const datasets = chart.data.datasets;
            return datasets[0].data.map((data: number, i: number) => ({
              text: `${chart.data.labels[i]} - ${percentages[i]}%`,
              fillStyle: datasets[0].backgroundColor[i],
              strokeStyle: datasets[0].borderColor[i],
              lineWidth: datasets[0].borderWidth,
              hidden: false,
              index: i,
            }));
          },
          padding: 20,
          boxWidth: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        enabled: showTooltips,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = percentages[context.dataIndex];
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
      title: {
        display: true,
        text: 'Performance Distribution',
        font: {
          size: 16,
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <div className="relative h-96">
        <Pie data={data} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>Performance distribution based on completed reviews</p>
        <p className="mt-1">Total reviews analyzed: {total}</p>
      </div>
    </div>
  );
};

export default TeamPerformanceChart;