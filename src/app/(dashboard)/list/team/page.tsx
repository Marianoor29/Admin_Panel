"use client";
import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { useState } from "react";
import Sort from "@/components/Sort";
import Loader from "@/components/Loader";
import useSWR from "swr";

// Define the Team type
type Team = {
  _id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email?: string;
  profilePicture: string;
  phoneNumber: string;
  type: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "userName", accessor: "userName", className: "hidden md:table-cell" },
  { header: "Type", accessor: "type", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TeamMember = () => {
  const baseURL = "https://www.offerboats.com";
  const itemsPerPage = 10; // Number of items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Use SWR to fetch the team members
  const { data: allUsers, error, isLoading, mutate } = useSWR<Team[]>(
    `${baseURL}/team/teams`,
    fetcher
  );

  // Handle search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page after search
  };

  // Filter users based on the search term
  const filteredUsers = allUsers?.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phoneNumber.includes(searchTerm.toLowerCase())
  ) || [];

  // Handle sorting updates
  const handleSort = (field: string, direction: "asc" | "desc") => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let comparison = 0;
      if (field === "username") {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        comparison = nameA.localeCompare(nameB);
      }
      return direction === "asc" ? comparison : -comparison;
    });
    mutate(sorted, false); // Update SWR cache with sorted data
  };

  // Calculate start and end indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  const handleSuccess = () => {
    mutate(); // Refetch the team members after a create or update action
  };

  const renderRow = (item: Team) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={
            item.profilePicture ? item.profilePicture : "/avatar.png"
          }
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
            {item.email}
            </p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.userName}</td>
      <td className="hidden md:table-cell">{item.type}</td>
      <td className="hidden md:table-cell">{item.phoneNumber}</td>
      <td>
        <div className="flex items-center gap-2">
          <FormModal table="team" type="delete" id={item._id} onSuccess={handleSuccess} />
          <FormModal table="team" type="update" data={item} onSuccess={handleSuccess} />
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
       <div>Failed to load team members</div>
      )}
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          All Team Members
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <Sort onSort={handleSort} />
            <FormModal table="team" type="create" onSuccess={handleSuccess} />
            <FormModal table="teamPassword" type="updatePassword" onSuccess={handleSuccess} />
          </div>
        </div>
      </div>

      {/* LIST */}
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

export default TeamMember;
