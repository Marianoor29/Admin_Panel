"use client";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Sort from "@/components/Sort";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

type Offers = {
  price: string;
  hours: string;
  userId: any;
  _id: string | undefined;
  date: string;
  firstName: string;
  lastName: string;
  time?: string;
  location: string;
  profilePicture: string;
  email: string;
};

type OffersResponse = {
  offers: Offers[];
};
const columns = [
  { header: "Info", accessor: "info" },
  { header: "location", accessor: "location", className: "hidden md:table-cell" },
  { header: "date", accessor: "date", className: "hidden md:table-cell" },
  { header: "package", accessor: "package", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const CustomOffersList = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Use SWR to fetch the booking
  const { data: allOffers, error, isLoading, mutate } = useSWR<OffersResponse>(
    `${baseURL}/getAllCustomOffers`,
    fetcher
  );

  const customOffers =  allOffers?.offers || [];
  // Handle search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page after search
  };
  // Filter users based on the search term
  const filteredOffers = customOffers?.filter((offer: { userId: { firstName: string; lastName: string; email: string; }; location: string; date: string; }) =>
    offer?.userId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer?.userId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer?.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer?.date?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOffers.slice(startIndex, endIndex);

   // Handle sorting updates from Sort component
   const handleSort = (field: string, direction: "asc" | "desc") => {
    const sorted = [...filteredOffers].sort((a, b) => {
      if (field === "username") {
        const nameA = `${a?.userId?.firstName} ${a?.userId?.lastName}`.toLowerCase();
        const nameB = `${b?.userId?.firstName} ${b?.userId?.lastName}`.toLowerCase();
        if (nameA < nameB) return direction === "asc" ? -1 : 1;
        if (nameA > nameB) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    mutate({ ...allOffers, offers: sorted }, false); // Mutate with sorted offers
  };

  const handleSuccess = () => {
    mutate(); // Refetch the team members after a create or update action
  };

  const renderRow = (item: Offers) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.userId?.profilePicture}
          alt="OfferBoat Admin Panel"
          width={40}
          height={40}
          className="hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.userId.firstName} {item.userId.lastName}
          </h3>
          <p className="text-xs text-gray-500">
          {item.userId.email.length > 17 ? `${item.userId.email.slice(0, 17)}...` : item.userId.email}
            </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td className="hidden md:table-cell">{item.price} for {item.hours} Hours</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/customOffers/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="OfferBoat Admin Panel" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="offer" type="delete" id={item._id} onSuccess={handleSuccess} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {isLoading && (
        <Loader state={isLoading} />
      )}
      {error && (
        <div>Failed to load offers</div>
      )}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Custom Offers</h1>
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
        totalItems={filteredOffers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Function to update the current page
      />
    </div>
  );
};

export default CustomOffersList;
