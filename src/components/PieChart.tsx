// src/components/PieChart.tsx
import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  colors?: string[];
  title?: string;
  width?: number | string;
  height?: number;
  outerRadius?: number;
  innerRadius?: number;
  legendVerticalAlign?: 'top' | 'bottom' | 'middle';
  legendLayout?: 'horizontal' | 'vertical';
  showLabel?: boolean;
}

const DEFAULT_COLORS = ['#4CAF50', '#FFB300', '#F44336', '#03A9F4', '#9C27B0', '#607D8B'];

export const PieChart: React.FC<PieChartProps> = ({
  data,
  colors = DEFAULT_COLORS,
  title,
  width = '100%',
  height = 300,
  outerRadius = 80,
  innerRadius = 0,
  legendVerticalAlign = 'bottom',
  legendLayout = 'horizontal',
  showLabel = true
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="pie-chart-empty">
        <p>No data available</p>
      </div>
    );
  }

  const getColor = (entry: PieChartData, index: number) => 
    entry.color || colors[index % colors.length];

  return (
    <div className="pie-chart-container">
      {title && <h4 className="pie-chart-title">{title}</h4>}
      <div style={{ width, height }}>
        <ResponsiveContainer>
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              label={showLabel ? ({
                name,
                percent
              }) => `${name}: ${(percent * 100).toFixed(0)}%` : false}
              labelLine={showLabel}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry, index)} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string) => [
                value, 
                name
              ]} 
            />
            <Legend 
              layout={legendLayout}
              verticalAlign={legendVerticalAlign}
              height={legendVerticalAlign === 'bottom' ? 36 : undefined}
              wrapperStyle={{
                paddingTop: legendVerticalAlign === 'top' ? '0' : '0px'
              }}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    </div>
    

  );
};
export default PieChart;
