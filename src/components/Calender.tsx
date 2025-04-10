"use client";
import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

type Booking = {
  packages: any;
  id: number;
  date: string; // format: '15-09-2024' (DD-MM-YYYY)
  firstName: string;
  lastName: string;
  time?: string;
  location: string;
  profilePicture: string;
  status: string;
};

type CalendarProps = {
  bookings: Booking[];
  onDateSelect: (date: string) => void;
};

// Helper function to convert DD-MM-YYYY to YYYY-MM-DD
const convertToISODate = (dateString: string): string => {
  const [day, month, year] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

// Helper function to convert from Date object to DD-MM-YYYY format
const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const Calender = ({ bookings, onDateSelect }: CalendarProps) => {
  const [date, setDate] = useState<Date | null>(new Date());

  // Filter to show only future bookings
  const upcomingBookings = bookings.filter(
    (booking) => new Date(convertToISODate(booking.date)) >= new Date()
  );

  // Get booking counts for a specific date
  const getBookingCountForDate = (date: Date): number => {
    const selectedDate = formatDateToDDMMYYYY(date); // Convert date to DD-MM-YYYY
    return upcomingBookings.filter(
      (booking) => booking.date === selectedDate
    ).length;
  };

  // Handle date click event by calling the passed `onDateSelect` prop
  const handleDateClick = (selectedDate: Date) => {
    const selectedDateString = formatDateToDDMMYYYY(selectedDate);
    const filteredBookings = upcomingBookings.filter(
      (booking) => booking.date === selectedDateString
    );
    if (filteredBookings.length > 0) {
      onDateSelect(selectedDateString); // Pass the date in DD-MM-YYYY format
    }
  };

  const handleDateChange = (value: any) => {
    if (value instanceof Date) {
      setDate(value); // Only set date if it's a valid Date object
    }
  };

  return (
    <div className="flex justify-center p-4">
      <Calendar
        onChange={handleDateChange}
        value={date}
        minDate={new Date()} // Disable past dates
        tileContent={({ date }) => {
          const count = getBookingCountForDate(date);
          return count > 0 ? (
            <div className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center">
              {count}
            </div>
          ) : null;
        }}
        onClickDay={handleDateClick}
        className="border rounded-lg shadow-md p-4 w-full max-w-xs md:max-w-md bg-white"
      />
    </div>
  );
};

export default Calender;
