"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

type Package = {
  _id: string;
  price: string;
  hours: string;
};

type User = {
  firstName: string;
  lastName: string;
  profilePicture: string;
  email: string;
};

type Booking = {
  userId: User;
  _id: string;
  packages: Package[];
  date: string;
  time?: string;
  location: string;
  status: string;
};

const EventCalendar = () => {
  const router = useRouter();
  const [value, onChange] = useState<Value>(new Date());
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://www.offerboats.com/booking/upcomingBookings");

        if (response.data.success && response.data.bookings) {
          // Sort bookings by date, assuming date is in 'DD-MM-YYYY' format
          const sortedBookings = response.data.bookings.sort((a: Booking, b: Booking) => {
            const dateA = new Date(a.date.split("-").reverse().join("-")); // Convert to 'YYYY-MM-DD'
            const dateB = new Date(b.date.split("-").reverse().join("-"));
            return dateA.getTime() - dateB.getTime();
          });

          // Set only the latest 3 bookings
          setUpcomingBookings(sortedBookings.slice(0, 3));  // Get latest 3 bookings
        } else {
          setError("No upcoming bookings found.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to load bookings.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookingClick = (id: string) => {
    router.push(`/list/bookings/${id}`);
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="bg-white p-7 rounded-lg shadow-md">
      <Calendar onChange={onChange} value={value} />
      {upcomingBookings.length > 0 && (
      <div className="flex items-center justify-between mt-6">
        <h1 className="text-2xl font-semibold text-gray-700">Upcoming Bookings</h1>
        <Link href={`/list/bookings`}>
          <span className="text-sm text-blue-500 cursor-pointer">View All</span>
        </Link>
      </div>
        )}
   
      {upcomingBookings.length <= 0 && (
        <p className="text-sm text-gray-500 mt-5">No Upcoming Bookings</p>
      )}
      <div className="flex flex-col gap-6 mt-4">
        {upcomingBookings?.map((booking) => (
          <div
            className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            key={booking._id}
            onClick={() => handleBookingClick(booking._id)}
          >
            <div className="flex items-start gap-4">
              <Image
                src={booking.userId.profilePicture}
                alt="OfferBoat Admin Panel"
                width={50}
                height={50}
                className="rounded-full object-cover"
              />
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h1 className="text-sm font-medium text-gray-800">{`${booking.userId.firstName} ${booking.userId.lastName}`}</h1>
                  <span className="text-xs text-gray-500">
                    {booking.date} at {booking.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{booking.location}</p>
                <p className="mt-2 text-xs font-medium text-green-500">{booking.status}</p>
                <div className="mt-3 space-y-1">
                  {booking.packages.map((pkg) => (
                    <div key={pkg._id} className="text-sm text-gray-600">
                      <p>Price: <span className="font-semibold">{pkg.price}</span></p>
                      <p>Duration: {pkg.hours} hours</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
