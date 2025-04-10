"use client";
import FormModal from "@/components/FormModal";
import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import Sort from "@/components/Sort";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

type Listing = {
  ownerId: any;
  _id: string;
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  profilePicture: string;
  email: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Title", accessor: "title", className: "hidden md:table-cell" },
  { header: "Location", accessor: "location", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Listings = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 30; 
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

   // Use SWR to fetch the listing
   const { data: allListing, error, isLoading, mutate } = useSWR<Listing[]>(
    `${baseURL}/listing/listings`,
    fetcher
  );

    // Handle search functionality
    const handleSearch = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page after search
    };

       // Filter users based on the search term
   const filteredListings = allListing?.filter(listing =>
    listing?.ownerId?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing?.ownerId?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing?.ownerId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing?.title?.toLowerCase().includes(searchTerm.toLowerCase()) 
  ) || [];

  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredListings.slice(startIndex, endIndex);

  const handleSort = (field: string, direction: "asc" | "desc") => {
    const sorted = [...filteredListings].sort((a, b) => {
      let comparison = 0;
      if (field === "username") {
        const nameA = `${a.ownerId.firstName} ${a.ownerId.lastName}`.toLowerCase();
        const nameB = `${b.ownerId.firstName} ${b.ownerId.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      }
      return direction === "asc" ? comparison : -comparison;
    });
    mutate(sorted, false); 

  };

  const handleSuccess = () => {
    mutate(); 
  };

  const renderRow = (item: Listing) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.ownerId.profilePicture}
          alt="OfferBoat Admin Panel"
          width={40}
          height={40}
          className="hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.ownerId.firstName} {item.ownerId.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            {item.ownerId.email.length > 17 ? `${item.ownerId.email.slice(0, 17)}...` : item.ownerId.email}
            </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.title.length > 20 ? `${item.title.slice(0, 20)}...` : item.title}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/listings/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="OfferBoat Admin Panel" width={16} height={16} />
            </button>
          </Link>
          <FormModal table="listing" type="delete" id={item._id} onSuccess={handleSuccess}/>
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
       <div>Failed to load users</div>
      )}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Listings</h1>
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
        totalItems={filteredListings.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Function to update the current page
      />
    </div>
  );
};

export default Listings;
