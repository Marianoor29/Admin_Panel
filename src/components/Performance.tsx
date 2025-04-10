"use client";
import { PieChart, Pie, ResponsiveContainer } from "recharts";

type PerformanceProps = {
  data: { name: string; value: number; fill: string }[];
  ratingValue: number; 
};

const Performance = ({ data, ratingValue }: PerformanceProps) => {
  return (
    <div className="bg-white p-4 rounded-md h-60 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Rating</h1>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            fill="#8884d8"
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-2xl font-bold">{ratingValue}</h1>
        <p className="text-xs text-gray-500">
          {ratingValue} out of 5
        </p>
      </div>
    </div>
  );
};

export default Performance;
