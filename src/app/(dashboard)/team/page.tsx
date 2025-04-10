"use client";
import EventCalendar from "@/components/EventCalendar";
import Loader from "@/components/Loader";
import MessagesList from "@/components/MessagesList";
import NotificationSetup from "@/components/NotificationSetup"; // Adjust the path if needed
import Review from "@/components/Review";
import UserCard from "@/components/UserCard";
import axios from 'axios';
import Link from "next/link";
import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth"; 

const TeamPage = () => {
  const baseURL = "https://www.offerboats.com";
  const [totalBookings, setTotalBookings] = useState<number | null>(null);
  const [totalListing, setTotalListing] = useState<number | null>(null);
  const [todaysHelpMessages, setTodaysHelpMessages] = useState<number | null>(null);
  const [reviews, setreviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalAcceptedBookings, setTotalAcceptedBookings] = useState<number | null>(null);
  const [totalPendintBookings, setTotalPendintBookings] = useState<number | null>(null);
  useAuth();
  useEffect(() => {
    const fetchTotalBookings = async () => {
      setLoading(true);
      try {
        const bookingResponse = await axios.get(`${baseURL}/booking/todaysBookings`);
        setTotalBookings(bookingResponse.data.todayBookings);
      } catch (err) {
        setTotalBookings(0);
      }
      try{
        const listingResponse = await axios.get(`${baseURL}/listing/todaysListings`);
        setTotalListing(listingResponse.data.todayListings);
      }
      catch (err) {
        setTotalListing(0);
      }
      try{
        const messagesResponse = await axios.get(`${baseURL}/team/todaysHelpMessages`);
        setTodaysHelpMessages(messagesResponse.data.todayMessages);
      }
      catch (err) {
        setTodaysHelpMessages(0);
      }
      try{
        const reviewResponse = await axios.get(`${baseURL}/user/allRatings`);
        setreviews(reviewResponse.data.ratings);
      }
      catch (err) {
        setreviews([]);
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

  const latestReviews = reviews
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 12);

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
           {/* Initialize NotificationSetup */}
    <NotificationSetup /> 
       <Loader state={loading} />
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UserCard type="Today's total booking"  count={totalBookings} bgColor="#D4D3F1" />
          <UserCard type="Today's total listing" count={totalListing} bgColor="#e98989"/>
          <UserCard type="Today's total message" count={todaysHelpMessages} bgColor="#90bb8e"/>
        </div>
        <div className="flex gap-4 justify-between flex-wrap">
        <UserCard type="Total Pending Booking" count={totalPendintBookings} bgColor="#FFE5CC"/>
          <UserCard type="Total Accepted Booking" count={totalAcceptedBookings} bgColor="#CCFFFF"/>
        </div>
        {/* MIDDLE CHARTS */}
        <div className="w-full lg:flex-row">
          {/* HELP MESSAGES */}
         <MessagesList />
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-full">
          {/* <FinanceChart /> */}
          <EventCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="bg-white p-4 rounded-md w-full lg:w-1/3 flex flex-col ">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Reviews</h1>
            {reviews.length > 0 && (
              <Link
                href={{
                  pathname: '/list/reviews',
                  query: { reviews: encodeURIComponent(JSON.stringify(reviews)) },
                }}
              >
                <span className="text-xs text-gray-400">View All</span>
              </Link>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="text-gray-500 mt-4">This user has no reviews yet!</p>
          ) : (
          latestReviews.map((review: any) => (
            <Review
              key={review._id} 
              firstName={review.renterId ? review.renterId.firstName : review.ownerId.firstName}
              lastName={review.renterId ? review.renterId.lastName : review.ownerId.lastName}
              rating={review.rating}
              reviewText={review.reviewText}
              createdAt={review.createdAt}
              ratingId={review._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TeamPage;
