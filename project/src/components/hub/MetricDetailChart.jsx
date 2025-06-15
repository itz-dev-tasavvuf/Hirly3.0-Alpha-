import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const chartConfigs = {
  'Applicants': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [12, 19, 15, 14, 20, 18, 22],
    color: 'rgba(34,211,238,1)',
  },
  'Matches': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [5, 8, 12, 14],
    color: 'rgba(34,197,94,1)',
  },
  'Interviews': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [2, 4, 5, 3],
    color: 'rgba(250,204,21,1)',
  },
  'Offers': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [1, 2, 1, 1],
    color: 'rgba(168,85,247,1)',
  },
  'Hires': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [0, 1, 2, 0],
    color: 'rgba(236,72,153,1)',
  },
  'Avg. Time to Fill': {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    data: [28, 25, 23, 21],
    color: 'rgba(251,146,60,1)',
  },
};

const MetricDetailChart = ({ label }) => {
  const config = chartConfigs[label] || chartConfigs['Applicants'];
  const data = {
    labels: config.labels,
    datasets: [
      {
        label,
        data: config.data,
        fill: false,
        borderColor: config.color,
        backgroundColor: config.color,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#fff' } },
      y: { grid: { color: 'rgba(255,255,255,0.08)' }, ticks: { color: '#fff' } },
    },
  };
  return (
    <div className="w-full h-48 mb-4">
      <Line data={data} options={options} />
    </div>
  );
};

export default MetricDetailChart;
