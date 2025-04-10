"use client";
import Image from "next/image";
import {
  RadialBar,
  RadialBarChart,
  ResponsiveContainer
} from "recharts";

interface CountCardProps {
  renter: number | null; 
  owner: number | null; 
  data: { name: string; count: number; fill: string }[]; // Define data type
  renterPercentage: number; // Add percentage props
  ownerPercentage: number;
}

const CountChart = ({ renter, owner, data, renterPercentage, ownerPercentage }: CountCardProps) => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Users</h1>
      </div>
      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt="OfferBoat Admin Panel"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>
      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-cyan-600 rounded-full" />
          <h1 className="font-bold">{renter}</h1>
          <h2 className="text-xs text-gray-600">Renters ({renterPercentage}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 rounded-full" style={{ backgroundColor: "#90bb8e" }} />
          <h1 className="font-bold">{owner}</h1>
          <h2 className="text-xs text-gray-600">Owners ({ownerPercentage}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
