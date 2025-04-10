"use client";
import CountChart from "@/components/CountChart";
import EventCalendar from "@/components/EventCalendar";
import FinanceChart from "@/components/FinanceChart";
import UserCard from "@/components/UserCard";
import WeeklyRecap from "@/components/WeeklyRecap";
import { useEffect, useState } from "react";
import axios from 'axios';
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth"; 
import NotificationSetup from "@/components/NotificationSetup"; // Adjust the path if needed


const AdminPage = () => {
  const baseURL = "https://www.offerboats.com";
  const [totalBookings, setTotalBookings] = useState<number | null>(null);
  const [totalTodaysBookings, setTotalTodaysBookings] = useState<number | null>(null);
  const [totalListing, setTotalListing] = useState<number | null>(null);
  const [totalTodaysTransaction, setTotalTodaysTransaction] = useState<number | null>(null);
  const [totalAcceptedBookings, setTotalAcceptedBookings] = useState<number | null>(null);
  const [totalPendintBookings, setTotalPendintBookings] = useState<number | null>(null);
  const [users, setUsers] = useState({ BoatOwner: 0, BoatRenter: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  useAuth();
  useEffect(() => {
    const fetchTotalBookings = async () => {
      setLoading(true);
      try {
        const bookingResponse = await axios.get(`${baseURL}/booking/totalBookings`);
        setTotalBookings(bookingResponse.data.totalBookings);
      } catch (err) {
        setTotalBookings(0);
      }
      try{
        const listingResponse = await axios.get(`${baseURL}/listing/totalListings`);
        setTotalListing(listingResponse.data.totalListings);
      }
      catch (err) {
        setTotalListing(0);
      }
      try{
        const usersResponse = await axios.get(`${baseURL}/user/user-counts`);
        setUsers(usersResponse.data);
      }
      catch (err) {
        setUsers({ BoatOwner: 0, BoatRenter: 0 })
      }
      try{
        const todaysBookingResponse = await axios.get(`${baseURL}/booking/todays-bookings-count`);
        setTotalTodaysBookings(todaysBookingResponse.data.count);
      }
      catch (err) {
        setTotalTodaysBookings(0)
      }
      try{
        const todaysTransactionResponse = await axios.get(`${baseURL}/booking/transactions`);
        const amount = todaysTransactionResponse.data.totalAmount / 100;
        setTotalTodaysTransaction(amount);
      }
      catch (err) {
        setTotalTodaysTransaction(0)
      }
      try {
        const response = await axios.get('https://www.offerboats.com/booking/booking-counts'); // Adjust the path if necessary
        setTotalPendintBookings(response.data.pendingBookings); 
        setTotalAcceptedBookings(response.data.acceptedBookings); 
      } catch (err) {
        setTotalPendintBookings(0)
        setTotalAcceptedBookings(0)
        }
      finally {
        setLoading(false);
      }
    };

    fetchTotalBookings();
  }, []);

   // Calculate total users and percentages
   const totalUsers = users.BoatOwner + users.BoatRenter;
   const renterPercentage = totalUsers ? Math.round((users.BoatRenter / totalUsers) * 100) : 0;
   const ownerPercentage = totalUsers ? Math.round((users.BoatOwner / totalUsers) * 100) : 0;
 
   const chartData = [
     {
       name: "Total",
       count: totalUsers,
       fill: "white",
     },
     {
       name: "Owners",
       count: users.BoatOwner,
       fill: "#90bb8e",
     },
     {
       name: "Renters",
       count: users.BoatRenter,
       fill: "#1f8aba",
     },
   ];

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* Initialize NotificationSetup */}
    <NotificationSetup /> 
       <Loader state={loading} />
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Booking" count={totalBookings} bgColor="#D4D3F1"/>
          <UserCard type="Listing" count={totalListing} bgColor="#e98989"/>
          <UserCard type="Owner" count={users.BoatOwner} bgColor="#90bb8e"/>
          <UserCard type="Renter" count={users.BoatRenter} bgColor="#1f8aba"/>
        </div>
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Today's Total Booking" count={totalTodaysBookings} bgColor="#b8acb0"/>
          <UserCard type="Today's Total Transaction" count={totalTodaysTransaction} bgColor="#F3DBAD"/>
          <UserCard type="Total Pending Booking" count={totalPendintBookings} bgColor="#FFE5CC"/>
          <UserCard type="Total Accepted Booking" count={totalAcceptedBookings} bgColor="#CCFFFF"/>
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
             <CountChart
              renter={users.BoatRenter}
              owner={users.BoatOwner}
              data={chartData}
              renterPercentage={renterPercentage}
              ownerPercentage={ownerPercentage}
            />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <WeeklyRecap />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default AdminPage;
