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

// Define the Users type
type Users = {
  _id: string;
  rating: number;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  profilePicture: string;
  phoneNumber: string;
  userType: string;
};

// Define the columns for the table
const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "UserType",
    accessor: "userType",
    className: "hidden md:table-cell",
  },
  {
    header: "Location",
    accessor: "location",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Rating",
    accessor: "rating",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const UsersList = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 30;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

    // Use SWR to fetch the user
    const { data: allUsers, error, isLoading, mutate } = useSWR<Users[]>(
      `${baseURL}/user/users`,
      fetcher
    );
  
    // Handle search functionality
    const handleSearch = (term: string) => {
      setSearchTerm(term);
      setCurrentPage(1); // Reset to first page after search
    };

   // Filter users based on the search term
   const filteredUsers = allUsers?.filter(user =>
    user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.userType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.phoneNumber?.toString().includes(searchTerm.toLowerCase()) 
  ) || [];

  // Handle sorting updates from Sort component
  const handleSort = (field: string, direction: "asc" | "desc") => {
    const sorted = [...filteredUsers].sort((a, b) => {
      if (field === "username") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        if (nameA < nameB) return direction === "asc" ? -1 : 1;
        if (nameA > nameB) return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
    mutate(sorted, false); 
  };
 
   // Calculate start and end indices for the current page
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentItems = filteredUsers.slice(startIndex, endIndex);
 
   const handleSuccess = () => {
     mutate(); // Refetch the team members after a create or update action
   };

  // Render each row of the table
  const renderRow = (item: Users) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.profilePicture}
          alt="OfferBoat Admin Panel"
          width={40}
          height={40}
          className="hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.firstName} {item.lastName}
          </h3>
          <p className="text-xs text-gray-500">
            {item?.email.length > 17 ? `${item?.email.slice(0, 17)}...` : item?.email}
            </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.userType}</td>
      <td className="hidden md:table-cell">{item.location}</td>
      <td className="hidden md:table-cell">{item.phoneNumber}</td>
      <td className="hidden md:table-cell">{item.rating}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/users/${item._id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="OfferBoat Admin Panel" width={16} height={16} />
            </button>
          </Link>
          {/* Show delete/create options only for admin */}
            <FormModal table="user" type="delete" id={item._id} onSuccess={handleSuccess}/>
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
        <h1 className="hidden md:block text-lg font-semibold">Users</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <Sort onSort={handleSort} />
            <FormModal table="user" type="create" onSuccess={handleSuccess} />
          </div>
        </div>
      </div>
        <Table columns={columns} renderRow={renderRow} data={currentItems} />

      {/* PAGINATION */}
      <Pagination
        totalItems={filteredUsers.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage} // Function to update the current page
      />
    </div>
  );
};

export default UsersList;
