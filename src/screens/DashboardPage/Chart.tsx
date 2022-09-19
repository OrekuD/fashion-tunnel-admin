import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { useWindowSize } from "usehooks-ts";
import { useSelectState } from "../../store/selectors";

const Chart = () => {
  const { width } = useWindowSize();
  const { summary } = useSelectState();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={width <= 375 ? 300 : 500}
        height={300}
        data={summary.chart}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="orders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="users" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* <Line
          type="monotone"
          dataKey="orders"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="users" stroke="#82ca9d" /> */}
        <Area
          type="monotone"
          dataKey="users"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#users)"
        />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#orders)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Chart;
