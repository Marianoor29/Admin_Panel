"use client";
import { useState, useEffect, Suspense } from "react";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Sort from "@/components/Sort";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { role } from "@/lib/data";
import { useSearchParams, useRouter } from 'next/navigation';


type Booking = {
  user: any;
  userId: any;
  _id: string ;
  packages: any;
  id: number;
  date: string;
  firstName: string;
  lastName: string;
  time?: string;
  location: string;
  profilePicture: string;
  status: string;
  email: string;
};

const columns = [
  { header: "Renter Info", accessor: "info" },
  { header: "location", accessor: "location", className: "hidden md:table-cell" },
  { header: "status", accessor: "status", className: "hidden md:table-cell" },
  { header: "package", accessor: "package", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const UpcomingBookings = () => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const baseURL = "https://www.offerboats.com"; 
  const searchParams = useSearchParams();
  const router = useRouter();
  const date = searchParams.get('date');
  const userString = searchParams.get('user');

  // Decode and parse the user object
  const user = userString ? JSON.parse(decodeURIComponent(userString)) : null;

   // Update current page from search params
   useEffect(() => {
    const pageParam = searchParams.get('page');
    if (pageParam) {
      const page = parseInt(pageParam, 10);
      if (!isNaN(page)) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, endIndex);

  // Fetch bookings from the backend API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${baseURL}/booking/userUpcomingBookings`,{
        params: {
          userId: user?._id,
          date,
          userType: user?.userType,
        },
      });
      setBookings(response.data); 
      setFilteredBookings(response.data);

      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };
    
    fetchBookings(); // Call the function on component mount
  }, []);

  const handleSearch = (searchTerm: string) => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const newFilteredBookings = bookings.filter(booking =>
      booking?.userId?.firstName.toLowerCase().includes(lowercasedTerm) ||
      booking?.userId?.lastName.toLowerCase().includes(lowercasedTerm) ||
      booking?.status.toLowerCase().includes(lowercasedTerm) ||
      booking?.location.toLowerCase().includes(lowercasedTerm) ||
      booking?.userId?.email.toLowerCase().includes(lowercasedTerm)
    );
    setFilteredBookings(newFilteredBookings);
  };

    // Handle sorting updates from Sort component
    const handleSort = (field: string, direction: "asc" | "desc") => {
      const sorted = [...filteredBookings].sort((a, b) => {
        if (field === "username") {
          const nameA = `${a?.userId?.firstName} ${a?.userId?.lastName}`.toLowerCase();
          const nameB = `${b?.userId?.firstName} ${b?.userId?.lastName}`.toLowerCase();
          if (nameA < nameB) return direction === "asc" ? -1 : 1;
          if (nameA > nameB) return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      setFilteredBookings(sorted);
    };


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Update URL with the new page number
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', newPage.toString());
    router.replace(`?${newSearchParams.toString()}`); // Update URL without refreshing the page
  };


  const renderRow = (item: Booking) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.userId.profilePicture}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.userId.firstName} {item.userId.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item.userId.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td className="hidden md:table-cell">{item.packages[0].price} for {item.packages[0].hours} Hours</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/bookings/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="booking" type="delete" id={item._id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <button
            className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-lg shadow-md"
            onClick={() => router.back()}
          >
            &#8592; Back
          </button>
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Upcoming Bookings for {date}</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <Sort onSort={handleSort} />
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentItems} />

      {/* PAGINATION */}
      <Pagination
        totalItems={filteredBookings.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
         onPageChange={handlePageChange}// Function to update the current page
      />
    </div>
  );
};

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Loading bookings...</div>}>
      <UpcomingBookings />
    </Suspense>
  );
}
// export default UpcomingBookings;
