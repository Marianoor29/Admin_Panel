"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const WeeklyRecap = () => {
  const [data, setData] = useState([
    { name: "Mon", listings: 0, bookings: 0 },
    { name: "Tue", listings: 0, bookings: 0 },
    { name: "Wed", listings: 0, bookings: 0 },
    { name: "Thu", listings: 0, bookings: 0 },
    { name: "Fri", listings: 0, bookings: 0 },
    { name: "Sat", listings: 0, bookings: 0 },
    { name: "Sun", listings: 0, bookings: 0 },
  ]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await axios.get("https://www.offerboats.com/booking/weekly-recap");
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch weekly data", err);
      }
    };

    fetchWeeklyData();
  }, []);
  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Weekly Recap</h1>
        {/* <Image src="/moreDark.png" alt="" width={20} height={20} /> */}
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "20px", paddingBottom: "40px" }}
          />
          <Bar
            dataKey="listings"
            fill="#e98989"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="bookings"
            fill="#D4D3F1"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyRecap;
