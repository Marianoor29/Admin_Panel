"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const FinanceChart = () => {
  const baseURL = "https://www.offerboats.com";
  const [data, setData] = useState([]);
  const [completedBookings, setCompletedBookings] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${baseURL}/booking/finance`);
      const result = await response.json();
      setData(result.yearlyBookings);
      setCompletedBookings(result.completedBookings);
    } catch (error:any) {
      console.error('Error fetching data:', error);
      alert(`Error: ${error.message}`);
    }
  };

  fetchData();
}, []);


  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finance</h1>
        <p>Completed Bookings: {completedBookings}</p>
        {/* <Image src="/moreDark.png" alt="" width={20} height={20} /> */}
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={20} />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line type="monotone" dataKey="amounts" stroke="#CFCEFF" strokeWidth={5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
