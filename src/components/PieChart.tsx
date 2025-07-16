// components/BarChart.tsx
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend,
  LabelList,
} from 'recharts';

interface BarChartData {
  name: string;
  value: number;
  color?: string; // Optional, can still override
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
}

const defaultColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#14b8a6'];

const BarChart: React.FC<BarChartProps> = ({ data, title }) => {
  return (
    <div className="w-full h-full">
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={data.length * 60}>
        <RechartsBarChart
          layout="vertical"
          data={data}
          margin={{ top: 10, right: 40, left: 40, bottom: 10 }}
          barCategoryGap={15}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 14, fontWeight: 500 }}
            width={120}
          />
          <Tooltip />
          
          <Bar dataKey="value" barSize={22} radius={[0, 10, 10, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || defaultColors[index % defaultColors.length]}
              />
            ))}
            <LabelList
              dataKey="value"
              position="right"
              style={{ fill: '#111827', fontWeight: 'bold' }}
            />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
